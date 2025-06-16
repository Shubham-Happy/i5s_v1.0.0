
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const useAuthPrompt = () => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authAction, setAuthAction] = useState<string>("perform this action");
  const { user } = useAuth();

  const requireAuth = (action: string = "perform this action") => {
    if (!user) {
      setAuthAction(action);
      setShowAuthPopup(true);
      return false;
    }
    return true;
  };

  const closeAuthPopup = () => {
    setShowAuthPopup(false);
    setAuthAction("perform this action");
  };

  return {
    showAuthPopup,
    authAction,
    requireAuth,
    closeAuthPopup,
    isAuthenticated: !!user
  };
};
