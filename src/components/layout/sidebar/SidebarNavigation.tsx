
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigation } from "./navigationData";

interface SidebarNavigationProps {
  shouldShowContent: boolean;
}

export function SidebarNavigation({ shouldShowContent }: SidebarNavigationProps) {
  const location = useLocation();

  return (
    <nav className="flex-1 p-4 space-y-2">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href || 
                       (item.href !== '/home' && location.pathname.startsWith(item.href));

        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group/nav relative overflow-hidden",
              isActive
                ? "bg-gradient-to-r from-slate-green to-gold-medium text-white shadow-lg"
                : "text-slate-700 hover:bg-gold-light/20 hover:text-slate-900",
              !shouldShowContent && "justify-center px-3"
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-green/20 to-gold-medium/20 rounded-xl" />
            )}
            
            <item.icon className={cn(
              "h-5 w-5 transition-transform duration-200 group-hover/nav:scale-110 relative z-10",
              isActive && "text-white"
            )} />
            
            {shouldShowContent && (
              <span className="relative z-10 flex-1">{item.name}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
