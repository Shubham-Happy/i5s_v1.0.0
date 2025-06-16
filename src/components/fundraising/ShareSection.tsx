
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialShare } from "@/components/sharing/SocialShare";

interface ShareSectionProps {
  event?: {
    id: string;
    title: string;
    description: string;
  };
}

export function ShareSection({ event }: ShareSectionProps) {
  if (!event) {
    return null;
  }

  const eventUrl = `/fundraising/${event.id}`;
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Share</CardTitle>
      </CardHeader>
      <CardContent>
        <SocialShare
          url={eventUrl}
          title={event.title}
          description={event.description}
        />
      </CardContent>
    </Card>
  );
}
