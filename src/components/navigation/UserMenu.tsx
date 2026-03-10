import { useNavigate } from "react-router-dom";
import LoginDialog from "@/components/dialogs/LoginDialog";
import LogoutDialog from "@/components/dialogs/LogoutDialog";
import getInitials from "@/utils/getInitials";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/Dropdown-menu";
import Button from "@/components/ui/Button";
import MenuIcon from "@/components/ui/MenuIcon";
import type { UserPublic } from "@/hooks/useAuth";
import { FiUser, FiSettings } from "react-icons/fi";

const menuItems = [
    { label: "Profile", path: "/profile", icon: FiUser },
    { label: "Settings", path: "/settings", icon: FiSettings },
];

export type MenuItem = {
    label: string;
    path: string;
    icon: React.ElementType;
};

export type UserMenuProps = {
    user: UserPublic;
    logout: () => void;
    className?: string;
};

export default function UserMenu({
    user,
    logout,
    className,
}: UserMenuProps) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    className="
                        w-10 h-10 flex items-center justify-center font-bold rounded-full 
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

                <DropdownMenuItem asChild>
                    <LoginDialog
                        user={user}
                        className={className}
                    />
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <LogoutDialog
                        className={className}
                        onLogout={() => logout()}
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
