
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPendingFundraisingEvents, approveEvent, rejectEvent } from "@/lib/supabase-fundraising-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function EventManagement() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: pendingEvents = [], isLoading } = useQuery({
    queryKey: ["pending-events"],
    queryFn: fetchPendingFundraisingEvents,
  });

  const handleApprove = async (eventId: string) => {
    const success = await approveEvent(eventId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["pending-events"] });
      queryClient.invalidateQueries({ queryKey: ["fundraising-events"] });
    }
  };

  const handleReject = async (eventId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejecting this event.",
        variant: "destructive",
      });
      return;
    }

    const success = await rejectEvent(eventId, rejectionReason);
    if (success) {
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedEvent(null);
      queryClient.invalidateQueries({ queryKey: ["pending-events"] });
      queryClient.invalidateQueries({ queryKey: ["fundraising-events"] });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Badge variant="secondary" className="text-sm">
          <Clock className="h-4 w-4 mr-1" />
          {pendingEvents.length} Pending
        </Badge>
      </div>

      {pendingEvents.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No pending events to review.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingEvents.map((event) => (
            <Card key={event.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      by {event.organizer} • {event.date}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Pending Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{event.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">{event.category}</p>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                  <div>
                    <span className="font-medium">Prize:</span>
                    <p className="text-muted-foreground">{event.prize}</p>
                  </div>
                  <div>
                    <span className="font-medium">Deadline:</span>
                    <p className="text-muted-foreground">{event.deadline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{event.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Event Details</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Date:</span> {event.date}</p>
                              <p><span className="font-medium">Location:</span> {event.location}</p>
                              <p><span className="font-medium">Category:</span> {event.category}</p>
                              <p><span className="font-medium">Deadline:</span> {event.deadline}</p>
                              <p><span className="font-medium">Prize:</span> {event.prize}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Organizer Information</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Name:</span> {event.organizer}</p>
                              {event.organizer_email && (
                                <p><span className="font-medium">Email:</span> {event.organizer_email}</p>
                              )}
                              {event.organizer_phone && (
                                <p><span className="font-medium">Phone:</span> {event.organizer_phone}</p>
                              )}
                              {event.organizer_website && (
                                <p><span className="font-medium">Website:</span> {event.organizer_website}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {event.organizer_description && (
                          <div>
                            <h4 className="font-medium mb-2">About the Organizer</h4>
                            <p className="text-sm text-muted-foreground">{event.organizer_description}</p>
                          </div>
                        )}
                        
                        {event.application_link && (
                          <div>
                            <h4 className="font-medium mb-2">Application Link</h4>
                            <a 
                              href={event.application_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {event.application_link}
                            </a>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    onClick={() => handleApprove(event.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  
                  <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedEvent(event)}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Event</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Please provide a reason for rejecting "{selectedEvent?.title}":
                        </p>
                        <Textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Enter rejection reason..."
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsRejectDialogOpen(false);
                              setRejectionReason("");
                              setSelectedEvent(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(selectedEvent?.id)}
                          >
                            Reject Event
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
