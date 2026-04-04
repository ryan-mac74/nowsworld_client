import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Brand from "@/components/ui/Brand";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LoginDialog from "@/components/dialogs/LoginDialog";
import UserMenu from "@/components/navigation/UserMenu";
import type { UserPublic } from "@/hooks/useAuth";
import { Menu } from "lucide-react";

const menuItemClass = `
    w-full h-8 flex items-center justify-center
    bg-neutral-100 dark:bg-neutral-800
    hover:bg-neutral-200 dark:hover:bg-neutral-700
    gap-2 cursor-pointer
`;

export const headerButtonClass = `
    w-15 h-10 rounded-full
    flex items-center justify-center
    border border-neutral-300 dark:border-neutral-700
    text-neutral-800 dark:text-neutral-200 text-base
    bg-white dark:bg-neutral-800
`;

export type UserMenuProps = {
    user: UserPublic | null;
    logout: () => void;
    deactivateAccount: () => void;
    activateAccount: () => void;
};

export default function AppHeader({
    user,
    logout,
    deactivateAccount,
    activateAccount,
}: UserMenuProps) {
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
                    <Button className={headerButtonClass} aria-label="Open Sidebar">
                        <Menu size={15} />
                    </Button>
                    <Button className={`${headerButtonClass} uppercase`} aria-label="Change Language">
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
                    <div className="h-6 sm:h-8 w-[0.5px] bg-neutral-300 dark:bg-neutral-700 m-0" />

                    {user ? (
                        <UserMenu
                            user={user}
                            logout={async () => {
                                await logout();
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
                        <LoginDialog
                            user={user}
                            className={menuItemClass}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}
