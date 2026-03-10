import { useTheme } from "@/hooks/useTheme";
import Button from "@/components/ui/Button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
        border border-neutral-300 dark:border-neutral-700
      text-neutral-800 dark:text-neutral-100 text-base
        bg-white dark:bg-neutral-800
      "
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}
