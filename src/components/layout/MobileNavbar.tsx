
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Users, Building2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavIconProps {
  Icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const MobileNavIcon = ({ Icon, label, active, onClick }: MobileNavIconProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "relative flex flex-col items-center justify-center h-full w-full min-w-0 py-2 px-1 rounded-xl transition-all duration-200",
      active 
        ? "bg-gradient-to-r from-slate-green/20 to-gold-medium/20 text-slate-green" 
        : "text-muted-foreground hover:text-slate-700 hover:bg-gold-light/10"
    )}
  >
    <div className="relative">
      <Icon 
        size={20} 
        className={cn(
          "mb-1 transition-all duration-200 flex-shrink-0", 
          active ? "text-slate-green scale-110" : "text-muted-foreground"
        )} 
      />
    </div>
    <span className={cn(
      "text-xs font-medium transition-colors truncate w-full text-center leading-tight",
      active ? "text-slate-green font-semibold" : "text-muted-foreground"
    )}>
      {label}
    </span>
    {active && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-slate-green to-gold-medium rounded-full" />
    )}
  </button>
);

export const MobileNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: FileText, label: "Posts", path: "/posts" },
    { icon: Users, label: "Network", path: "/network" },
    { icon: DollarSign, label: "Fundraising", path: "/fundraising" },
    { icon: Building2, label: "Startups", path: "/startups" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-t border-gold-light/30 shadow-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-ivory-light/20 to-transparent" />
      
      {/* Navigation content */}
      <div className="relative h-16 grid grid-cols-5 overflow-hidden">
        {navItems.map((item) => (
          <MobileNavIcon 
            key={item.path}
            Icon={item.icon}
            label={item.label}
            active={path === item.path || (path === "/home" && item.path === "/home")}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-bottom bg-white/95" />
    </div>
  );
};
