
import { useCallback } from "react";
import { apiService } from "@/services/api";

export function useLogout() {
  return useCallback(async () => {
    // Clear tokens from localStorage
    apiService.clearTokens();
    
    // Redirect to home page
    window.location.href = "/";
  }, []);
}
