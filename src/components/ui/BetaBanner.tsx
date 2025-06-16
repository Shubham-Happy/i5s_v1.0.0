
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-storage';

export function BetaBanner() {
  const [isDismissed, setIsDismissed] = useLocalStorage('beta-banner-dismissed', false);
  const [isVisible, setIsVisible] = useState(false);

  // Set visibility after mount to avoid hydration mismatch
  useEffect(() => {
    setIsVisible(!isDismissed);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-green to-slate-green-dark dark:from-slate-green-dark dark:to-slate-green text-white py-3 px-4 z-50 shadow-2xl border-t border-slate-green-light/20">
      <div className="container max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full px-3 py-1">
            <span className="font-bold text-sm">BETA</span>
          </div>
          <p className="text-sm md:text-base">
            We're still improving. Your feedback helps us build a better platform!
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-2 rounded-full hover:bg-white/20 transition-colors flex-shrink-0 ml-4"
          aria-label="Dismiss banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
