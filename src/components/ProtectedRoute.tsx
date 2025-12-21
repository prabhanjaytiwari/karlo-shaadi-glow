import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'admin' | 'vendor' | 'couple';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireRole,
  redirectTo = "/auth"
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (requireAuth && !session) {
          navigate(redirectTo, { state: { from: location.pathname } });
          return;
        }

        if (requireRole && session) {
          const { data: roles, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id);

          if (error) throw error;

          if (!isMounted) return;

          const hasRequiredRole = roles?.some(r => r.role === requireRole);
          
          if (!hasRequiredRole) {
            // Redirect based on their actual role
            const userRole = roles?.[0]?.role;
            if (userRole === 'admin') {
              navigate("/admin/dashboard");
            } else if (userRole === 'vendor') {
              navigate("/vendor/dashboard");
            } else {
              navigate("/dashboard");
            }
            return;
          }
        }

        if (isMounted) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error checking access:", error);
        if (isMounted) {
          navigate(redirectTo);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    checkAccess();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsAuthorized(false);
          navigate(redirectTo);
        } else if (event === 'SIGNED_IN' && !isAuthorized) {
          // Re-check access when user signs in
          checkAccess();
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [requireAuth, requireRole, redirectTo, navigate, location.pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
