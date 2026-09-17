import { useCallback, useEffect, useState } from "react";
import { fetchStories } from "@/services/stories";
import type { Story } from "@/types/story";

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setStories(await fetchStories());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stories, loading, reload: load };
}
