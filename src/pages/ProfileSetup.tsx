
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ProfileCompletionForm } from "@/components/user/ProfileCompletionForm";

export default function ProfileSetup() {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    
    // If user already has a complete profile, redirect to home
    if (!isLoading && profile && profile.full_name && profile.username) {
      navigate("/");
    }
  }, [user, profile, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <ProfileCompletionForm />;
}
