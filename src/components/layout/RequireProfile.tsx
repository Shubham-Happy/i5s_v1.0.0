
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireProfileProps {
  children: ReactNode;
}

export function RequireProfile({ children }: RequireProfileProps) {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-statusnow-purple"></div>
      </div>
    );
  }

  if (!profile || !profile.full_name || !profile.bio) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
}
