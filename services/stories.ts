import { supabase } from "@/services/supabase";
import type { Story } from "@/types/story";

type StoryRow = {
  id: string;
  image_url: string;
  profiles: { username: string; avatar_url: string };
};

export async function fetchStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from("story")
    .select("image_url,id,profiles(username, avatar_url)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as StoryRow[]).map((row) => ({
    id: row.id,
    image: row.image_url,
    username: row.profiles.username,
    profileImage: row.profiles.avatar_url,
  }));
}

/* FUTURE USE — uncomment when wiring (also re-add Highlight to the type import above):
import type { Highlight } from "@/types/story";

export async function fetchHighlights(userId: string): Promise<Highlight[]> {
  const { data, error } = await supabase
    .from("highlight")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []) as unknown as Highlight[];
}

export async function addHighlight(entry: Record<string, unknown>) {
  return supabase.from("highlight").insert(entry);
}
*/
