import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { EmptyState } from '@/components/EmptyState';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

const typeIcons: Record<string, string> = {
  booking: '📅',
  payment: '💰',
  message: '💬',
  review: '⭐',
  vendor: '🏪',
  deal: '🏷️',
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) setNotifications(data);
    } catch { /* ignored */ } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClick = (n: Notification) => {
    markAsRead(n.id);
    if (n.link) navigate(n.link);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border/30 shadow-[var(--shadow-xs)]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs gap-1">
              <CheckCheck className="h-3.5 w-3.5" />
              Read all
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading…</div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="When vendors respond to your inquiries, bookings update, or you receive messages, they'll show up here."
          actionText="Browse Vendors"
          actionLink="/search"
        />
      ) : (
        <ScrollArea className="h-[calc(100vh-3.5rem-4rem)]">
          <div className="divide-y divide-border">
            {notifications.map(n => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left px-4 py-4 flex gap-3 transition-colors active:bg-muted/50 ${
                  !n.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">
                  {typeIcons[n.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm line-clamp-1 ${!n.read ? 'font-semibold' : 'font-medium'}`}>
                      {n.title}
                    </p>
                    {!n.read && <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">
                    {format(new Date(n.created_at), 'MMM d, h:mm a')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
