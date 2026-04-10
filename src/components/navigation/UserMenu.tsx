import { useNavigate } from "react-router-dom";
import LoginDialog from "@/components/dialogs/LoginDialog";
import LogoutDialog from "@/components/dialogs/LogoutDialog";
import ActivationDialog from "@/components/dialogs/ActivationDialog";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/navigation/DropdownMenu";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import MenuIcon from "@/components/ui/MenuIcon";
import type { UserPublic } from "@/hooks/useAuth";
import { User, Settings, Clock } from "lucide-react";

const menuItems = [
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: Settings },
];

export type MenuItem = {
    label: string;
    path: string;
    icon: React.ElementType;
    variant?: "default" | "destructive" | "success" | "info" | "warning" | "accent" | "danger";
};

type UserMenuProps = {
    user: UserPublic;
    logout: () => void;
    deleteAllAccounts: () => void;
    deleteAccount: () => void;
    deactivateAccount: () => void;
    activateAccount: () => void;
    className?: string;
};

export default function UserMenu({
    user,
    logout,
    deleteAllAccounts,
    deleteAccount,
    deactivateAccount,
    activateAccount,
    className,
}: UserMenuProps) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar name={user.name} avatar={user.avatar} />
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

                <DropdownMenuItem variant="info" asChild>
                    <LoginDialog
                        user={user}
                        className={className}
                    />
                </DropdownMenuItem>

                <DropdownMenuItem variant="warning" asChild>
                    <LogoutDialog
                        className={className}
                        onLogout={async () => {
                            await logout();
                        }}
                    />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {user.is_active ? (
                    <>
                        <DropdownMenuItem variant="accent" asChild>
                            <ActivationDialog
                                className={className}
                                action="deactivate"
                                onConfirm={async () => {
                                    await deactivateAccount();
                                }}
                            />
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" asChild>
                            <ActivationDialog
                                className={className}
                                action="delete"
                                onConfirm={async () => {
                                    await deleteAccount();
                                }}
                            />
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem variant="success" asChild>
                        <ActivationDialog
                            className={className}
                            action="activate"
                            deletedAt={user.deletedAt}
                            onConfirm={async () => {
                                await activateAccount();
                            }}
                        />
                    </DropdownMenuItem>
                )}

                {user.is_superuser && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="danger" asChild>
                            <Button
                                className={className}
                                onClick={async () => {
                                    await deleteAllAccounts();
                                }}
                            >
                                <MenuIcon Icon={Clock} />
                                Delete All Accounts
                            </Button>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
