import { useTheme } from "@/hooks/useTheme";
import Button from "@/components/ui/Button";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme((theme === "dark") ? "light" : "dark")}
      aria-label="Switch Theme"
      className={className}
    >
      {(theme === "dark") ? "☀️" : "🌙"}
    </Button>
  );
}
