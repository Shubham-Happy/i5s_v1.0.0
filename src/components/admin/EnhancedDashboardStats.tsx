
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MessageSquare, Briefcase, Building, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface EnhancedDashboardStatsProps {
  counts: {
    users: number;
    posts: number;
    articles: number;
    jobs: number;
    startups: number;
    events: number;
  };
}

export function EnhancedDashboardStats({ counts }: EnhancedDashboardStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: counts.users,
      icon: Users,
      description: "Registered members",
      trend: "up",
      trendValue: 12,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      progress: Math.min((counts.users / 1000) * 100, 100)
    },
    {
      title: "Content Posts",
      value: counts.posts,
      icon: MessageSquare,
      description: "Community posts",
      trend: "up",
      trendValue: 8,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      progress: Math.min((counts.posts / 500) * 100, 100)
    },
    {
      title: "Articles",
      value: counts.articles,
      icon: FileText,
      description: "Published articles",
      trend: "up",
      trendValue: 15,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      progress: Math.min((counts.articles / 100) * 100, 100)
    },
    {
      title: "Job Listings",
      value: counts.jobs,
      icon: Briefcase,
      description: "Active job posts",
      trend: "down",
      trendValue: 3,
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      progress: Math.min((counts.jobs / 200) * 100, 100)
    },
    {
      title: "Startups",
      value: counts.startups,
      icon: Building,
      description: "Registered startups",
      trend: "up",
      trendValue: 20,
      color: "bg-pink-500",
      lightColor: "bg-pink-50",
      progress: Math.min((counts.startups / 150) * 100, 100)
    },
    {
      title: "Events",
      value: counts.events,
      icon: Calendar,
      description: "Fundraising events",
      trend: "up",
      trendValue: 5,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      progress: Math.min((counts.events / 50) * 100, 100)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.lightColor}`}>
                <Icon className={`h-4 w-4 text-white`} style={{ color: stat.color.replace('bg-', '').replace('-500', '') }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <Badge 
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className={`flex items-center gap-1 ${stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  <TrendIcon className="h-3 w-3" />
                  {stat.trendValue}%
                </Badge>
              </div>
              <div className="mt-3">
                <Progress value={stat.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.progress.toFixed(1)}% of target reached
                </p>
              </div>
            </CardContent>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color}`} />
          </Card>
        );
      })}
    </div>
  );
}
