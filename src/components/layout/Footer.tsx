
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Heart, Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Footer() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // In mobile view, only show full footer on About Us page
  if (isMobile && location.pathname !== '/about-us') {
    return (
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gold-light/30 px-4 py-2 z-30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© 2025 cozync. Made with</span>
            <Heart className="h-3 w-3 text-red-500" />
            <span>for entrepreneurs</span>
            <Globe className="h-3 w-3 text-blue-500" />
          </div>
          <div>Version 1.0.0 Beta</div>
        </div>
      </footer>
    );
  }

  // Full footer for desktop or About Us page in mobile
  return (
    <footer className="relative border-t border-gold-light/30 bg-gradient-to-r from-slate-50/50 via-ivory-light/30 to-gold-light/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-green to-gold-medium rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-gold-medium to-gold-accent rounded-full animate-pulse" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-slate-green to-gold-dark   bg-clip-text">
                cozync
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering entrepreneurs to connect, innovate, and grow their startups in a thriving ecosystem.
            </p>
          </div>

          {/* Legal Links */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">Legal</h3>
            <div className="space-y-2">
              <Link to="/privacy-policy" className="block text-sm text-muted-foreground hover:text-slate-700 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="block text-sm text-muted-foreground hover:text-slate-700 transition-colors">
                Terms of Service
              </Link>
              <Link to="/about-us" className="block text-sm text-muted-foreground hover:text-slate-700 transition-colors">
                About Us
              </Link>
              <Link to="/careers" className="block text-sm text-muted-foreground hover:text-slate-700 transition-colors">
                Careers
              </Link>
            </div>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gold-light/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025 cozync. Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>for entrepreneurs</span>
            <Globe className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-sm text-muted-foreground">
            Version 1.0.0 Beta
          </div>
        </div>
      </div>
    </footer>
  );
}
