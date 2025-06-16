
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface AdminAccessControlProps {
  onAccessGranted: () => void;
  onAccessDenied: () => void;
  onLoadingComplete: () => void;
}

export function AdminAccessControl({ onAccessGranted, onAccessDenied, onLoadingComplete }: AdminAccessControlProps) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please login to access the admin panel.",
            variant: "destructive",
          });
          navigate('/admin-login');
          return;
        }
        
        // Check if user has admin privileges
        if (isAdmin) {
          // User has admin flag in context
          onAccessGranted();
        } else {
          // Double-check admin status from database
          const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') throw error;
            
          if (data?.is_admin) {
            onAccessGranted();
          } else {
            // Special access for specific emails - debug only
            if (session.user.email === "kingism@i5s.com" || 
                session.user.email === "kingism" || 
                session.user.email === "shubhshri45sv@gmail.com" || 
                session.user.email === "admin@statusnow.com") {
              onAccessGranted();
            } else {
              toast({
                title: "Access Denied",
                description: "You don't have admin permissions.",
                variant: "destructive",
              });
              navigate('/home');
              onAccessDenied();
            }
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Could not verify admin access.",
          variant: "destructive",
        });
        navigate('/home');
        onAccessDenied();
      } finally {
        onLoadingComplete();
      }
    };
    
    checkAdminStatus();
  }, [navigate, isAdmin, onAccessGranted, onAccessDenied, onLoadingComplete]);

  return null; // This component only handles logic, no UI
}
