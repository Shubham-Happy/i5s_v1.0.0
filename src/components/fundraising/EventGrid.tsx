
import { Link } from "react-router-dom";
import { Calendar, Award, ChevronRight, MapPin, DollarSign, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FundraisingEvent } from "@/lib/supabase-fundraising-queries";

interface EventGridProps {
  events: FundraisingEvent[];
  isLoading: boolean;
}

export function EventGrid({ events, isLoading }: EventGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="h-48 bg-gradient-to-br from-gold-light/20 to-slate-green/20 animate-pulse" />
            <CardHeader className="space-y-3">
              <div className="h-6 bg-gradient-to-r from-gold-light/30 to-gold-medium/30 rounded-lg animate-pulse" />
              <div className="h-4 bg-slate-green/20 rounded w-2/3 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 bg-muted/50 rounded w-4/5 animate-pulse" />
                <div className="h-4 bg-muted/50 rounded w-3/5 animate-pulse" />
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-4 bg-muted/50 rounded w-full animate-pulse" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="col-span-3 py-16 text-center">
        <div className="bg-gradient-to-br from-gold-light/20 to-slate-green/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Award className="h-12 w-12 text-gold-medium" />
        </div>
        <h3 className="text-2xl font-bold text-slate-green mb-2">No events found</h3>
        <p className="text-muted-foreground text-lg">Try adjusting your search or filter criteria to discover amazing opportunities</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <Card 
          key={event.id} 
          className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:scale-[1.02] hover:bg-white"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image || `https://images.unsplash.com/photo-${1470071459604 + index}-3b5ec3a7fe05?w=500&h=300&fit=crop`}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Badge 
              className="absolute top-3 right-3 bg-gold-medium/90 text-white border-0 font-medium backdrop-blur-sm"
            >
              {event.category}
            </Badge>
          </div>
          
          <CardHeader className="relative">
            <div className="space-y-2">
              <CardTitle className="line-clamp-2 text-slate-green group-hover:text-gold-dark transition-colors duration-200">
                {event.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-gold-medium" />
                <span>{event.date}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {event.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-emerald-medium flex-shrink-0" />
                <span className="text-slate-600 truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-coral-medium flex-shrink-0" />
                <span className="text-slate-600 truncate">Deadline: {event.deadline}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-gold-medium flex-shrink-0" />
                <span className="text-slate-600 font-medium truncate">{event.prize}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between items-center pt-4 border-t border-gold-light/20">
            <div className="text-xs text-muted-foreground">
              By <span className="font-medium text-slate-600">{event.organizer}</span>
            </div>
            <Link
              to={`/fundraising/${event.id}`}
              className="flex items-center gap-1 text-sm font-medium text-gold-medium hover:text-gold-dark transition-colors duration-200 group/link"
            >
              View Details 
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
