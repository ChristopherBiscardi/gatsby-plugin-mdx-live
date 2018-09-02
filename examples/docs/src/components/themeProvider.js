import * as React from "react";
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming";
import { default as defaultTheme } from "./theme";

export default function ThemeProvider({ children, theme = {} }) {
  return (
    <EmotionThemeProvider theme={{ ...defaultTheme, ...theme }}>
      {children}
    </EmotionThemeProvider>
  );
}
