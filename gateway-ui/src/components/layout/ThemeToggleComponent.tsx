import React from "react";
import { useTheme } from "../../contexts/theme";

const ThemeToggleComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      type="button"
    >
      <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
};

export default ThemeToggleComponent;