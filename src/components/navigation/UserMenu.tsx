import { useNavigate } from "react-router-dom";
import LoginDialog from "@/components/dialogs/LoginDialog";
import LogoutDialog from "@/components/dialogs/LogoutDialog";
import ActivationDialog from "@/components/dialogs/ActivationDialog";
import getInitials from "@/utils/getInitials";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/Dropdown-menu";
import Button from "@/components/ui/Button";
import MenuIcon from "@/components/ui/MenuIcon";
import type { UserPublic } from "@/hooks/useAuth";
import { User, Settings } from "lucide-react";

const menuItems = [
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: Settings },
];

export type MenuItem = {
    label: string;
    path: string;
    icon: React.ElementType;
    variant?: "default" | "destructive" | "success" | "info";
};

type UserMenuProps = {
    user: UserPublic;
    logout: () => void;
    deactivateAccount: () => void;
    activateAccount: () => void;
    className?: string;
};

export default function UserMenu({
    user,
    logout,
    deactivateAccount,
    activateAccount,
    className,
}: UserMenuProps) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    className="
                        w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center font-bold rounded-full 
                        bg-neutral-900 dark:bg-white text-neutral-100 dark:text-neutral-900 
                        text-base shrink-0 p-0.5
                    "
                >
                    {user && (
                        user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={getInitials(user.name)}
                                className="w-full h-full rounded-full object-cover text-base"
                            />
                        ) : (
                            <span className="text-base">{getInitials(user.name)}</span>
                        )
                    )}
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="
                    bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700
                    flex gap-1 flex-col
                "
            >
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <DropdownMenuItem key={item.path} asChild>
                            <Button
                                className={className}
                                onClick={() => navigate(item.path)}
                            >
                                <MenuIcon Icon={Icon} />
                                {item.label}
                            </Button>
                        </DropdownMenuItem>
                    );
                })}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="info"
                    asChild
                >
                    <LoginDialog
                        user={user}
                        className={className}
                    />
                </DropdownMenuItem>

                <DropdownMenuItem
                    variant="warning"
                    asChild
                >
                    <LogoutDialog
                        className={className}
                        onLogout={async () => {
                            await logout();
                        }}
                    />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant={user.is_active ? "destructive" : "success"}
                    asChild
                >
                    <ActivationDialog
                        className={className}
                        isActive={user.is_active}
                        onDeactivate={async () => {
                            await deactivateAccount();
                        }}
                        onActivate={async () => {
                            await activateAccount();
                        }}
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
