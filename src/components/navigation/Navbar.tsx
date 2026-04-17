import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, MessageCircle, Search, Bell, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/tailwind-merge";

const tabs = [
    { id: 'feed', route: '/', icon: Home },
    { id: 'chat', route: '/chat', icon: MessageCircle },
    { id: 'search', route: '/search', icon: Search },
    { id: 'notification', route: '/notification', icon: Bell },
    { id: 'profile', route: '/profile', icon: UserIcon }
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    // Find tab matching the current route (default: 0 (feed))
    const activeIndex = tabs.findIndex(tab => (location.pathname === tab.route));
    const activeTab = (activeIndex !== -1) ? activeIndex : 0;

    useEffect(() => {
        let touchStartX = 0;
        let touchStartY = 0;
        let currentX = 0;
        let isHorizontalSwipe = false;
        let isSidebarOpenAtStart = false;

        const sidebar = document.getElementById("app-sidebar");

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;

            isHorizontalSwipe = false;
            isSidebarOpenAtStart = sidebar?.classList.contains("translate-x-0") || false;
        };

        const handleTouchMove = (e: TouchEvent) => {
            currentX = e.changedTouches[0].screenX;
            const currentY = e.changedTouches[0].screenY;
            const diffX = touchStartX - currentX;
            const diffY = touchStartY - currentY;

            // Detect if it's a horizontal swipe
            if (!isHorizontalSwipe && (Math.abs(diffX) > Math.abs(diffY)) && (Math.abs(diffX) > 10)) {
                isHorizontalSwipe = true;
            }

            if (isHorizontalSwipe) {
                if (isSidebarOpenAtStart) {
                    // Pulling the sidebar closed 1:1
                    if (diffX > 0 && sidebar) {
                        sidebar.style.transition = "none";
                        sidebar.style.transform = `translateX(-${diffX}px)`;
                    }
                } else {
                    if (diffX < 0) {
                        // Pulling the sidebar open 1:1
                        if (sidebar) {
                            sidebar.style.transition = "none";
                            sidebar.style.transform = `translateX(calc(-100% + ${Math.abs(diffX)}px))`;
                        }
                    }
                }
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diffX = touchStartX - touchEndX;

            // Reset inline tracking styles so transitions take over again
            if (sidebar) {
                sidebar.style.transition = ""; sidebar.style.transform = "";
            }

            // Perform navigation if threshold is crossed
            if (isHorizontalSwipe && Math.abs(diffX) > 50) {
                if (isSidebarOpenAtStart) {
                    if (diffX > 0) {
                        // Swiped Left: Close the sidebar
                        window.dispatchEvent(new Event("close-sidebar"));
                    }
                } else {
                    if (diffX < 0) {
                        // Swiped Right: Open the sidebar from any tab
                        window.dispatchEvent(new Event("open-sidebar"));
                    }
                }
            }
        };

        // Attach global listeners for full-screen swipe support
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    return (
        <nav
            className="
                max-w-2xl mx-auto fixed bottom-0 left-0 right-0 w-full h-14 
                bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 
                z-10 flex shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-none
            "
        >
            {/* Sliding active indicator */}
            <div
                className="
                    absolute top-0 left-0 h-0.5 bg-neutral-900 dark:bg-neutral-100 
                    transition-transform duration-300 ease-in-out
                "
                style={{
                    width: `${100 / tabs.length}%`,
                    transform: `translateX(${activeTab * 100}%)`
                }}
            />

            {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = (activeTab === index);

                return (
                    <button
                        key={tab.id}
                        onClick={(e) => {
                            if (tab.id === 'feed' && isActive) {
                                e.preventDefault();

                                // Scroll back to top of the page
                                window.scrollTo({ top: 0, behavior: 'smooth' });

                                return;
                            }

                            navigate(tab.route);
                        }}
                        className={cn(
                            'flex flex-1 justify-center items-center transition-colors duration-300',
                            `${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`
                        )}
                    >
                        <Icon
                            size={24}
                            className={cn(
                                'transition-transform duration-300',
                                `${isActive ? 'scale-110' : 'scale-100'}`
                            )}
                        />
                    </button>
                );
            })}
        </nav>
    );
}
