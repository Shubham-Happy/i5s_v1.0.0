
import { User, Mail, Phone, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrganizerInfoProps {
  event: any;
}

export function OrganizerInfo({ event }: OrganizerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-8 w-8 p-1 bg-muted rounded-full" />
          <div>
            <p className="font-medium">{event.organizer}</p>
          </div>
        </div>
        
        {event.organizer_description && (
          <div>
            <p className="text-sm text-muted-foreground">{event.organizer_description}</p>
          </div>
        )}

        <div className="space-y-2">
          {event.organizer_email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${event.organizer_email}`} className="text-blue-600 hover:underline">
                {event.organizer_email}
              </a>
            </div>
          )}
          
          {event.organizer_phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${event.organizer_phone}`} className="text-blue-600 hover:underline">
                {event.organizer_phone}
              </a>
            </div>
          )}
          
          {event.organizer_website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={event.organizer_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Visit Website
              </a>
            </div>
          )}
        </div>

        {event.organizer_website ? (
          <Button variant="outline" className="w-full" onClick={() => window.open(event.organizer_website, '_blank')}>
            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        ) : event.organizer_email ? (
          <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:${event.organizer_email}`, '_blank')}>
            Contact Organizer <Mail className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" className="w-full">Contact Organizer</Button>
        )}
      </CardContent>
    </Card>
  );
}
