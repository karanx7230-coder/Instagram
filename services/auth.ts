import { supabase } from "@/services/supabase";

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

/* FUTURE USE — uncomment when wiring:
export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: (event: string, session: unknown) => void,
) {
  return supabase.auth.onAuthStateChange(callback as never);
}
*/
