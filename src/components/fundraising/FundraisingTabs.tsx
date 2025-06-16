
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FundraisingTabsProps {
  onFilterChange: (filter: string) => void;
}

const tabOptions = [
  { value: "all", label: "All" },
  { value: "competition", label: "Competitions" },
  { value: "pitch event", label: "Pitch Events" },
  { value: "grant", label: "Grants" },
  { value: "accelerator", label: "Accelerators" }
];

export function FundraisingTabs({ onFilterChange }: FundraisingTabsProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full mb-6">
        <Select defaultValue="all" onValueChange={onFilterChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter events" />
            <ChevronDown className="h-4 w-4" />
          </SelectTrigger>
          <SelectContent>
            {tabOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full mb-6">
      <TabsList>
        {tabOptions.map((option) => (
          <TabsTrigger 
            key={option.value} 
            value={option.value} 
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
