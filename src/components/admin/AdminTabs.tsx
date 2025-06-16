
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/admin/Dashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { StartupManagement } from "@/components/admin/StartupManagement";
import { FeedbackManagement } from "@/components/admin/FeedbackManagement";
import { DashboardCounts } from "@/hooks/useAdminDashboardData";

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: DashboardCounts;
}

export function AdminTabs({ activeTab, onTabChange, counts }: AdminTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="startups">Startups</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard" className="space-y-6">
        <Dashboard counts={counts} />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-6">
        <UserManagement />
      </TabsContent>
      
      <TabsContent value="content" className="space-y-6">
        <ContentManagement />
      </TabsContent>
      
      <TabsContent value="startups" className="space-y-6">
        <StartupManagement />
      </TabsContent>
      
      <TabsContent value="feedback" className="space-y-6">
        <FeedbackManagement />
      </TabsContent>
    </Tabs>
  );
}
