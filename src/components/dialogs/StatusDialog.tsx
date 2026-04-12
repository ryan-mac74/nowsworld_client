import Button from "@/components/ui/Button";
import { cn } from "@/lib/tailwind-merge";

type StatusDialogProps = {
  type: "loading" | "error" | "success" | "warning";
  title: string;
  message?: string;
  onRetry?: () => void;
};

export default function StatusDialog({ type, title, message, onRetry }: StatusDialogProps) {
  const iconData = {
    loading: (
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 dark:border-neutral-600 border-t-blue-600 dark:border-t-blue-400" />
    ),
    error: (
      <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
        <span className="text-white text-xl font-bold">x</span>
      </div>
    ),
    success: (
      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
        <span className="text-white text-xl font-bold">✓</span>
      </div>
    ),
    warning: (
      <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
        <span className="text-black text-xl font-bold">!</span>
      </div>
    ),
  };

  const titleColor = {
    loading: "text-blue-600 dark:text-blue-400",
    error: "text-red-600 dark:text-red-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
  };

  const isError = (type === "error");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={cn(
          "w-full max-w-sm rounded-lg bg-white dark:bg-neutral-900 p-6 shadow-lg border",
          isError ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
        )}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Icon */}
          {iconData[type]}

          {/* Title */}
          <h2 className={`text-lg font-semibold ${titleColor[type]}`}>
            {title}
          </h2>

          {/* Message */}
          {message &&
            <p className="text-sm text-neutral-600 dark:text-neutral-200">
              {message}
            </p>
          }

          {/* Retry button */}
          {isError && onRetry && (
            <Button
              onClick={onRetry}
              className="mt-2 text-white bg-red-600 hover:bg-red-700"
            >
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
