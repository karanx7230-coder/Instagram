import { Stack } from "expo-router";
export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="notifications"
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="editProfile"
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen name="searchUser" />
      <Stack.Screen
        name="addPost"
        options={{
          headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen name="userProfile" />

      <Stack.Screen
        name="addHighlight"
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="addStory"
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="highlight"
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="posts"
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="searchpost"
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
    </Stack>
  );
}
