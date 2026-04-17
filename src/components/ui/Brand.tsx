export default function Brand() {
  const VITE_PROJECT_NAME = import.meta.env.VITE_PROJECT_NAME || "NowSWorld";

  return (
    <>
      <img
        src="/logo.png" alt="NSW"
        className="w-6 sm:w-8 h-6 sm:h-8 invert dark:invert-0"
      />

      <span className="text-2xl sm:text-4xl font-extrabold tracking-tight">
        {VITE_PROJECT_NAME}
      </span>
    </>
  );
}
