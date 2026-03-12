import { useTheme } from "@/hooks/useTheme";
import Button from "@/components/ui/Button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
        w-10 h-10 rounded-full
        flex items-center justify-center
        border border-neutral-300 dark:border-neutral-700
        text-neutral-800 dark:text-neutral-200 text-base
        bg-white dark:bg-neutral-800
      "
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}
