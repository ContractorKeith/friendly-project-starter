import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminSettings from "./pages/AdminSettings";
import ArchivedMeetings from "./pages/ArchivedMeetings";
import ProfileSettings from "./pages/ProfileSettings";
import Login from "./pages/Login";
import { MainNav } from "./components/MainNav";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component with session check
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

function App() {
  const session = useSession();

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);
      
      if (event === "SIGNED_OUT") {
        // Clear query cache on logout
        queryClient.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {session && <MainNav />}
        <Routes>
          <Route path="/login" element={
            session ? <Navigate to="/" replace /> : <Login />
          } />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/archived"
            element={
              <ProtectedRoute>
                <ArchivedMeetings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;