
import { Loader2 } from "lucide-react";

export function AdminLoadingState() {
  return (
    <div className="container max-w-6xl mx-auto py-12 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
        <p className="mt-4 text-lg">Loading admin panel...</p>
      </div>
    </div>
  );
}
