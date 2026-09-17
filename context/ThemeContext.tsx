import { createContext, useContext, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, type Theme } from "@/constants/theme";

type ThemeContextType = {
  theme: Theme;
  scheme: "light" | "dark";
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  scheme: "light",
  isDark: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const scheme = systemScheme === "dark" ? "dark" : "light";
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ theme, scheme, isDark: scheme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
