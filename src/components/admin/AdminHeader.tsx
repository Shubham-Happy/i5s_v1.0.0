
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Bell, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Logo size="lg" />
        <div>
          <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-400">Admin Control Panel</h1>
          <p className="text-muted-foreground">
            Manage and control all aspects of your platform
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" className="border-purple-200" onClick={() => navigate('/home')}>
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Bell className="mr-2 h-4 w-4" /> System Notifications
        </Button>
      </div>
    </div>
  );
}
