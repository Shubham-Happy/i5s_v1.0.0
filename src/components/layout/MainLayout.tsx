
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNavbar } from "./MobileNavbar";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Determine if we need bottom padding for mobile footer
  const needsBottomPadding = isMobile && location.pathname !== '/about-us';

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-ivory-light/30 to-gold-light/10">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M30 30m-2 0a2 2 0 1 1 4 0a2 2 0 1 1-4 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar inMobileSheet={false} />}
      
      {/* Main Content */}
      <div className={cn(
        "flex flex-col flex-1 min-h-screen relative",
        !isMobile && "ml-64"
      )}>
        {/* Header */}
        <Header />
        
        {/* Main Content Area */}
        <main className={cn(
          "flex-1 relative z-10",
          isMobile ? "px-4 py-6" : "px-8 py-8",
          needsBottomPadding ? "pb-24" : isMobile ? "pb-20" : ""
        )}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Decorative Bottom Gradient - only show on desktop or About Us page */}
        {(!isMobile || location.pathname === '/about-us') && (
          <div className="h-32 bg-gradient-to-t from-gold-light/20 via-transparent to-transparent pointer-events-none" />
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavbar />}
    </div>
  );
}
