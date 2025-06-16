
import * as React from "react";

// Set breakpoint for mobile devices - common breakpoint for mobile-first design
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with a reasonable default based on screen width
    return typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false;
  });
  
  React.useEffect(() => {
    // Function to update state based on window size
    const updateSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add event listener
    window.addEventListener("resize", updateSize);
    
    // Clean up
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  
  return isMobile;
}

// Hook to detect touch devices
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    const touchDevice = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;
    
    setIsTouch(touchDevice);
  }, []);
  
  return isTouch;
}
