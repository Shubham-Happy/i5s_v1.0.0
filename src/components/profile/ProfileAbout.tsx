
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Link as LinkIcon, Mail, Users, FileText } from "lucide-react";
import { ExtendedProfile } from "@/types/profile";

interface ProfileAboutProps {
  user: ExtendedProfile;
}

export function ProfileAbout({ user }: ProfileAboutProps) {
  return (
    <Card className="w-full border-gold-light/30 dark:border-slate-green/30 shadow-sm dark:bg-slate-green/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl text-slate-green dark:text-slate-green-light">About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display bio from the bio column, fallback to status for backward compatibility */}
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {user.bio || user.status || "This user hasn't added a bio yet."}
        </p>

        <div className="space-y-3">
          {user.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-slate-green dark:text-slate-green-light flex-shrink-0" />
              <span className="text-sm">{user.location}</span>
            </div>
          )}

          {user.website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <LinkIcon className="h-4 w-4 text-slate-green dark:text-slate-green-light flex-shrink-0" />
              <a 
                href={user.website.startsWith("http") ? user.website : `https://${user.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline text-sm break-all hover:text-slate-green dark:hover:text-slate-green-light transition-colors"
              >
                {user.website}
              </a>
            </div>
          )}

          {user.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-slate-green dark:text-slate-green-light flex-shrink-0" />
              <span className="text-sm break-all">{user.email}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-3 border-t border-gold-light/20 dark:border-slate-green/20">
            <div className="text-center">
              <span className="font-semibold text-slate-green dark:text-slate-green-light block text-lg">
                {user.followers || 0}
              </span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <div className="text-center">
              <span className="font-semibold text-slate-green dark:text-slate-green-light block text-lg">
                {user.following || 0}
              </span>
              <span className="text-xs text-muted-foreground">Following</span>
            </div>
            <div className="text-center">
              <span className="font-semibold text-slate-green dark:text-slate-green-light block text-lg">
                {user.articles || 0}
              </span>
              <span className="text-xs text-muted-foreground">Articles</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
