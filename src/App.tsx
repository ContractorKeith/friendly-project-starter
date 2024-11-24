import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import { supabase } from "./lib/supabase";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;