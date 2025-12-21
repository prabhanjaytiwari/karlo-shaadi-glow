import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface UserRole {
  role: 'admin' | 'vendor' | 'couple';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    // Set up auth state listener FIRST (prevents missing events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only synchronous state updates here
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer Supabase calls with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setUserRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      setUserRoles([]);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRoles([]);
  };

  const hasRole = (role: 'admin' | 'vendor' | 'couple'): boolean => {
    return userRoles.some(r => r.role === role);
  };

  const isAdmin = hasRole('admin');
  const isVendor = hasRole('vendor');
  const isCouple = hasRole('couple');

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    userRoles,
    hasRole,
    isAdmin,
    isVendor,
    isCouple,
    signOut,
  };
}
