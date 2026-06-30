import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="(modals)/story"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "fade_from_bottom", 
        }}
      />
    </Stack>
  );
}
