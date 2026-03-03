import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-4 py-2 rounded-md border 
                 border-neutral-300 dark:border-neutral-700
                 bg-neutral-200 dark:bg-neutral-800
                 text-neutral-800 dark:text-neutral-100
                 transition-colors"
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
