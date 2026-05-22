import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Brand from "@/components/ui/Brand";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LoginDialog from "@/components/dialogs/LoginDialog";
import UserMenu from "@/components/navigation/UserMenu";
import type { UserPublic } from "@/types/user";
import { Menu } from "lucide-react";
import Sidebar from "@/components/navigation/Sidebar";
import type { Update } from "@/components/navigation/Sidebar";

const VITE_API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api";

const menuItemClass = `
    w-full h-8 flex items-center 
    bg-neutral-100 dark:bg-neutral-800
    hover:bg-neutral-200 dark:hover:bg-neutral-700
    gap-2 cursor-pointer
`;

export const headerButtonClass = `
    flex items-center justify-center
    border border-neutral-300 dark:border-neutral-700
    text-neutral-800 dark:text-neutral-200
    bg-white dark:bg-neutral-800
    text-sm sm:text-lg rounded-xl
`;

export type UserMenuProps = {
    user: UserPublic | null;
    isAuthLoading: boolean;
    logout: () => void;
    deleteAllAccounts: () => void;
    deleteAccount: () => void;
    deactivateAccount: () => void;
    activateAccount: () => void;
};

export default function AppHeader({
    user,
    isAuthLoading,
    logout,
    deleteAllAccounts,
    deleteAccount,
    deactivateAccount,
    activateAccount,
}: UserMenuProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [updates, setUpdates] = useState<Update[]>([]);

    useEffect(() => {
        // Only fetch updates if user is authenticated and auth state is not loading
        if (isAuthLoading) {
            return;
        }

        async function fetchUpdates() {
            try {
                const res = await fetch(`${VITE_API_URL}/public/updates`, {
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setUpdates(data);
                }
            } catch (error) {
                console.error("❌ Failed to fetch updates:", error);
            }
        }

        fetchUpdates();
        window.addEventListener("refetch-updates", fetchUpdates);

        return () => {
            // Clean up event listener on unmount
            window.removeEventListener("refetch-updates", fetchUpdates);
        };
    }, [user, isAuthLoading]);

    useEffect(() => {
        const handleOpenSidebar = () => setIsSidebarOpen(true);
        const handleCloseSidebar = () => setIsSidebarOpen(false);

        // Listen for custom events from anywhere in the app
        window.addEventListener("open-sidebar", handleOpenSidebar);
        window.addEventListener("close-sidebar", handleCloseSidebar);

        return () => {
            // Clean up event listeners on unmount
            window.removeEventListener("open-sidebar", handleOpenSidebar);
            window.removeEventListener("close-sidebar", handleCloseSidebar);
        };
    }, []);

    const handleMarkAsViewed = async (id: number) => {
        try {
            const res = await fetch(`${VITE_API_URL}/public/updates/${id}/view`, {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                // Mark unviewed updates as viewed
                setUpdates((prev) => prev.map((update) => (
                    (update.id === id) ? { ...update, viewed: true } : update
                )));
            }
        } catch (error) {
            console.error("❌ Failed to mark update as viewed:", error);
        }
    };

    const unviewedUpdatesCount = updates.filter((update) => !update.viewed).length;

    return (
        <header
            className="
                w-full max-w-2xl
                sticky top-0 z-10
                bg-white dark:bg-neutral-900
                border-b border-neutral-200 dark:border-neutral-800
            "
        >
            <div className="max-w-2xl mx-auto h-14 flex items-center justify-between gap-2">
                {/* Left Section */}
                <div className="flex items-center justify-start gap-2">
                    <Button
                        className={`${headerButtonClass} relative`}
                        aria-label="Open Sidebar"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={15} />
                        {unviewedUpdatesCount > 0 && (
                            <span className="absolute -top-1.5 -left-1.5 h-6 w-6 flex">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative h-6 w-6 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold">
                                    {unviewedUpdatesCount}
                                </span>
                            </span>
                        )}
                    </Button>

                    <Button disabled className={`${headerButtonClass} uppercase`} aria-label="Change Language">
                        <span>FR</span>

                        {/* TODO: EN Language Toggle */}
                    </Button>
                </div>

                {/* Center Section */}
                <Link
                    to="/"
                    state={{ fromNav: true }} // to mark this navigation as coming from here
                    className="flex items-center gap-0.5 sm:gap-1 no-underline text-inherit"
                >
                    <Brand />
                </Link>

                {/* Right Section */}
                <div className="flex items-center justify-end gap-1">
                    <ThemeToggle className={headerButtonClass} />
                    <div className="h-4 sm:h-6 w-[0.5px] bg-neutral-300 dark:bg-neutral-700 m-0" />

                    {user ? (
                        <UserMenu
                            user={user}
                            logout={async () => {
                                await logout();
                            }}
                            deleteAllAccounts={async () => {
                                await deleteAllAccounts();
                            }}
                            deleteAccount={async () => {
                                await deleteAccount();
                            }}
                            deactivateAccount={async () => {
                                await deactivateAccount();
                            }}
                            activateAccount={async () => {
                                await activateAccount();
                            }}
                            className={menuItemClass}
                        />
                    ) : (
                        <LoginDialog className={menuItemClass} />
                    )}
                </div>
            </div>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isOverlay
                updates={updates}
                onMarkAsViewed={handleMarkAsViewed}
            />
        </header>
    );
}
