import { AppOverlay } from "nowsspace";
import { Outlet } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import Navbar from "@/components/navigation/Navbar";
import useAuth from "@/hooks/useAuth";

const SDK_URL =
    import.meta.env.VITE_SDK_URL ||
    "http://localhost:8000/api";

const WS_URL =
    import.meta.env.VITE_WS_URL ||
    "ws://localhost:8000/ws";

export default function MainLayout() {
    const { user, isLoading: isAuthLoading, logout, deleteAllAccounts, deleteAccount, deactivateAccount, activateAccount } = useAuth();

    return (
        <div className="min-h-screen flex flex-col items-center pb-14 bg-white dark:bg-neutral-900">
            <AppOverlay SDK_URL={SDK_URL} WS_URL={WS_URL} user={user} />
            <AppHeader
                user={user}
                isAuthLoading={isAuthLoading}
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
