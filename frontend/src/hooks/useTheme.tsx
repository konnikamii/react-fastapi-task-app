import { useState, useEffect } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    let newTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (!newTheme) {
      newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      localStorage.setItem("theme", newTheme);
    }
    return newTheme;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isLight = theme === "light";

  return { theme, setTheme, isLight };
};

export default useTheme;