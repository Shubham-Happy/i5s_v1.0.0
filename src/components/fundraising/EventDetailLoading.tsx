
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EventDetailLoading() {
  return (
    <div className="container py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
