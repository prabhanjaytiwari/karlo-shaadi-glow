import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
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
  const { user, loading, hasRole, isAdmin, isVendor } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      navigate(redirectTo, { state: { from: location.pathname } });
      return;
    }

    if (requireRole && user && !hasRole(requireRole)) {
      // Redirect based on their actual role
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else if (isVendor) {
        navigate("/vendor/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [loading, user, requireAuth, requireRole, redirectTo, navigate, location.pathname, hasRole, isAdmin, isVendor]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (requireAuth && !user) return null;
  if (requireRole && !hasRole(requireRole)) return null;

  return <>{children}</>;
}
