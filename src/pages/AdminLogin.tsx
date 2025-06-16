
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, password);
      
      // Redirection is handled in AuthContext based on admin status
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-light/30 via-background to-coral-light/20 px-4 py-8">
      <Card className="w-full max-w-md border-primary/30 shadow-lg">
        <CardHeader className="text-center space-y-2 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground rounded-t-lg">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-primary-foreground/20 backdrop-blur-sm rounded-md flex items-center justify-center mx-auto border border-primary-foreground/30">
              <span className="text-primary-foreground font-bold text-2xl">A</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Secure access for administrators only
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-primary/30 focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-primary/30 focus:border-primary focus:ring-primary/20"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Access Admin Panel"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground bg-emerald-light/20 rounded-b-lg border-t border-emerald/10">
          Authorized personnel only. All access attempts are logged.
        </CardFooter>
      </Card>
    </div>
  );
}
