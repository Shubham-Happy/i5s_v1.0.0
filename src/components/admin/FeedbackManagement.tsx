
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Eye, Check, X, Search } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeedbackData {
  id: string;
  user_id: string | null;
  name: string | null;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast({
        title: "Error",
        description: "Failed to load feedback submissions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status: newStatus })
        .eq('id', feedbackId);
      
      if (error) throw error;
      
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === feedbackId ? { ...feedback, status: newStatus } : feedback
      ));
      
      toast({
        title: "Success",
        description: `Feedback marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating feedback status:", error);
      toast({
        title: "Error",
        description: "Failed to update feedback status.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      reviewed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      dismissed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || statusColors.pending}>
        {status}
      </Badge>
    );
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.name && feedback.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (feedback: FeedbackData) => {
    setSelectedFeedback(feedback);
    setDetailsDialogOpen(true);
  };

  return (
    <>
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
                <MessageSquare className="h-5 w-5 mr-2" />
                Feedback Management
              </CardTitle>
              <CardDescription>Manage user feedback and support requests</CardDescription>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search feedback..." 
                className="pl-10 border-purple-200" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-50 dark:bg-purple-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-cream-200 dark:divide-gray-700">
                  {filteredFeedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No feedback found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredFeedbacks.map((feedback) => (
                      <tr key={feedback.id} className="hover:bg-cream-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium">{feedback.name || 'Anonymous'}</div>
                            <div className="text-sm text-muted-foreground">{feedback.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{feedback.subject}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-xs">
                            {feedback.message}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(feedback.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                              onClick={() => handleViewDetails(feedback)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {feedback.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-200 text-green-700 hover:bg-green-50"
                                onClick={() => updateFeedbackStatus(feedback.id, 'reviewed')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {feedback.status !== 'dismissed' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-200 text-red-700 hover:bg-red-50"
                                onClick={() => updateFeedbackStatus(feedback.id, 'dismissed')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-cream-50 dark:bg-gray-900/20 border-t py-3 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedback submissions
          </div>
        </CardFooter>
      </Card>

      {/* Feedback Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              View and manage this feedback submission
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">From:</label>
                  <p className="text-sm">{selectedFeedback.name || 'Anonymous'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email:</label>
                  <p className="text-sm">{selectedFeedback.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Subject:</label>
                <p className="text-sm">{selectedFeedback.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Message:</label>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm whitespace-pre-wrap">
                  {selectedFeedback.message}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Status:</label>
                  {getStatusBadge(selectedFeedback.status)}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => updateFeedbackStatus(selectedFeedback.id, 'resolved')}
                    disabled={selectedFeedback.status === 'resolved'}
                  >
                    Mark Resolved
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => updateFeedbackStatus(selectedFeedback.id, 'dismissed')}
                    disabled={selectedFeedback.status === 'dismissed'}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
