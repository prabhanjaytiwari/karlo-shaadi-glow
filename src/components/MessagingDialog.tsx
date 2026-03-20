import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2, WifiOff } from "lucide-react";
import { messageFormSchema, sanitizeInput } from "@/lib/validation";

interface MessagingDialogProps {
  vendorId: string;
  vendorName: string;
  children?: React.ReactNode;
}

export function MessagingDialog({ vendorId, vendorName, children }: MessagingDialogProps) {
  const { toast } = useToast();
  const { isOnline, queueMessage } = useOfflineSync();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [vendorUserId, setVendorUserId] = useState<string | null>(null);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      loadMessages(user.id);
    }
  };

  useEffect(() => {
    if (open) {
      checkAuth();
    }
  }, [open]);

  const loadMessages = async (userId: string) => {
    setLoading(true);
    try {
      // Get vendor's user_id first
      const { data: vendor } = await supabase
        .from("vendors")
        .select("user_id")
        .eq("id", vendorId)
        .single();

      if (!vendor) {
        setLoading(false);
        return;
      }
      setVendorUserId(vendor.user_id);

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${vendor.user_id}),and(sender_id.eq.${vendor.user_id},recipient_id.eq.${userId})`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!user || !message.trim()) return;

    const trimmedMessage = message.trim();
    
    const parseResult = messageFormSchema.safeParse({ message: trimmedMessage });
    if (!parseResult.success) {
      toast({
        title: "Validation error",
        description: parseResult.error.errors[0]?.message || "Invalid message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // Get vendor's user_id if not already cached
      let recipientId = vendorUserId;
      if (!recipientId) {
        const { data: vendor } = await supabase
          .from("vendors")
          .select("user_id")
          .eq("id", vendorId)
          .single();

        if (!vendor) throw new Error("Vendor not found");
        recipientId = vendor.user_id;
        setVendorUserId(recipientId);
      }

      const sanitizedMessage = sanitizeInput(trimmedMessage);
      
      // Use offline-aware queue
      const result = await queueMessage(user.id, recipientId, sanitizedMessage);

      if (result.success) {
        // Add optimistic message to UI
        const optimisticMessage = {
          id: result.id || `temp_${Date.now()}`,
          sender_id: user.id,
          recipient_id: recipientId,
          message: sanitizedMessage,
          created_at: new Date().toISOString(),
          read: false,
          _pending: result.offline,
        };
        
        setMessages(prev => [...prev, optimisticMessage]);
        setMessage("");

        toast({
          title: result.offline ? "Message queued" : "Message sent",
          description: result.offline 
            ? "Will be sent when you're back online" 
            : "The vendor will respond soon",
        });

        // Reload messages if online to get the actual message
        if (!result.offline) {
          setTimeout(() => loadMessages(user.id), 500);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="secondary" size="lg">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with Vendor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chat with {vendorName}</DialogTitle>
          <DialogDescription>
            Send a message to discuss your requirements
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Please log in to send messages</p>
            <Button onClick={() => window.location.href = "/auth"}>Log In</Button>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px] pr-4">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender_id === user.id
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted"
                        } ${msg._pending ? "opacity-70" : ""}`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <p className="text-xs opacity-70">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                          {msg._pending && (
                            <WifiOff className="h-3 w-3 opacity-50" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage} disabled={sending || !message.trim()}>
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}