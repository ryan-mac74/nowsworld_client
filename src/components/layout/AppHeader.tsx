import ThemeToggle from "@/components/ui/ThemeToggle";
import LoginDialog from "@/components/dialogs/LoginDialog";
import UserMenu from "@/components/navigation/UserMenu";
import type { UserPublic } from "@/hooks/useAuth";

const VITE_PROJECT_NAME =
    import.meta.env.VITE_PROJECT_NAME ||
    "NowSWorld";

const menuItemClass = `
    w-full h-8 flex items-center justify-center
    bg-neutral-100 dark:bg-neutral-800
    hover:bg-neutral-200 dark:hover:bg-neutral-700
    gap-2 cursor-pointer
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
        <div
            className="
                w-full max-w-2xl
                sticky top-0 z-10
                bg-white dark:bg-neutral-900
                border-b border-neutral-200 dark:border-neutral-800
            "
        >
            <div className="max-w-2xl mx-auto flex items-center justify-between py-2">
                <ThemeToggle />

                <div className="flex items-center gap-2">
                    {/* App Logo */}
                    <img src="/logo.png" alt="NSW" className="w-8 h-8 invert dark:invert-0" />

                    {/* App Name */}
                    <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {VITE_PROJECT_NAME}
                    </span>
                </div>

                {user ? (
                    <UserMenu
                        user={user}
                        logout={() => logout()}
                        deactivateAccount={() => deactivateAccount()}
                        activateAccount={() => activateAccount()}
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
    );
}
