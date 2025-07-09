
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";

interface User {
  id: number;
  username: string;
  email: string;
}

export function useAuthSession() {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ id: string; username: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const tokens = apiService.getStoredTokens();
      if (!tokens.access) {
        setLoading(false);
        return;
      }

      // Verify token by fetching user profile
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
      setSession({ user: currentUser });
      setProfile({
        id: currentUser.id.toString(),
        username: currentUser.username,
      });
    } catch (error) {
      // Token might be expired, try to refresh
      const tokens = apiService.getStoredTokens();
      if (tokens.refresh) {
        try {
          const refreshResponse = await apiService.refreshToken(tokens.refresh);
          apiService.storeTokens(refreshResponse.access, tokens.refresh);
          
          // Retry fetching user profile
          const currentUser = await apiService.getCurrentUser();
          setUser(currentUser);
          setSession({ user: currentUser });
          setProfile({
            id: currentUser.id.toString(),
            username: currentUser.username,
          });
        } catch (refreshError) {
          // Refresh failed, clear tokens
          apiService.clearTokens();
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } else {
        // No refresh token, clear everything
        apiService.clearTokens();
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return { session, user, profile, loading, checkAuthStatus };
}
