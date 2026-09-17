/* FUTURE USE — uncomment when profile screens adopt this hook.
import { useCallback, useEffect, useState } from "react";
import { fetchPublicProfile } from "@/services/users";
import type { PublicProfile } from "@/types/user";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      setProfile(await fetchPublicProfile(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { profile, loading, reload: load };
}
*/

export {};
