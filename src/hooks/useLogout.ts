
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Utility to clean leftover Supabase auth keys
export const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      sessionStorage.removeItem(key);
    }
  });
};

export function useLogout() {
  return useCallback(async () => {
    // Clean up local/session storage auth keys
    cleanupAuthState();
    // Attempt global sign out — ignore any failures
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch {}
    // Force page reload for a clean state
    window.location.href = "/";
  }, []);
}
