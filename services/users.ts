import { supabase } from "@/services/supabase";

/* FUTURE USE — uncomment when wiring:
import type { PublicProfile } from "@/types/user";

export async function fetchPublicProfile(
  userId: string,
): Promise<PublicProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data as unknown as PublicProfile;
}

export async function searchUsers(query: string): Promise<PublicProfile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url")
    .ilike("username", `%${query}%`)
    .limit(20);
  if (error) throw error;
  return (data ?? []) as unknown as PublicProfile[];
}
*/

export async function isUsernameTaken(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export async function createProfile(userId: string, username: string) {
  return supabase.from("profiles").insert({ id: userId, username });
}

/* FUTURE USE — uncomment when wiring:
import type { PublicProfile } from "@/types/user";

export async function updateProfile(
  userId: string,
  updates: Partial<PublicProfile>,
) {
  return supabase.from("profiles").update(updates).eq("id", userId);
}
*/
