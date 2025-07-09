
import { useCallback } from "react";

export function useLogout() {
  return useCallback(async () => {
    // TODO: Replace with your custom logout implementation
    // Example: await fetch('/api/logout', { method: 'POST' });
    
    // For now, just redirect to home
    window.location.href = "/";
  }, []);
}
