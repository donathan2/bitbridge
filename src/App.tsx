
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import FindProject from "./pages/FindProject";
import Settings from "./pages/Settings";
import Friends from "./pages/Friends";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import ProjectWorkspace from "./pages/ProjectWorkspace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-slate-900">
          <NavBar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/find-project" element={<FindProject />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/project/:projectId" element={<ProjectWorkspace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
