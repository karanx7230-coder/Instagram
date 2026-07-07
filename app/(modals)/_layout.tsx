import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="comments"
        options={{
          presentation: "transparentModal",
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="story"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
