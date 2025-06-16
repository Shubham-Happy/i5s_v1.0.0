
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: {
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    name?: string;
  } | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.name || user?.full_name || user?.username || "User";
  };

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm", 
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage 
        src={user?.avatar_url || ""} 
        alt={getUserDisplayName()}
        className="object-cover"
      />
      <AvatarFallback className="bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light text-white font-semibold">
        {getInitials(getUserDisplayName())}
      </AvatarFallback>
    </Avatar>
  );
}
