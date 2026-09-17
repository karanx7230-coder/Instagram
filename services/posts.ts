import { supabase } from "@/services/supabase";
import type { Post } from "@/types/post";

const POST_SELECT =
  "id, image_url, caption, location, user_id, aspect_ratio, profiles(username, avatar_url), likes(count)";

export async function fetchFeedPosts(options?: {
  page?: number;
  pageSize?: number;
}): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false });
  if (options?.page !== undefined && options?.pageSize !== undefined) {
    const from = options.page * options.pageSize;
    query = query.range(from, from + options.pageSize - 1);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Post[];
}

export async function fetchLikedPostIds(
  userId: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", userId);
  if (error) throw error;
  return new Set((data ?? []).map((l) => l.post_id as string));
}

export async function likePost(postId: string, userId: string) {
  return supabase.from("likes").insert({ post_id: postId, user_id: userId });
}

export async function unlikePost(postId: string, userId: string) {
  return supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
}

export async function fetchLikeCount(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);
  if (error) throw error;
  return count ?? 0;
}

export async function hasUserLiked(
  postId: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}
