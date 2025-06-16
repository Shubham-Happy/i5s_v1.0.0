
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminAccessControl } from "@/components/admin/AdminAccessControl";
import { AdminLoadingState } from "@/components/admin/AdminLoadingState";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";

export default function KingismPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { counts, fetchCounts } = useAdminDashboardData();

  const handleAccessGranted = () => {
    setHasAccess(true);
    fetchCounts();
  };

  const handleAccessDenied = () => {
    setHasAccess(false);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminAccessControl 
          onAccessGranted={handleAccessGranted}
          onAccessDenied={handleAccessDenied}
          onLoadingComplete={handleLoadingComplete}
        />
        <AdminLoadingState />
      </div>
    );
  }
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <AdminAccessDenied />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex flex-col gap-6">
          <AdminHeader />
          <AdminTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />
        </div>
      </div>
    </div>
  );
}
