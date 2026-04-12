import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Brand from "@/components/ui/Brand";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LoginDialog from "@/components/dialogs/LoginDialog";
import UserMenu from "@/components/navigation/UserMenu";
import type { UserPublic } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import Sidebar from "@/components/navigation/Sidebar";

const menuItemClass = `
    w-full h-8 flex items-center justify-center
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
    logout: () => void;
    deleteAllAccounts: () => void;
    deleteAccount: () => void;
    deactivateAccount: () => void;
    activateAccount: () => void;
};

export default function AppHeader({
    user,
    logout,
    deleteAllAccounts,
    deleteAccount,
    deactivateAccount,
    activateAccount,
}: UserMenuProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleOpenSidebar = () => setIsSidebarOpen(true);
        const handleCloseSidebar = () => setIsSidebarOpen(false);

        // Listen for events to open/close the sidebar from anywhere
        window.addEventListener("open-sidebar", handleOpenSidebar);
        window.addEventListener("close-sidebar", handleCloseSidebar);

        return () => {
            // Clean up event listeners on unmount
            window.removeEventListener("open-sidebar", handleOpenSidebar);
            window.removeEventListener("close-sidebar", handleCloseSidebar);
        };
    }, []);

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
                        className={headerButtonClass}
                        aria-label="Open Sidebar"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={15} />
                    </Button>

                    <Button disabled className={`${headerButtonClass} uppercase`} aria-label="Change Language">
                        <span>EN</span>
                    </Button>
                </div>

                {/* Center Section */}
                <Link
                    to="/"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
            />
        </header>
    );
}
