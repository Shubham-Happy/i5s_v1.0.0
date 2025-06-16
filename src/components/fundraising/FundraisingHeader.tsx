
import { useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateEventDialog } from "./CreateEventDialog";

interface FundraisingHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEventCreated: () => void;
}

export function FundraisingHeader({ searchQuery, onSearchChange, onEventCreated }: FundraisingHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gold-light/20 shadow-lg">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-green to-gold-dark   bg-clip-text">
          Explore Opportunities
        </h2>
        <p className="text-muted-foreground">
          Find the perfect competition or funding opportunity for your project
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
        <div className="relative min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events, competitions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gold-light/30 focus:border-gold-medium focus:ring-gold-medium/20 bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          className="border-gold-light/40 hover:bg-gold-light/10 hover:border-gold-medium transition-all duration-200"
        >
          <Filter size={18} />
        </Button>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-slate-green to-gold-medium hover:from-slate-green/90 hover:to-gold-medium/90 text-white font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
            >
              <Plus size={16} className="mr-2" />
              Host an Event
            </Button>
          </DialogTrigger>
          <CreateEventDialog 
            open={dialogOpen} 
            onOpenChange={setDialogOpen}
            onEventCreated={onEventCreated}
          />
        </Dialog>
      </div>
    </div>
  );
}
