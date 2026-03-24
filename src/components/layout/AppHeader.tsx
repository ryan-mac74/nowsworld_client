import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LoginDialog from "@/components/dialogs/LoginDialog";
import UserMenu from "@/components/navigation/UserMenu";
import type { UserPublic } from "@/hooks/useAuth";
import { Menu, Globe } from "lucide-react";

const VITE_PROJECT_NAME =
    import.meta.env.VITE_PROJECT_NAME ||
    "NowSWorld";

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
            <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
                {/* Left Section: Sidebar, Language */}
                <div className="flex items-center gap-2 flex-1">
                    <Button className={headerButtonClass} aria-label="Open Sidebar">
                        <Menu size={15} />
                    </Button>
                    <Button className={`${headerButtonClass} uppercase`} aria-label="Change Language">
                        <Globe size={15} className="mr-0.5" />
                        EN
                    </Button>
                </div>

                {/* Center Section: Logo, Name */}
                <div className="flex items-center gap-2 shrink-0">
                    <img src="/logo.png" alt="NSW" className="w-8 h-8 invert dark:invert-0" />
                    <span className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {VITE_PROJECT_NAME}
                    </span>
                </div>

                {/* Right Section: Theme, Profile */}
                <div className="flex items-center justify-end gap-2 flex-1">
                    <ThemeToggle className={headerButtonClass} />
                    <div className="h-8 w-[1px] bg-neutral-300 dark:bg-neutral-700 mx-1" />

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
