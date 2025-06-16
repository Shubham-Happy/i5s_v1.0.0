
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createStartup } from "@/lib/supabase-startup-queries";
import { Rocket, Upload, CheckCircle, AlertCircle } from "lucide-react";

const categoryOptions = [
  "Software",
  "HealthTech", 
  "FinTech",
  "CleanTech",
  "EdTech",
  "E-commerce",
  "Hardware",
  "AI/ML", 
  "Blockchain",
  "Gaming",
  "Other"
];

const fundingStages = [
  "Pre-seed",
  "Seed", 
  "Series A",
  "Series B",
  "Series C+",
  "Bootstrapped",
  "Profitable"
];

export default function LaunchStartup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "",
    fundingStage: "",
    location: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to launch your startup.",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (!formData.name || !formData.tagline || !formData.description || 
        !formData.category || !formData.fundingStage || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createStartup(formData, logoFile);
      
      if (result) {
        toast({
          title: "Startup launched successfully!",
          description: "Your startup has been added to our showcase.",
        });
        navigate("/startups");
      }
    } catch (error) {
      console.error("Error launching startup:", error);
      toast({
        title: "Error",
        description: "Failed to launch startup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Rocket className="h-10 w-10 text-statusnow-purple mr-3" />
          <h1 className="text-3xl font-bold">Launch Your Startup</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Share your startup with our community of entrepreneurs and investors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Benefits Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Why Launch Here?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-statusnow-purple rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Get Investor Attention</p>
                  <p className="text-sm text-muted-foreground">Top voted startups get reviewed by our investor panel</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-statusnow-purple rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Build Community</p>
                  <p className="text-sm text-muted-foreground">Connect with other entrepreneurs and potential customers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-statusnow-purple rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Get Feedback</p>
                  <p className="text-sm text-muted-foreground">Receive valuable insights from the community</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-statusnow-purple rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Monthly Funding Challenge</p>
                  <p className="text-sm text-muted-foreground">Top 3 startups each month get investor reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Startup Information</CardTitle>
              <CardDescription>
                Tell us about your startup. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Startup Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g. TechVentures"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tagline">Tagline *</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    placeholder="e.g. AI-powered healthcare diagnostics"
                    maxLength={100}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.tagline.length}/100 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe what your startup does, the problem it solves, and your unique value proposition..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange("category", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fundingStage">Funding Stage *</Label>
                    <Select 
                      value={formData.fundingStage} 
                      onValueChange={(value) => handleInputChange("fundingStage", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingStages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo">Company Logo (Optional)</Label>
                  <div className="mt-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    {logoFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {logoFile.name}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: Square image, max 2MB
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800">Review Process</p>
                      <p className="text-blue-700 mt-1">
                        Your startup will be published immediately. Our community will vote on the best startups, 
                        and the top 3 each month will be reviewed by our investor panel for potential funding opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-statusnow-purple hover:bg-statusnow-purple-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Launching...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Launch Startup
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
