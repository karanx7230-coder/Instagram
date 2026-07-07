import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qtlemwupohlxyegqhkph.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bGVtd3Vwb2hseHllZ3Foa3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MTQzMjksImV4cCI6MjA5ODk5MDMyOX0.M3Nvr15hFnBiTj7SaGUlD1yQ_ZghyLQ5rZrnhbXSLpE"; // paste your anon key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
