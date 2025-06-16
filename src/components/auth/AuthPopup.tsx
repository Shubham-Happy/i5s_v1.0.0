
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, X } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string;
}

export function AuthPopup({ isOpen, onClose, action = "perform this action" }: AuthPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <LogIn className="w-4 h-4 text-primary" />
            </div>
            Sign in required
          </DialogTitle>
          <DialogDescription>
            You need to be signed in to {action}. Join our community of entrepreneurs and founders!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button asChild className="w-full">
            <Link to="/login" onClick={onClose}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login" onClick={onClose}>
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
