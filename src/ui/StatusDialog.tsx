type StatusDialogProps = {
  type: "loading" | "error" | "success" | "warning";
  title: string;
  message?: string;
  onRetry?: () => void;
};

export default function StatusDialog({
  type,
  title,
  message,
  onRetry,
}: StatusDialogProps) {
  const iconData = {
    loading: (
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500" />
    ),
    error: (
      <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
        <span className="text-white text-xl font-bold">!</span>
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
    loading: "text-blue-500",
    error: "text-red-500",
    success: "text-green-500",
    warning: "text-yellow-500",
  };

  const isError = type === "error";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-full max-w-sm rounded-lg bg-neutral-900 p-6 shadow-lg border ${
          isError ? "border-red-500" : "border-neutral-700"
        }`}
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
            <p className="text-sm text-neutral-200">
              {message}
            </p>
          }

          {/* Retry button */}
          {isError && onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
