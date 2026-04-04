import { cn } from "@/lib/tailwind-merge"

export default function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}
