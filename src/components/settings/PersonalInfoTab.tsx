
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Globe, Calendar, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ImageUploadSection } from "./ImageUploadSection";

interface PersonalInfoTabProps {
  profile: any;
  user: any;
  updateProfile: (data: any) => Promise<boolean>;
}

export function PersonalInfoTab({ profile, user, updateProfile }: PersonalInfoTabProps) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setPhone(profile.Phone || "");
      setStatus(profile.status || "");
      setLocation(profile.location || "");
      setWebsite(profile.website || "");
      setAvatarUrl(profile.avatar_url || null);
      setCoverImageUrl(profile.cover_image || null);
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (username && username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (username && !/^[a-zA-Z0-9_-]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, underscores, and hyphens";
    }
    
    if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (website && website.trim() && !website.startsWith('http://') && !website.startsWith('https://')) {
      newErrors.website = "Website URL must start with http:// or https://";
    }
    
    if (bio && bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const updateData = {
        full_name: fullName.trim(),
        username: username.trim() || null,
        status: status.trim() || null,
        bio: bio.trim() || null,
        phone: phone.trim() || null,
        location: location.trim() || null,
        website: website.trim() || null,
        avatar_url: avatarUrl || null,
        cover_image: coverImageUrl || null,
      };

      console.log("PersonalInfoTab: Sending update data:", updateData);

      const success = await updateProfile(updateData);

      if (success) {
        setErrors({});
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Calendar size={16} className="text-green-600 dark:text-green-400" />
          </div>
          Personal Information
        </CardTitle>
        <CardDescription>
          Update your profile information and how others see you
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          {/* Image Upload Section */}
          <ImageUploadSection
            userId={user?.id}
            currentAvatarUrl={avatarUrl}
            currentCoverUrl={coverImageUrl}
            fullName={fullName}
            onAvatarChange={setAvatarUrl}
            onCoverChange={setCoverImageUrl}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={`border-green-200 focus:border-green-500 dark:border-green-800 ${errors.fullName ? 'border-red-500' : ''}`}
              />
              {errors.fullName && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle size={12} />
                  {errors.fullName}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your-username"
                  className={`pl-8 border-green-200 focus:border-green-500 dark:border-green-800 ${errors.username ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.username && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle size={12} />
                  {errors.username}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">Professional Headline</Label>
            <Input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="e.g., Software Engineer at TechCorp"
              className="border-green-200 focus:border-green-500 dark:border-green-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">About</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself, your interests, and what you're passionate about..."
              className={`border-green-200 focus:border-green-500 dark:border-green-800 min-h-[120px] resize-none ${errors.bio ? 'border-red-500' : ''}`}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <div>
                {errors.bio && (
                  <div className="flex items-center gap-1 text-red-500 text-xs">
                    <AlertCircle size={12} />
                    {errors.bio}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {bio.length}/500 characters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                Phone Number
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={`border-green-200 focus:border-green-500 dark:border-green-800 ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle size={12} />
                  {errors.phone}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin size={14} />
                Location
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="border-green-200 focus:border-green-500 dark:border-green-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
              <Globe size={14} />
              Website
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className={`border-green-200 focus:border-green-500 dark:border-green-800 ${errors.website ? 'border-red-500' : ''}`}
            />
            {errors.website && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle size={12} />
                {errors.website}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="bg-green-50/50 dark:bg-green-900/10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} />
            Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}
          </div>
          <Button 
            type="submit" 
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
