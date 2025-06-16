
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";

interface SidebarProps {
  inMobileSheet?: boolean;
}

export function Sidebar({ inMobileSheet = false }: SidebarProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile && !inMobileSheet); 
  const [isHovered, setIsHovered] = useState(false);

  // When in mobile sheet, always show full content
  const shouldShowContent = inMobileSheet || !isCollapsed || isHovered;

  const handleToggleCollapse = () => {
    if (!inMobileSheet) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-white/95 backdrop-blur-lg border-r border-gold-light/30 transition-all duration-300 ease-in-out shadow-xl group",
        inMobileSheet 
          ? "w-full relative" 
          : cn(
              "fixed left-0 top-0 z-40",
              isCollapsed ? "w-20" : "w-64"
            )
      )}
      onMouseEnter={() => !inMobileSheet && setIsHovered(true)}
      onMouseLeave={() => !inMobileSheet && setIsHovered(false)}
    >
      {/* Sidebar Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-ivory-light/30 to-gold-light/20 rounded-r-2xl" />
      
      <div className="relative flex flex-col h-full">
        {/* Logo Section */}
        <SidebarLogo 
          shouldShowContent={shouldShowContent}
          isCollapsed={isCollapsed && !inMobileSheet}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Navigation */}
        <SidebarNavigation shouldShowContent={shouldShowContent} />

        {/* User Profile Section */}
        <SidebarUserProfile shouldShowContent={shouldShowContent} />
      </div>
    </aside>
  );
}
