
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function AuthNavigationHandler() {
  const { user, profile, isNewUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    // Don't redirect if user is on specific protected pages (except login and root)
    const protectedPaths = ["/profile-setup", "/login"];
    if (protectedPaths.includes(location.pathname)) {
      return;
    }

    if (user && !isLoading) {
      // Check if profile is incomplete
      if (profile && (!profile.full_name || !profile.username)) {
        navigate("/profile-setup");
      } else if (isNewUser) {
        navigate("/profile-setup");
      } else if (profile?.full_name && profile?.username) {
        // Redirect to home for users with complete profiles visiting root or login
        if (location.pathname === "/" || location.pathname === "/login") {
          navigate("/home");
        }
      }
    } else if (!user && location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/about" && location.pathname !== "/faq") {
      // Redirect unauthenticated users to login page, except for public pages
      navigate("/login");
    }
  }, [user, profile, isNewUser, isLoading, navigate, location.pathname]);

  return null;
}
