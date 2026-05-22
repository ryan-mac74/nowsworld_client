import { useState, useEffect, useRef } from "react";

export default function usePullToRefresh() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        let startY = 0;
        let isPulling = false;
        let pullDistance = 0;

        const handleTouchStart = (e: TouchEvent) => {
            // Only allow pull-to-refresh at the very top of the page
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isPulling || isRefreshing) {
                return;
            }

            const currentY = e.touches[0].clientY;
            const diff = currentY - startY;

            if (diff > 0 && window.scrollY <= 0) {
                // Add resistance/friction to the pull
                pullDistance = Math.min(diff * 0.4, 70);

                if (indicatorRef.current) {
                    indicatorRef.current.style.height = `${pullDistance}px`;
                    indicatorRef.current.style.opacity = `${Math.min(pullDistance / 60, 1)}`;
                }
                if (iconRef.current) {
                    iconRef.current.style.transform = `rotate(${pullDistance * 3}deg)`;
                }
            }
        };

        const handleTouchEnd = () => {
            if (!isPulling) {
                return;
            }
            isPulling = false;

            if (pullDistance >= 60) {
                setIsRefreshing(true);
                if (indicatorRef.current) {
                    indicatorRef.current.style.height = '60px';
                    indicatorRef.current.style.transition = 'height 0.2s ease-in-out';
                }
                if (iconRef.current) {
                    // Clear inline rotation so TailwindCSS's animate-spin can take over
                    iconRef.current.style.transform = '';
                }

                // Trigger global "refetch-feed" event
                window.dispatchEvent(new Event("refetch-feed"));

                // Visual delay so user can see the spinner
                setTimeout(() => {
                    setIsRefreshing(false);

                    if (indicatorRef.current) {
                        indicatorRef.current.style.height = '0px';
                    }
                }, 1000);
            } else {
                pullDistance = 0;

                if (indicatorRef.current) {
                    indicatorRef.current.style.height = '0px';
                    indicatorRef.current.style.transition = 'height 0.2s ease-in-out';
                }
            }

            // Clear transition class to avoid lagging the next pull
            setTimeout(() => {
                if (indicatorRef.current) {
                    indicatorRef.current.style.transition = '';
                }
            }, 200);
        };

        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isRefreshing]);

    return { isRefreshing, indicatorRef, iconRef };
}
