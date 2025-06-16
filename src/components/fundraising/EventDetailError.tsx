
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventDetailErrorProps {
  error: string;
}

export function EventDetailError({ error }: EventDetailErrorProps) {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    </div>
  );
}
