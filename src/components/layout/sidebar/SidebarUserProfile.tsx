
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface SidebarUserProfileProps {
  shouldShowContent: boolean;
}

export function SidebarUserProfile({
  shouldShowContent
}: SidebarUserProfileProps) {
  const { profile } = useAuth();

  if (!profile) {
    return null;
  }

  return (
    <div className="mt-auto border-t border-gold-light/20 p-4">
      <div className={cn(
        "flex items-center gap-3 group cursor-pointer",
        !shouldShowContent && "justify-center"
      )}>
        <UserAvatar 
          user={profile} 
          size="sm"
          className="ring-2 ring-gold-light/30 group-hover:ring-gold-medium/50 transition-all duration-200"
        />
        {shouldShowContent && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile.full_name || profile.username || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile.status || 'Member'}
                </p>
              </div>
              <Link
                to="/settings"
                className="p-1.5 rounded-lg hover:bg-gold-light/20 text-muted-foreground hover:text-gold-dark transition-colors"
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
