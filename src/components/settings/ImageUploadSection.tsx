
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";
import { uploadProfileImage } from "@/lib/supabase-storage";
import { toast } from "@/hooks/use-toast";

interface ImageUploadSectionProps {
  userId: string;
  currentAvatarUrl?: string | null;
  currentCoverUrl?: string | null;
  fullName: string;
  onAvatarChange: (url: string | null) => void;
  onCoverChange: (url: string | null) => void;
}

export function ImageUploadSection({
  userId,
  currentAvatarUrl,
  currentCoverUrl,
  fullName,
  onAvatarChange,
  onCoverChange
}: ImageUploadSectionProps) {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const result = await uploadProfileImage(file, userId, 'avatar');
      
      if (result.error) {
        toast({
          title: "Upload failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (result.url) {
        onAvatarChange(result.url);
        toast({
          title: "Avatar uploaded",
          description: "Your profile picture has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const result = await uploadProfileImage(file, userId, 'cover');
      
      if (result.error) {
        toast({
          title: "Upload failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (result.url) {
        onCoverChange(result.url);
        toast({
          title: "Cover image uploaded",
          description: "Your cover image has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload cover image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingCover(false);
      // Reset input
      e.target.value = '';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Cover Image Section */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Cover Image</Label>
        <div className="relative group">
          <div className="h-32 w-full rounded-lg bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 overflow-hidden">
            {currentCoverUrl ? (
              <img
                src={currentCoverUrl}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Label 
              htmlFor="cover-upload" 
              className="cursor-pointer bg-white text-black p-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isUploadingCover ? (
                <div className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full" />
              ) : (
                <Upload size={20} />
              )}
            </Label>
            <Input
              id="cover-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
              disabled={isUploadingCover}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Click to change cover image (max 10MB)</p>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <Avatar className="w-32 h-32 border-4 border-green-100 dark:border-green-800">
            <AvatarImage src={currentAvatarUrl || ""} alt="Profile" />
            <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
              {getInitials(fullName || "User")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Label 
              htmlFor="avatar-upload" 
              className="cursor-pointer bg-white text-black p-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isUploadingAvatar ? (
                <div className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full" />
              ) : (
                <Camera size={20} />
              )}
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Profile Picture</p>
          <p className="text-xs text-muted-foreground">Click to change (max 5MB)</p>
        </div>
      </div>
    </div>
  );
}
