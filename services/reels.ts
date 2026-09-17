import { supabase } from "@/services/supabase";
import type { Reel } from "@/types/reel";

export async function fetchReels(options?: {
  page?: number;
  pageSize?: number;
}): Promise<Reel[]> {
  let query = supabase
    .from("posts")
    .select(
      "id, image_url,caption,location,aspect_ratio,profiles(username,avatar_url)",
    )
    .order("created_at", { ascending: false });
  if (options?.page !== undefined && options?.pageSize !== undefined) {
    const from = options.page * options.pageSize;
    query = query.range(from, from + options.pageSize - 1);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Reel[];
}
