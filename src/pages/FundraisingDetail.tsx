
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EventDetailHeader } from "@/components/fundraising/EventDetailHeader";
import { EventApplication } from "@/components/fundraising/EventApplication";
import { OrganizerInfo } from "@/components/fundraising/OrganizerInfo";
import { ShareSection } from "@/components/fundraising/ShareSection";
import { EventDetailLoading } from "@/components/fundraising/EventDetailLoading";
import { EventDetailError } from "@/components/fundraising/EventDetailError";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function FundraisingDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('funding_events')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (error) throw error;
        if (data) {
          setEvent(data);
        } else {
          setError("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return <EventDetailLoading />;
  }

  if (error || !event) {
    return <EventDetailError error={error || "Event not found"} />;
  }

  return (
    <ErrorBoundary>
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <EventDetailHeader event={event} />
            <EventApplication event={event} />
          </div>

          <div>
            <OrganizerInfo event={event} />
            <ShareSection event={event} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
