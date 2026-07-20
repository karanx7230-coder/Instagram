import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack
    screenOptions={{
        headerShown: false,}}>
      <Stack.Screen
        name="comments"
        options={{
          presentation: "transparentModal",
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="story"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />
    </Stack>
  );
}
