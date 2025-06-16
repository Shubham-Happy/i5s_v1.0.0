
import { Calendar, MapPin, Trophy, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EventDetailHeaderProps {
  event: any;
}

export function EventDetailHeader({ event }: EventDetailHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{event.title}</CardTitle>
        <CardDescription>Organized by {event.organizer}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.image && (
          <div className="w-full h-64 overflow-hidden rounded-md mb-4">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{event.date}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Trophy className="h-4 w-4" />
          <span>Prize: {event.prize}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Application Deadline: {event.deadline}</span>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">About this Opportunity</h3>
          <div className="prose max-w-none">
            <p>{event.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
