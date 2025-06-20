import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft,
  Sparkles,
  Users,
  TrendingUp,
  MessageCircle,
  Shield,
  CheckCircle
} from "lucide-react";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  useEffect(() => {
    const setRedirectURL = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting auth session:", error);
      }
    };
    setRedirectURL();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.email === "kingism" || user.email === "kingism@cozync.com" || user.email === "shubhshri45sv@gmail.com") {
        navigate("/kingism");
      } else {
        navigate("/home");
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) return;

    try {
      setIsSubmitting(true);
      
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
      
      if (data.user && !data.user.email_confirmed_at) {
        // Show email verification message
        setVerificationEmail(email);
        setShowEmailVerification(true);
        
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
      }
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for instructions to reset your password.",
      });
      setShowResetForm(false);
      
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Password Reset Failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: Users, title: "Connect with Entrepreneurs", desc: "Network with like-minded founders" },
    { icon: TrendingUp, title: "Grow Your Startup", desc: "Access resources and mentorship" },
    { icon: MessageCircle, title: "Share Knowledge", desc: "Learn from industry experts" },
    { icon: Shield, title: "Secure Platform", desc: "Your data is protected and private" }
  ];

  const resendVerificationEmail = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: verificationEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-emerald/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-emerald/20 to-gold/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left side - Branding and Benefits */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary via-emerald to-gold rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-emerald to-gold bg-clip-text  ">
                    cozync
                  </h1>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Where Great Ideas
                  <span className="bg-gradient-to-r from-emerald to-gold bg-clip-text  "> Meet Amazing People</span>
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
                  Join the most vibrant community of entrepreneurs, founders, and innovators building the future.
                </p>
              </div>
            </div>

            {/* Benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:max-w-none">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-emerald/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald">2.5K+</div>
                <div className="text-sm text-muted-foreground">Startups</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">120+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-lg">
              <CardHeader className="text-center space-y-4 pb-6">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">
                    {showEmailVerification 
                      ? "Verify Your Email" 
                      : showResetForm 
                        ? "Reset Password" 
                        : "Welcome to cozync"
                    }
                  </CardTitle>
                  <CardDescription>
                    {showEmailVerification 
                      ? "We've sent a confirmation email to verify your account"
                      : showResetForm 
                        ? "Enter your email to reset your password" 
                        : "Connect with entrepreneurs worldwide"
                    }
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {showEmailVerification ? (
                  <div className="space-y-4">
                    <Alert className="border-emerald/20 bg-emerald/5">
                      <CheckCircle className="h-4 w-4 text-emerald" />
                      <AlertDescription className="text-sm">
                        <strong>Confirmation email sent to:</strong><br />
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                          {verificationEmail}
                        </span>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Please check your email and click the verification link to activate your account.
                      </p>
                      
                      <div className="space-y-2">
                        <Button 
                          onClick={resendVerificationEmail}
                          disabled={isSubmitting}
                          variant="outline" 
                          className="w-full"
                        >
                          {isSubmitting ? "Sending..." : "Resend Verification Email"}
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            setShowEmailVerification(false);
                            setActiveTab("login");
                          }}
                          variant="ghost" 
                          className="w-full"
                        >
                          Back to Sign In
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : !showResetForm ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                      <TabsTrigger value="login" className="data-[state=active]:bg-background">
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="data-[state=active]:bg-background">
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4 mt-6">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="text-sm font-medium">Email or Username</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="login-email"
                              type="text"
                              placeholder="Enter your email or username"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10 h-11"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                            <button 
                              type="button"
                              onClick={() => setShowResetForm(true)}
                              className="text-xs text-primary hover:underline"
                            >
                              Forgot password?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="login-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10 pr-10 h-11"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-11 bg-gradient-to-r from-primary to-emerald hover:from-primary/90 hover:to-emerald/90 text-white font-medium"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            "Signing in..."
                          ) : (
                            <>
                              <LogIn className="w-4 h-4 mr-2" />
                              Sign In
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="signup" className="space-y-4 mt-6">
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10 h-11"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="username"
                              type="text"
                              placeholder="Choose a username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="pl-10 h-11"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10 pr-10 h-11"
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">Must be at least 6 characters long</p>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-11 bg-gradient-to-r from-emerald to-gold hover:from-emerald/90 hover:to-gold/90 text-white font-medium"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            "Creating account..."
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Create Account
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="Enter your email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1 h-11"
                        onClick={() => setShowResetForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 h-11 bg-gradient-to-r from-primary to-emerald"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>

              <CardFooter className="text-center text-xs text-muted-foreground border-t pt-6">
                <div className="w-full space-y-2">
                  <p>
                    By continuing, you agree to our{" "}
                    <Link to="/terms" className="underline underline-offset-2 hover:text-primary">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="underline underline-offset-2 hover:text-primary">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
