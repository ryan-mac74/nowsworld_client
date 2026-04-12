import { cn } from "@/lib/tailwind-merge";
import { RefreshCw } from "lucide-react";

type PullToRefreshIconProps = {
    isRefreshing: boolean;
    indicatorRef: React.RefObject<HTMLDivElement | null>;
    iconRef: React.RefObject<SVGSVGElement | null>;
};

export default function PullToRefreshIcon({
    isRefreshing,
    indicatorRef,
    iconRef,
}: PullToRefreshIconProps) {
    return (
        <div
            ref={indicatorRef}
            className="
                flex justify-center items-center 
                overflow-hidden w-full h-0
            "
        >
            <RefreshCw
                ref={iconRef}
                className={cn(
                    "text-neutral-600 dark:text-neutral-400",
                    { "animate-spin": isRefreshing }
                )}
            />
        </div>
    );
}
