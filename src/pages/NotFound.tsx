import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-gray-600">
        Page Not Found
      </p>

      <Link
        to="/"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
