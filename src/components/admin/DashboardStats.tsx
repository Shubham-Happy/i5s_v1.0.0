
import { useState } from "react";
import { BarChart, Users, Building, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCardProps } from "@/types/admin";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample activity data - this would normally come from the database
const getActivityData = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date().getDay();
  
  return days.map((day, index) => ({
    name: day,
    users: Math.floor(Math.random() * 30) + 5,
    posts: Math.floor(Math.random() * 50) + 10,
    articles: Math.floor(Math.random() * 20) + 3,
    jobs: Math.floor(Math.random() * 10) + 1,
    isToday: (index + 1) % 7 === today ? true : false,
  }));
};

// Stats Card Component
export const StatCard = ({ title, value, icon, description, trend, trendValue, bgClass, textClass }: StatCardProps) => (
  <Card className={`${bgClass} border-transparent shadow-sm hover:shadow-md transition-all`}>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className={`text-sm font-medium ${textClass}`}>{title}</CardTitle>
        <div className={`p-2 rounded-full ${bgClass} bg-opacity-30`}>
          {icon}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <div className="flex items-center mt-1">
        {trend && (
          <Badge variant={trend === 'up' ? 'default' : 'destructive'} className="mr-2 text-xs">
            {trend === 'up' ? '↑' : '↓'} {trendValue}%
          </Badge>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

interface DashboardStatsProps {
  counts: {
    users: number;
    posts: number;
    articles: number;
    jobs: number;
    startups: number;
    events: number;
  };
}

export function DashboardStats({ counts }: DashboardStatsProps) {
  const [activityData] = useState(() => getActivityData());

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <StatCard 
          title="Total Users" 
          value={counts.users} 
          icon={<Users className="h-5 w-5 text-purple-600" />} 
          description="All registered users" 
          trend="up" 
          trendValue={4}
          bgClass="bg-cream-50 dark:bg-purple-900/20" 
          textClass="text-purple-700 dark:text-purple-400"
        />
        
        <StatCard 
          title="Published Content" 
          value={counts.posts + counts.articles} 
          icon={<FileText className="h-5 w-5 text-green-600" />} 
          description="Posts and articles" 
          trend="up" 
          trendValue={12}
          bgClass="bg-cream-50 dark:bg-green-900/20" 
          textClass="text-green-700 dark:text-green-400"
        />
        
        <StatCard 
          title="Registered Startups" 
          value={counts.startups} 
          icon={<Building className="h-5 w-5 text-purple-600" />} 
          description="Verified companies" 
          trend="up" 
          trendValue={3}
          bgClass="bg-cream-50 dark:bg-purple-900/20" 
          textClass="text-purple-700 dark:text-purple-400"
        />
      </div>
      
      {/* Add Activity Chart */}
      <div className="mt-6">
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-t-lg">
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
              <BarChart className="h-5 w-5 mr-2" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={activityData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" name="Users" fill="#8884d8" />
                  <Bar dataKey="posts" name="Posts" fill="#82ca9d" />
                  <Bar dataKey="articles" name="Articles" fill="#ffc658" />
                  <Bar dataKey="jobs" name="Jobs" fill="#ff8042" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
