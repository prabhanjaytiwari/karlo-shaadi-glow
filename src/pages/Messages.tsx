import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Search, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  vendorId: string;
  vendorName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
      setupRealtimeSubscription();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedVendor && currentUser) {
      loadMessages(selectedVendor);
    }
  }, [selectedVendor, currentUser]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setCurrentUser(user);
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Group by vendor
      const convMap = new Map<string, Conversation>();
      for (const msg of data || []) {
        const otherId = msg.sender_id === currentUser.id ? msg.recipient_id : msg.sender_id;
        if (!convMap.has(otherId)) {
          convMap.set(otherId, {
            vendorId: otherId,
            vendorName: "Loading...",
            lastMessage: msg.message,
            lastMessageTime: msg.created_at,
            unreadCount: msg.recipient_id === currentUser.id && !msg.read ? 1 : 0,
          });
        } else {
          const conv = convMap.get(otherId)!;
          if (msg.recipient_id === currentUser.id && !msg.read) {
            conv.unreadCount++;
          }
        }
      }

      const conversationsArray = Array.from(convMap.values());
      setConversations(conversationsArray);

      // Fetch actual names for all participants
      const userIds = conversationsArray.map(c => c.vendorId);
      if (userIds.length > 0) {
        // First try to get vendor business names
        const { data: vendorData } = await supabase
          .from("vendors")
          .select("user_id, business_name")
          .in("user_id", userIds);

        // Then get profile names for non-vendors
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        // Update conversations with actual names
        const updatedConversations = conversationsArray.map(conv => {
          const vendor = vendorData?.find(v => v.user_id === conv.vendorId);
          const profile = profileData?.find(p => p.id === conv.vendorId);
          
          return {
            ...conv,
            vendorName: vendor?.business_name || profile?.full_name || "User"
          };
        });

        setConversations(updatedConversations);
      }
    } catch (error: any) {
      toast({
        title: "Error loading conversations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (vendorId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUser.id},recipient_id.eq.${vendorId}),and(sender_id.eq.${vendorId},recipient_id.eq.${currentUser.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark as read
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("recipient_id", currentUser.id)
        .eq("sender_id", vendorId);
    } catch (error: any) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedVendor) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUser.id,
          recipient_id: selectedVendor,
          message: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage("");
      loadMessages(selectedVendor);
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMessageInput = (value: string) => {
    setNewMessage(value);
    handleTyping();
  };

  const setupRealtimeSubscription = () => {
    if (!currentUser) return;

    const messageChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${currentUser.id}`,
        },
        (payload) => {
          if (selectedVendor === payload.new.sender_id) {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
          loadConversations();
        }
      )
      .subscribe();

    // Set up presence for typing indicators
    const presenceChannel = supabase.channel(`typing:${selectedVendor || 'all'}`, {
      config: { presence: { key: currentUser.id } },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const typing = new Set<string>();
        Object.keys(state).forEach((key) => {
          const presenceData = state[key]?.[0] as any;
          if (key !== currentUser.id && presenceData?.typing) {
            typing.add(key);
          }
        });
        setTypingUsers(typing);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(presenceChannel);
    };
  };

  const handleTyping = () => {
    if (!selectedVendor || !currentUser) return;

    const channel = supabase.channel(`typing:${selectedVendor}`);
    channel.track({ typing: true, user_id: currentUser.id });

    // Clear typing after 3 seconds
    setTimeout(() => {
      channel.track({ typing: false, user_id: currentUser.id });
    }, 3000);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <BhindiHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Messages</h1>

          <Card className="h-[600px]">
            <div className="grid md:grid-cols-3 h-full">
              {/* Conversations List */}
              <div className="border-r flex flex-col">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {searchQuery ? "No conversations found" : "No conversations yet"}
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.vendorId}
                        className={`w-full p-4 text-left hover:bg-muted transition-colors border-b ${
                          selectedVendor === conv.vendorId ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedVendor(conv.vendorId)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{conv.vendorName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="font-semibold truncate">{conv.vendorName}</p>
                              {conv.unreadCount > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </ScrollArea>
              </div>

              {/* Messages Area */}
              <div className="md:col-span-2 flex flex-col">
                {selectedVendor ? (
                  <>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.sender_id === currentUser.id ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.sender_id === currentUser.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p>{msg.message}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {format(new Date(msg.created_at), "p")}
                              </p>
                            </div>
                          </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {typingUsers.size > 0 && (
                        <div className="px-4 py-2 text-sm text-muted-foreground italic flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Typing...
                        </div>
                      )}

                      <div className="p-4 border-t flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => handleMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Select a conversation</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}
