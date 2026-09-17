export type Theme = {
  background: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  tint: string;
  tabBar: string;
  statusBar: "light-content" | "dark-content";
};

export const lightTheme: Theme = {
  background: "#ffffff",
  card: "#ffffff",
  text: "#000000",
  muted: "#8e8e8e",
  border: "#eeeeee",
  tint: "#0095f6",
  tabBar: "#ffffff",
  statusBar: "dark-content",
};

export const darkTheme: Theme = {
  background: "#000000",
  card: "#121212",
  text: "#ffffff",
  muted: "#a8a8a8",
  border: "#2a2a2a",
  tint: "#0095f6",
  tabBar: "#000000",
  statusBar: "light-content",
};
