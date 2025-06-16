
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, TrendingUp, Activity } from "lucide-react";

export function AdminAnalytics() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [contentDistribution, setContentDistribution] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);

      // Generate sample weekly activity data
      const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          posts: Math.floor(Math.random() * 20) + 5,
          users: Math.floor(Math.random() * 15) + 3,
          articles: Math.floor(Math.random() * 8) + 1
        };
      });
      setWeeklyData(weeklyActivity);

      // Generate user growth data
      const growth = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          users: Math.floor(Math.random() * 100) + 50 + (i * 20),
          active: Math.floor(Math.random() * 80) + 30 + (i * 15)
        };
      });
      setUserGrowth(growth);

      // Fetch real content distribution
      const { data: posts } = await supabase.from('posts').select('id', { count: 'exact', head: true });
      const { data: articles } = await supabase.from('articles').select('id', { count: 'exact', head: true });
      const { data: jobs } = await supabase.from('job_listings').select('id', { count: 'exact', head: true });
      const { data: startups } = await supabase.from('startups').select('id', { count: 'exact', head: true });

      const distribution = [
        { name: 'Posts', value: posts?.length || 0, color: '#8884d8' },
        { name: 'Articles', value: articles?.length || 0, color: '#82ca9d' },
        { name: 'Jobs', value: jobs?.length || 0, color: '#ffc658' },
        { name: 'Startups', value: startups?.length || 0, color: '#ff7300' }
      ];
      setContentDistribution(distribution);

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Weekly Activity
                </CardTitle>
                <CardDescription>Platform activity over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="posts" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="articles" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Content Distribution
                </CardTitle>
                <CardDescription>Types of content on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {contentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                User Growth
              </CardTitle>
              <CardDescription>User registration and activity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="active" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contentDistribution.map((item) => (
              <Card key={item.name}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>Total {item.name.toLowerCase()} count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{item.value}</div>
                  <Progress value={Math.min((item.value / 100) * 100, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {((item.value / contentDistribution.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}% of total content
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Platform engagement and interaction data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Daily Active Users</h4>
                  <p className="text-2xl font-bold text-blue-600">324</p>
                  <Badge className="bg-blue-100 text-blue-700 mt-2">+12% from yesterday</Badge>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Avg. Session Time</h4>
                  <p className="text-2xl font-bold text-green-600">8.5 min</p>
                  <Badge className="bg-green-100 text-green-700 mt-2">+2.3% from last week</Badge>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Bounce Rate</h4>
                  <p className="text-2xl font-bold text-purple-600">24%</p>
                  <Badge className="bg-purple-100 text-purple-700 mt-2">-5% improvement</Badge>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Page Views</h4>
                  <p className="text-2xl font-bold text-orange-600">12.4K</p>
                  <Badge className="bg-orange-100 text-orange-700 mt-2">+18% this week</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
