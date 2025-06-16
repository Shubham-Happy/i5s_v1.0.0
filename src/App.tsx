
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ABTestingProvider } from "./context/ABTestingContext";
import { AuthNavigationHandler } from "./components/auth/AuthNavigationHandler";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import Articles from "./pages/Articles";
import CreateArticle from "./pages/CreateArticle";
import ArticleDetail from "./pages/ArticleDetail";
import Network from "./pages/Network";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import JobDetail from "./pages/JobDetail";
import JobApplications from "./pages/JobApplications";
import StartupShowcase from "./pages/StartupShowcase";
import StartupDetail from "./pages/StartupDetail";
import LaunchStartup from "./pages/LaunchStartup";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import KingismPanel from "./pages/KingismPanel";
import Fundraising from "./pages/Fundraising";
import FundraisingDetail from "./pages/FundraisingDetail";
import Feedback from "./pages/Feedback";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import ProfileSetup from "./pages/ProfileSetup";
import { MainLayout } from "./components/layout/MainLayout";
import { RequireAuth } from "./components/layout/RequireAuth";
import { RequireProfile } from "./components/layout/RequireProfile";
import { AuthGuard } from "./components/AuthGuard";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ABTestingProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AuthNavigationHandler />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/faq" element={<FAQ />} />
                  
                  {/* Profile setup (requires auth but not complete profile) */}
                  <Route path="/profile-setup" element={<RequireAuth><ProfileSetup /></RequireAuth>} />
                  
                  {/* Protected routes that require authentication and complete profile */}
                  <Route path="/home" element={<RequireAuth><RequireProfile><MainLayout><Home /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/posts" element={<RequireAuth><RequireProfile><MainLayout><Posts /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/profile" element={<RequireAuth><RequireProfile><MainLayout><Profile /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/profile/:userId" element={<RequireAuth><RequireProfile><MainLayout><Profile /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/articles" element={<RequireAuth><RequireProfile><MainLayout><Articles /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/articles/new" element={<RequireAuth><RequireProfile><MainLayout><CreateArticle /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/articles/:id" element={<RequireAuth><RequireProfile><MainLayout><ArticleDetail /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/network" element={<RequireAuth><RequireProfile><MainLayout><Network /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/startups" element={<RequireAuth><RequireProfile><MainLayout><StartupShowcase /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/startups/launch" element={<RequireAuth><RequireProfile><MainLayout><LaunchStartup /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/startups/:id" element={<RequireAuth><RequireProfile><MainLayout><StartupDetail /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  {/* Fundraising routes now require authentication */}
                  <Route path="/fundraising" element={<RequireAuth><RequireProfile><MainLayout><Fundraising /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/fundraising/:id" element={<RequireAuth><RequireProfile><MainLayout><FundraisingDetail /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/jobs" element={<RequireAuth><RequireProfile><MainLayout><Jobs /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/jobs/new" element={<RequireAuth><RequireProfile><MainLayout><PostJob /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/jobs/:id" element={<RequireAuth><RequireProfile><MainLayout><JobDetail /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/jobs/:id/applications" element={<RequireAuth><RequireProfile><MainLayout><JobApplications /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/messages" element={<RequireAuth><RequireProfile><MainLayout><Messages /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/search" element={<RequireAuth><RequireProfile><MainLayout><Search /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/settings" element={<RequireAuth><RequireProfile><MainLayout><Settings /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/notifications" element={<RequireAuth><RequireProfile><MainLayout><Notifications /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  <Route path="/feedback" element={<RequireAuth><RequireProfile><MainLayout><Feedback /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  {/* About Us route - protected with MainLayout */}
                  <Route path="/about-us" element={<RequireAuth><RequireProfile><MainLayout><AboutUs /></MainLayout></RequireProfile></RequireAuth>} />
                  
                  {/* Admin routes - both /kingism and /kingism-panel for flexibility */}
                  <Route path="/kingism" element={<AuthGuard><KingismPanel /></AuthGuard>} />
                  <Route path="/kingism-panel" element={<AuthGuard><KingismPanel /></AuthGuard>} />
                </Routes>
              </TooltipProvider>
            </ABTestingProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
