
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/types/database";
import { fetchProfileById, updateUserProfile } from "@/lib/supabase-queries";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Update user session state
  useEffect(() => {
    setIsLoading(true);
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Use setTimeout to avoid Supabase authentication deadlock
        if (currentSession?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfileById(currentSession.user!.id);
            setProfile(profileData);
            
            // Check if user is admin - special case for kingism user or has admin flag
            if (currentSession.user.email === "kingism@i5s.com" || 
                currentSession.user.email === "kingism" || 
                profileData?.is_admin ||
                currentSession.user.email === "shubhshri45sv@gmail.com") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        fetchProfileById(currentSession.user.id).then(profileData => {
          setProfile(profileData);
          
          // Check if user is admin - special case for kingism user or has admin flag
          if (currentSession.user.email === "kingism@i5s.com" ||
              currentSession.user.email === "kingism" ||
              profileData?.is_admin ||
              currentSession.user.email === "shubhshri45sv@gmail.com") {
            setIsAdmin(true);
          }
          
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in a user
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Special case for Kingism admin - improved logic
      if ((email === "kingism" && password === "King@Ism") || 
          (email === "shubhshri45sv@gmail.com")) {
        try {
          // Try to sign in with user credentials
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            throw error;
          } else if (data.user) {
            // Ensure admin flag is set
            await supabase
              .from('profiles')
              .update({ is_admin: true })
              .eq('id', data.user.id);
              
            setIsAdmin(true);
            toast({
              title: "Welcome Admin",
              description: "You've been successfully signed in as Admin.",
            });
          }
          
          return;
        } catch (adminError: any) {
          console.error("Admin login error:", adminError);
          toast({
            title: "Admin Login Failed",
            description: "Please check your credentials and try again.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }
      
      // Regular user login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user) {
        const profileData = await fetchProfileById(data.user.id);
        setProfile(profileData);
        
        // Check if user is admin
        if (profileData?.is_admin || data.user.email === "kingism@i5s.com" || data.user.email === "kingism" || data.user.email === "shubhshri45sv@gmail.com") {
          setIsAdmin(true);
          toast({
            title: "Welcome Admin",
            description: "You've been successfully signed in as admin.",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've been successfully signed in.",
          });
        }
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up a new user (kept for compatibility but actual signup is handled in Login component)
  const signUp = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: `${window.location.origin}/home`,
        },
      });
      
      if (error) throw error;
      
      // Mark as a new user to show profile setup
      if (data.user) {
        setIsNewUser(true);
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out a user
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      setIsLoading(true);
      
      const { data: updatedProfile, error } = await updateUserProfile(user.id, data);
      
      if (error) throw error;
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
      throw error; // Re-throw to handle in the form component
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isNewUser,
    setIsNewUser,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
