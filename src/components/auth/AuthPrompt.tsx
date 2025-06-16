
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Lock } from "lucide-react";

interface AuthPromptProps {
  title?: string;
  description?: string;
  showSignup?: boolean;
}

export function AuthPrompt({ 
  title = "Authentication Required", 
  description = "Please sign in to access this feature", 
  showSignup = true 
}: AuthPromptProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link to="/login" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </Button>
          {showSignup && (
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to="/login" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Create Account
              </Link>
            </Button>
          )}
          <p className="text-center text-sm text-muted-foreground">
            Join our community to connect with entrepreneurs and founders
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
