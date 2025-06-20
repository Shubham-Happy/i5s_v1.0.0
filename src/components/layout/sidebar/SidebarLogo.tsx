
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface SidebarLogoProps {
  shouldShowContent: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarLogo({ shouldShowContent, isCollapsed, onToggleCollapse }: SidebarLogoProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gold-light/20">
      <Link 
        to="/home" 
        className={cn(
          "flex items-center gap-3 group/logo transition-all duration-200",
          !shouldShowContent && "justify-center"
        )}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-slate-green to-gold-medium rounded-xl flex items-center justify-center shadow-lg group-hover/logo:shadow-xl transition-all duration-200 group-hover/logo:scale-110">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-gold-medium to-gold-accent rounded-full animate-pulse" />
        </div>
        {shouldShowContent && (
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-slate-green to-gold-dark   bg-clip-text">
              cozync
            </span>
            <span className="text-xs text-muted-foreground">Innovation Hub</span>
          </div>
        )}
      </Link>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleCollapse}
        className="p-2 hover:bg-gold-light/20 rounded-lg transition-colors"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
}
