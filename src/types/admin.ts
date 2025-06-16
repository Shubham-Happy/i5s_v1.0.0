
import { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  description: string;
  trend?: 'up' | 'down';
  trendValue?: number;
  bgClass: string;
  textClass: string;
}

export interface AdminTableProps {
  data: any[];
  columns: {
    key: string;
    header: string;
    render?: (item: any) => React.ReactNode;
  }[];
  onRowClick?: (item: any) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}
