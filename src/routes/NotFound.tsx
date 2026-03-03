import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center bg-white dark:bg-neutral-900">
      <h1 className="text-6xl font-bold text-neutral-900 dark:text-white">404</h1>
      <p className="text-neutral-600 dark:text-neutral-200">
        Page Not Found
      </p>

      <Link
        to="/"
        className="rounded-md bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
