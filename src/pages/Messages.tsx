import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Search, Loader2, ArrowLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const typingChannelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const selectedVendorName = selectedVendor 
    ? conversations.find(c => c.vendorId === selectedVendor)?.vendorName 
    : null;

  useEffect(() => {
    checkUser();
  }, []);

  // FIX 3c: Properly capture and call cleanup on unmount
  useEffect(() => {
    if (currentUser) {
      loadConversations();
      const cleanup = setupRealtimeSubscription();
      cleanupRef.current = cleanup || null;
    }
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [currentUser]);

  useEffect(() => {
    if (selectedVendor && currentUser) {
      loadMessages(selectedVendor);
    }
  }, [selectedVendor, currentUser]);

  // FIX 3b: Create typing channel once when selectedVendor changes
  useEffect(() => {
    if (!selectedVendor || !currentUser) return;

    // Clean up old typing channel
    if (typingChannelRef.current) {
      supabase.removeChannel(typingChannelRef.current);
    }

    const channel = supabase.channel(`typing:${selectedVendor}`, {
      config: { presence: { key: currentUser.id } },
    });
    channel.subscribe();
    typingChannelRef.current = channel;

    return () => {
      if (typingChannelRef.current) {
        supabase.removeChannel(typingChannelRef.current);
        typingChannelRef.current = null;
      }
    };
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

      const userIds = conversationsArray.map(c => c.vendorId);
      if (userIds.length > 0) {
        const { data: vendorData } = await supabase.from("vendors").select("user_id, business_name").in("user_id", userIds);
        const { data: profileData } = await supabase.from("profiles").select("id, full_name").in("id", userIds);

        const updatedConversations = conversationsArray.map(conv => {
          const vendor = vendorData?.find(v => v.user_id === conv.vendorId);
          const profile = profileData?.find(p => p.id === conv.vendorId);
          return { ...conv, vendorName: vendor?.business_name || profile?.full_name || "User" };
        });
        setConversations(updatedConversations);
      }
    } catch (error: any) {
      toast({ title: "Error loading conversations", description: error.message, variant: "destructive" });
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

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("recipient_id", currentUser.id)
        .eq("sender_id", vendorId);

      // FIX 3d: Update local unread count to 0
      setConversations(prev => prev.map(c =>
        c.vendorId === vendorId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error: any) {
      toast({ title: "Error loading messages", description: error.message, variant: "destructive" });
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
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
    }
  };

  const handleMessageInput = (value: string) => {
    setNewMessage(value);
    handleTyping();
  };

  const setupRealtimeSubscription = () => {
    if (!currentUser) return;

    const messageChannel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          // FIX 3a: Update the selected conversation messages inline
          if (selectedVendor === newMsg.sender_id) {
            setMessages((prev) => [...prev, newMsg]);
          }
          // Update conversation list inline instead of full reload
          setConversations(prev => {
            const existing = prev.find(c => c.vendorId === newMsg.sender_id);
            if (existing) {
              return prev.map(c =>
                c.vendorId === newMsg.sender_id
                  ? {
                      ...c,
                      lastMessage: newMsg.message,
                      lastMessageTime: newMsg.created_at,
                      unreadCount: selectedVendor === newMsg.sender_id ? c.unreadCount : c.unreadCount + 1,
                    }
                  : c
              );
            } else {
              // New conversation
              return [
                {
                  vendorId: newMsg.sender_id,
                  vendorName: "Loading...",
                  lastMessage: newMsg.message,
                  lastMessageTime: newMsg.created_at,
                  unreadCount: 1,
                },
                ...prev,
              ];
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  };

  // FIX 3b: Reuse typing channel from ref
  const handleTyping = () => {
    if (!selectedVendor || !currentUser || !typingChannelRef.current) return;

    typingChannelRef.current.track({ typing: true, user_id: currentUser.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      typingChannelRef.current?.track({ typing: false, user_id: currentUser.id });
    }, 3000);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMobileBack = () => {
    setSelectedVendor(null);
  };

  const showConversationList = !isMobile || !selectedVendor;
  const showMessageArea = !isMobile || selectedVendor;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!selectedVendor && <MobilePageHeader title="Messages" showBack={false} />}
      
      <main className={isMobile ? "flex-1" : "flex-1 container mx-auto px-4 pt-18 md:pt-24 pb-4 md:pb-8"}>
        <div className={isMobile ? "h-full" : "max-w-6xl mx-auto"}>
          {!isMobile && <h1 className="text-4xl font-bold mb-8">Messages</h1>}

          <Card className={`overflow-hidden ${isMobile ? 'h-[calc(100vh-8rem)] border-0 rounded-none shadow-none' : 'h-[calc(100vh-12rem)] min-h-[400px] max-h-[800px] shadow-[var(--shadow-sm)]'}`}>
            <div className="grid md:grid-cols-3 h-full">
              {showConversationList && (
                <div className={`border-r border-border/30 flex flex-col ${isMobile && selectedVendor ? 'hidden' : ''}`}>
                  <div className="p-3 md:p-4 border-b border-border/30">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    {filteredConversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">{searchQuery ? "No conversations found" : "No conversations yet"}</p>
                      </div>
                    ) : (
                      filteredConversations.map((conv) => (
                        <button
                          key={conv.vendorId}
                          className={`w-full p-3 md:p-4 text-left hover:bg-muted transition-colors border-b ${selectedVendor === conv.vendorId ? "bg-muted" : ""}`}
                          onClick={() => setSelectedVendor(conv.vendorId)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 md:h-12 md:w-12 shrink-0">
                              <AvatarFallback>{conv.vendorName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <p className="font-semibold truncate text-sm md:text-base">{conv.vendorName}</p>
                                {conv.unreadCount > 0 && (
                                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 shrink-0">{conv.unreadCount}</span>
                                )}
                              </div>
                              <p className="text-xs md:text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                              <p className="text-xs text-muted-foreground mt-1">{format(new Date(conv.lastMessageTime), "MMM d, p")}</p>
                            </div>
                            {isMobile && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                          </div>
                        </button>
                      ))
                    )}
                  </ScrollArea>
                </div>
              )}

              {showMessageArea && (
                <div className={`flex flex-col ${isMobile ? 'col-span-full' : 'md:col-span-2'}`}>
                  {selectedVendor ? (
                    <>
                      {isMobile && (
                        <div className="flex items-center gap-3 p-3 border-b bg-card">
                          <Button variant="ghost" size="icon" onClick={handleMobileBack} className="shrink-0">
                            <ArrowLeft className="h-5 w-5" />
                          </Button>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{selectedVendorName?.[0] || "?"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{selectedVendorName}</p>
                          </div>
                        </div>
                      )}
                      
                      <ScrollArea className="flex-1 p-3 md:p-4">
                        <div className="space-y-3 md:space-y-4">
                          {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 ${msg.sender_id === currentUser.id ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
                                <p className="text-sm md:text-base">{msg.message}</p>
                                <p className="text-xs mt-1 opacity-70">{format(new Date(msg.created_at), "p")}</p>
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

                      <div className="p-3 md:p-4 border-t flex gap-2 bg-card">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => handleMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()} size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}