
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Star, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Feedback() {
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    type: "",
    rating: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for helping us improve i5s. We'll review your feedback carefully.",
    });
    
    setFeedback({ name: "", email: "", type: "", rating: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text  ">
            Help Us Improve
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Your feedback is invaluable in making i5s the best platform for entrepreneurs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <MessageSquare className="w-5 h-5" />
                Share Your Feedback
              </CardTitle>
              <CardDescription>
                Tell us what you love, what could be better, or suggest new features
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={feedback.name}
                      onChange={(e) => setFeedback(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={feedback.email}
                      onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Feedback Type</Label>
                    <Select value={feedback.type} onValueChange={(value) => setFeedback(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="improvement">Improvement</SelectItem>
                        <SelectItem value="general">General Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Overall Rating</Label>
                    <Select value={feedback.rating} onValueChange={(value) => setFeedback(prev => ({ ...prev, rating: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Rate your experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                        <SelectItem value="2">⭐⭐ Poor</SelectItem>
                        <SelectItem value="1">⭐ Very Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Feedback</Label>
                  <Textarea
                    id="message"
                    value={feedback.message}
                    onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us what's on your mind..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardTitle className="text-blue-700 dark:text-blue-400">Why Your Feedback Matters</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <span>Helps us prioritize new features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-emerald mt-0.5 flex-shrink-0" />
                  <span>Improves user experience for everyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-coral mt-0.5 flex-shrink-0" />
                  <span>Shapes the future of our platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Creates a better community for all</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardTitle className="text-purple-700 dark:text-purple-400">Quick Response</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                We review all feedback within 24-48 hours. For urgent issues, please contact our support team directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
