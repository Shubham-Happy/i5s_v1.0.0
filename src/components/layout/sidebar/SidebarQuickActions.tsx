
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { quickActions } from "./navigationData";

interface SidebarQuickActionsProps {
  shouldShowContent: boolean;
}

export function SidebarQuickActions({ shouldShowContent }: SidebarQuickActionsProps) {
  if (!shouldShowContent) {
    return (
      <div className="px-4 py-2">
        <div className="flex flex-col gap-2">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href} className="group">
              <div className="p-2 rounded-lg hover:bg-gold-light/20 transition-colors">
                <div className={cn("p-2 rounded-lg w-fit bg-gradient-to-r", action.color)}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-slate-600">Quick Actions</h3>
      </div>
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.href} className="group block">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-r", action.color)}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn("font-medium text-sm group-hover:text-slate-green transition-colors", action.textColor)}>
                      {action.name}
                    </h4>
                  </div>
                  <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-slate-green group-hover:translate-x-0.5 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
