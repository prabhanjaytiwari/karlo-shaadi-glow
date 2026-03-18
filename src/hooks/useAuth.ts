import { useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface UserRole {
  role: 'admin' | 'vendor' | 'couple';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const fetchUserRoles = useCallback(async (userId: string) => {
    setRolesLoading(true);
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
    } finally {
      setRolesLoading(false);
    }
  }, []);

  // Fetch roles whenever user changes
  useEffect(() => {
    if (user) {
      fetchUserRoles(user.id);
    } else {
      setUserRoles([]);
      setRolesLoading(false);
    }
  }, [user, fetchUserRoles]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    rolesLoading,
    isAuthenticated: !!session,
    userRoles,
    hasRole,
    isAdmin,
    isVendor,
    isCouple,
    signOut,
  };
}