import React from "react";
import ReactDOM from "react-dom/client";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase} initialSession={null}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);