
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EventApplicationProps {
  event: any;
}

export function EventApplication({ event }: EventApplicationProps) {
  const [applying, setApplying] = useState(false);

  const handleApply = () => {
    if (event?.application_link) {
      // If there's an application link, redirect to it
      window.open(event.application_link, '_blank');
    } else {
      // Legacy behavior: show a toast notification
      applyForFunding();
    }
  };

  const applyForFunding = async () => {
    setApplying(true);
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to apply for this opportunity",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted!",
      });
      
    } catch (error) {
      console.error("Error applying:", error);
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <CardFooter className="flex flex-col items-start gap-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Category</h3>
        <div className="inline-block bg-muted px-2 py-1 rounded-md text-sm">
          {event.category}
        </div>
      </div>
      
      <Button 
        className="w-full md:w-auto" 
        onClick={handleApply} 
        disabled={applying}
      >
        {applying ? "Submitting..." : "Apply Now"}
        {event.application_link && <ExternalLink className="ml-2 h-4 w-4" />}
      </Button>
    </CardFooter>
  );
}
