import React from "react";
import {useTheme} from "../../contexts/themeContext";

const ThemeToggleComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <button
      className="p-2 bg-blue-500 text-white rounded dark:bg-blue-400 dark:text-gray-900"
      onClick={handleToggle}
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggleComponent;