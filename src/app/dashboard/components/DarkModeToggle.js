"use client";
import { FaRegMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover-bg-theme transition"
      title="Toggle Light/Dark Mode"
    >
      {theme === "light" ? <FaRegMoon size={18} /> : <FiSun size={18} />}
    </button>
  );
}
