import Skeleton from "@/components/ui/Skeleton";

export default function NewsFeedSkeleton() {
    return (
        <div
            className="
                w-full max-w-2xl border border-neutral-200 dark:border-neutral-700 
                rounded-lg p-4 shadow-md bg-white dark:bg-neutral-800
            "
        >
            {/* User Info */}
            <div className="flex items-center justify-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />

                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>

            {/* Posts */}
            <div className="mt-4 space-y-4">
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className="
                            border-b border-neutral-200 dark:border-neutral-700 
                            rounded p-4 bg-neutral-50 dark:bg-neutral-900
                        "
                    >
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-2 w-24" />
                            <Skeleton className="h-2 w-12" />
                        </div>

                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
