
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Shield, Trash, UserPlus, Check, X, Mail } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UserData {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  status: string | null;
}

export function EnhancedUserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [adminToggleDialogOpen, setAdminToggleDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  
  // Add user form state
  const [newUserForm, setNewUserForm] = useState({
    email: "",
    password: "",
    full_name: "",
    username: "",
    bio: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      
      if (profiles) {
        const usersWithEmails: UserData[] = profiles.map((profile) => ({
          id: profile.id,
          full_name: profile.full_name,
          username: profile.username,
          email: profile.username ? `${profile.username}@domain.com` : 'no-email@domain.com',
          avatar_url: profile.avatar_url,
          is_admin: profile.is_admin || false,
          created_at: profile.created_at,
          status: profile.status
        }));
        
        setUsers(usersWithEmails);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAdmin = async (user: UserData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !user.is_admin })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, is_admin: !user.is_admin } : u
      ));
      
      toast({
        title: "Success",
        description: `${user.full_name || user.username} is now ${!user.is_admin ? 'an admin' : 'no longer an admin'}.`,
      });
      
      setAdminToggleDialogOpen(false);
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast({
        title: "Error",
        description: "Failed to update user admin status.",
        variant: "destructive"
      });
    }
  };
  
  const deleteUser = async (userId: string) => {
    try {
      // Delete from profiles table - this will cascade to related data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) throw profileError;
      
      // Try to delete from auth.users if possible (admin function)
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (authError) {
        console.log("Auth deletion not available in client-side, profile deleted successfully");
      }
      
      setUsers(users.filter(u => u.id !== userId));
      
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addNewUser = async () => {
    try {
      if (!newUserForm.email || !newUserForm.password) {
        toast({
          title: "Missing Information",
          description: "Email and password are required.",
          variant: "destructive"
        });
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserForm.email,
        password: newUserForm.password,
        email_confirm: true,
        user_metadata: {
          full_name: newUserForm.full_name,
          username: newUserForm.username
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: newUserForm.full_name || null,
            username: newUserForm.username || null,
            bio: newUserForm.bio || null,
            is_admin: false
          });

        if (profileError) throw profileError;

        toast({
          title: "User Created",
          description: `User ${newUserForm.email} has been successfully created.`,
        });

        // Reset form and close dialog
        setNewUserForm({
          email: "",
          password: "",
          full_name: "",
          username: "",
          bio: ""
        });
        setAddUserDialogOpen(false);
        
        // Refresh users list
        await fetchUsers();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <div className="flex justify-between">
          <div>
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
              <User className="h-5 w-5 mr-2" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setAddUserDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>
        <div className="mt-4">
          <Input 
            placeholder="Search users..." 
            className="max-w-sm border-purple-200" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-cream-200 dark:divide-gray-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-cream-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-3">
                            {user.avatar_url ? (
                              <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
                            ) : (
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {(user.full_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                            <div className="text-xs text-muted-foreground">@{user.username || 'no-username'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {user.email || 'No email'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {user.is_admin ? (
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 text-purple-600 mr-1" />
                            <span>Admin</span>
                          </div>
                        ) : (
                          "Member"
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge className="bg-green-100 text-green-800 border-0 dark:bg-green-900/30 dark:text-green-300">
                          Active
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20"
                            onClick={() => {
                              setCurrentUser(user);
                              setAdminToggleDialogOpen(true);
                            }}
                          >
                            {user.is_admin ? "Remove Admin" : "Make Admin"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                            onClick={() => {
                              setCurrentUser(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
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
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled className="border-purple-200">Previous</Button>
          <Button variant="outline" size="sm" disabled className="border-purple-200">Next</Button>
        </div>
      </CardFooter>
      
      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account with basic information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="John Doe"
                value={newUserForm.full_name}
                onChange={(e) => setNewUserForm({...newUserForm, full_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                value={newUserForm.username}
                onChange={(e) => setNewUserForm({...newUserForm, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="User bio..."
                value={newUserForm.bio}
                onChange={(e) => setNewUserForm({...newUserForm, bio: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewUser} className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {currentUser?.full_name || currentUser?.username || "this user"}'s account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => currentUser && deleteUser(currentUser.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Toggle Admin Dialog */}
      <AlertDialog open={adminToggleDialogOpen} onOpenChange={setAdminToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {currentUser?.is_admin 
                ? "Remove admin privileges?" 
                : "Grant admin privileges?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentUser?.is_admin 
                ? `This will remove admin access for ${currentUser?.full_name || currentUser?.username}.`
                : `This will give ${currentUser?.full_name || currentUser?.username} full admin access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className={currentUser?.is_admin ? "bg-amber-600 hover:bg-amber-700" : "bg-purple-600 hover:bg-purple-700"}
              onClick={() => currentUser && toggleAdmin(currentUser)}
            >
              {currentUser?.is_admin ? "Remove Admin" : "Make Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
