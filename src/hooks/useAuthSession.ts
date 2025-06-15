
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuthSession() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<{ id: string; username: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitial = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);

      if (data.session?.user) {
        // Fetch profile
        fetchProfile(data.session.user.id);
      }
    };

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      setProfile(error ? null : data);
    };

    getInitial();

    return () => {
      listener?.subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  return { session, user, profile, loading };
}
