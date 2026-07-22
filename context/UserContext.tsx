import { supabase } from "@/services/supabase";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  email: string;
};

type UserContextType = {
  user: Profile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  signOut: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData.user;

      if (!authUser) {
        setUser(null);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, bio, avatar_url")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.log("fetch profile failed", error);
        setUser(null);
        return;
      }

      setUser({
        ...profile,
        email: authUser.email ?? "",
      });
    } catch (error) {
      console.log("fetchUser failed", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchUser();
        } else {
          setUser(null);
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);