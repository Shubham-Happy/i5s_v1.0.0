
import { 
  Home, 
  Users, 
  Settings, 
  FileText, 
  DollarSign, 
  Rocket,
  Search,
  Building2,
  Plus,
  Briefcase,
  Info
} from "lucide-react";

export const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Network", href: "/network", icon: Users },
  { name: "Articles", href: "/articles", icon: FileText },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Startups", href: "/startups", icon: Building2 },
  { name: "Fundraising", href: "/fundraising", icon: DollarSign },
  { name: "Search", href: "/search", icon: Search },
  { name: "About Us", href: "/about-us", icon: Info },
];

// Remove quick actions from sidebar - they'll be moved back to home page
export const quickActions = [];
