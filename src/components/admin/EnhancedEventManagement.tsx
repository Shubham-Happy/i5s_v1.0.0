
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, DollarSign, Building, CheckCircle, XCircle, Eye, Search } from "lucide-react";
import { format } from "date-fns";

interface FundingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  deadline: string;
  prize: string;
  organizer: string;
  image: string | null;
  approval_status: string;
  created_at: string;
  organizer_email: string | null;
  organizer_phone: string | null;
  application_link: string | null;
}

export function EnhancedEventManagement() {
  const [events, setEvents] = useState<FundingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data: eventsData, error } = await supabase
        .from('funding_events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEvents(eventsData || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEventStatus = async (eventId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const updateData: any = {
        approval_status: status,
        approval_date: new Date().toISOString()
      };
      
      if (status === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('funding_events')
        .update(updateData)
        .eq('id', eventId);
      
      if (error) throw error;
      
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, approval_status: status, rejection_reason: rejectionReason }
          : event
      ));
      
      toast({
        title: "Success",
        description: `Event ${status} successfully.`,
      });
      
    } catch (error) {
      console.error("Error updating event status:", error);
      toast({
        title: "Error",
        description: "Failed to update event status.",
        variant: "destructive"
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('funding_events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      
      setEvents(events.filter(event => event.id !== eventId));
      
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-0">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-0">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || event.approval_status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
              <Calendar className="h-5 w-5 mr-2" />
              Event Management
            </CardTitle>
            <CardDescription>Manage fundraising events and applications</CardDescription>
          </div>
          <div className="flex gap-2">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-purple-200 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search events..." 
              className="pl-10 max-w-sm border-purple-200" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events found matching your criteria.
              </div>
            ) : (
              filteredEvents.map((event) => (
                <Card key={event.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          {getStatusBadge(event.approval_status)}
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-600" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                            <span>{event.prize}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-purple-600" />
                            <span>{event.organizer}</span>
                          </div>
                        </div>

                        {event.organizer_email && (
                          <div className="mt-3 text-sm text-gray-600">
                            <strong>Contact:</strong> {event.organizer_email}
                            {event.organizer_phone && ` | ${event.organizer_phone}`}
                          </div>
                        )}

                        {event.application_link && (
                          <div className="mt-2">
                            <a 
                              href={event.application_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 text-sm underline"
                            >
                              Application Link
                            </a>
                          </div>
                        )}

                        <div className="mt-3 text-xs text-gray-500">
                          <strong>Submitted:</strong> {format(new Date(event.created_at), 'MMM d, yyyy')} | 
                          <strong> Deadline:</strong> {event.deadline} | 
                          <strong> Category:</strong> {event.category}
                        </div>
                      </div>

                      {event.image && (
                        <div className="ml-4">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      {event.approval_status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateEventStatus(event.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateEventStatus(event.id, 'rejected', 'Does not meet requirements')}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteEvent(event.id)}
                        className="border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-cream-50 dark:bg-gray-900/20 border-t py-3 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {filteredEvents.length} of {events.length} events
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending: {events.filter(e => e.approval_status === 'pending').length}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Approved: {events.filter(e => e.approval_status === 'approved').length}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Rejected: {events.filter(e => e.approval_status === 'rejected').length}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
