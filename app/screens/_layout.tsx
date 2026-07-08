import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="notification"
        options={{
          title: "Notifications",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="setting"
        options={{
          title: "Settings and privacy ",
          headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="editprofile"
        options={{
          animation: "fade",
          headerShown: false,
        }}
      />
      <Stack.Screen name="searchUser" />
      <Stack.Screen name="userprofile" />
    </Stack>
  );
}
