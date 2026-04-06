import { cn } from "@/lib/tailwind-merge";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  aria_label?: string;
  className?: string;
}

export default function Button({
  children,
  type = "button",
  onClick,
  disabled,
  aria_label = "",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={aria_label}
      className={cn(
        "px-2 sm:px-4 py-0 sm:py-2 h-8 sm:h-10 rounded-md text-sm font-medium transition",
        "disabled:opacity-50 hover:opacity-80 cursor-pointer disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  )
}
