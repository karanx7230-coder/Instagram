import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/context/UserContext";
export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        setSession(session);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "(auth)";

    if (!session && !inAuth) router.replace("/(auth)/login");
    if (session && inAuth) router.replace("/(tabs)");
  }, [session, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <UserProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          {/* <Stack.Screen name="ChatScreen" /> */}
          <Stack.Screen
            name="screens"
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="(modals)"
            options={{ presentation: "transparentModal" }}
          />
        </Stack>
      </GestureHandlerRootView>
    </UserProvider>
  );
}
