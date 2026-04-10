import { Outlet } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import Navbar from "@/components/navigation/Navbar";
import useAuth from "@/hooks/useAuth";

export default function MainLayout() {
    const { user, logout, deleteAllAccounts, deleteAccount, deactivateAccount, activateAccount } = useAuth();

    return (
        <div className="min-h-screen flex flex-col items-center pb-14 bg-white dark:bg-neutral-900">
            <AppHeader
                user={user}
                logout={async () => await logout()}
                deleteAllAccounts={async () => {
                    await deleteAllAccounts();
                }}
                deleteAccount={async () => {
                    await deleteAccount();
                    window.dispatchEvent(new Event("refetch-feed"));
                }}
                deactivateAccount={async () => {
                    await deactivateAccount();
                    window.dispatchEvent(new Event("refetch-feed"));
                }}
                activateAccount={async () => {
                    await activateAccount();
                    window.dispatchEvent(new Event("refetch-feed"));
                }}
            />
            <Outlet />
            <Navbar />
        </div>
    );
}
