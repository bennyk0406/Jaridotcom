import { createContext } from "react";

export type Theme = "light" | "dark";

const userColorTheme = localStorage.getItem("color-theme") as Theme;
const osColorTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeContext = createContext({
    theme: userColorTheme ?? osColorTheme,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleTheme: () => {}
});