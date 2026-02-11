type StatusDialogProps = {
  type: string;
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
  const isError = type === "error";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`w-full max-w-sm rounded-lg bg-white p-6 shadow-lg
        ${isError ? "border border-red-500" : ""}`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Icon */}
          {isError ? (
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xl font-bold">!</span>
            </div>
          ) : (type === "success") ? (
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-xl font-bold">✓</span>
            </div>
          ) : (type === "loading") ? (
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          ) : null}

          {/* Title */}
          <h2
            className={`text-lg font-semibold ${
              isError ? "text-red-600" : "text-blue-600"
            }`}
          >
            {title}
          </h2>

          {/* Message */}
          {message && (
            <p className="text-sm text-gray-600">
              {message}
            </p>
          )}

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
