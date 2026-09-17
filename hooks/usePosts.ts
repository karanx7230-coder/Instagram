/* FUTURE USE — uncomment when feed screens adopt this hook.
import { useCallback, useEffect, useState } from "react";
import { fetchFeedPosts, fetchLikedPostIds } from "@/services/posts";
import type { Post } from "@/types/post";

export function usePosts(currentUserId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [feed, liked] = await Promise.all([
        fetchFeedPosts(),
        currentUserId ? fetchLikedPostIds(currentUserId) : Promise.resolve(new Set<string>()),
      ]);
      setPosts(feed);
      setLikedPostIds(liked);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    load();
  }, [load]);

  return { posts, likedPostIds, loading, reload: load };
}
*/

export {};
