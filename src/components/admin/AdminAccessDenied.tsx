
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Lock className="h-16 w-16 text-purple-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
        <p className="text-muted-foreground mb-4">You don't have access to the admin panel.</p>
        <Button onClick={() => navigate('/home')} className="bg-purple-600 hover:bg-purple-700">Return to Home</Button>
      </div>
    </div>
  );
}
