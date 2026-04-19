import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, Mail, Phone, Megaphone, Bell } from "lucide-react";
import { urlBase64ToUint8Array } from "@/utils/base64";
import useCustomToast from "@/hooks/useCustomToast";
import useAuth from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import PopupLink from "@/components/ui/PopupLink";
import CustomDialog from "@/components/dialogs/CustomDialog";

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
    isOverlay?: boolean;
};

export default function Sidebar({ isOpen = false, onClose, isOverlay = false }: SidebarProps) {
    const VITE_PROJECT_NAME = import.meta.env.VITE_PROJECT_NAME || "NowSWorld";

    /* TODO
    
    const VITE_GITHUB_URL = import.meta.env.VITE_GITHUB_URL;
    const VITE_LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL;

    */

    const VITE_WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL;
    const VITE_CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;

    const VITE_API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:3000/api";

    const VITE_VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY!;

    const { user } = useAuth();
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [updateContent, setUpdateContent] = useState("");
    const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
    const { showSuccessToast, showErrorToast } = useCustomToast();
    const [isInstallDialogOpen, setIsInstallDialogOpen] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        // Check if push notifications are supported and user is already subscribed
        if ("serviceWorker" in navigator && "PushManager" in window) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then((sub) => {
                    setIsSubscribed(!!sub);
                });
            });
        }
    }, []);

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!updateContent.trim()) {
            return;
        }

        setIsSubmittingUpdate(true);

        try {
            const res = await fetch(`${VITE_API_URL}/updates/publish`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Send update content & Flag backend to send push notifications to all devices
                body: JSON.stringify({ content: updateContent, notifyAll: true }),
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`❌ HTTP ${res.status}`);
            }

            setUpdateContent("");
            showSuccessToast("Update published & Notifications sent");
        } catch (error) {
            console.error("❌ Failed to publish update:", error);
            showErrorToast("Failed to publish update -- Please try again");
        } finally {
            setIsSubmittingUpdate(false);
        }
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!feedbackMessage.trim()) {
            return;
        }

        setIsSubmittingFeedback(true);

        try {
            const res = await fetch(`${VITE_API_URL}/feedback/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: feedbackMessage }),
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`❌ HTTP ${res.status}`);
            }

            setFeedbackMessage("");
            showSuccessToast("Feedback sent successfully");
        } catch (error) {
            console.error("❌ Failed to send feedback:", error);
            showErrorToast("Failed to send feedback -- Please try again");
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const handleEnablePush = async () => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
            showErrorToast("Push Notifications are not supported by your browser");
            return;
        }

        try {
            if (Notification.permission === "denied") {
                showErrorToast("Notifications are denied -- Please enable now for real-time updates");
                return;
            }

            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                showErrorToast("Notification permission was not granted");
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VITE_VAPID_PUBLIC_KEY),
            });

            // Send subscription object to the backend for later use when sending Push Notifications
            await fetch(`${VITE_API_URL}/notifications/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subscription),
                credentials: "include",
            });

            setIsSubscribed(true);
            showSuccessToast("Successfully subscribed to Push Notifications for real-time updates");
        } catch (error) {
            console.error("❌ Failed to subscribe to Push Notifications:", error);
            showErrorToast("Failed to enable Push Notifications");
        }
    };

    const handleDisablePush = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                // Inform the backend to delete this subscription from the DB
                await fetch(`${VITE_API_URL}/notifications/unsubscribe`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                    credentials: "include",
                });

                await subscription.unsubscribe();

                setIsSubscribed(false);
                showSuccessToast("Successfully unsubscribed from Push Notifications for real-time updates");
            }
        } catch (error) {
            console.error("❌ Failed to unsubscribe from Push Notifications:", error);
            showErrorToast("Failed to disable Push Notifications for real-time updates");
        }
    };

    const baseClasses = "w-3/4 max-w-lg h-screen flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 overflow-y-auto";
    const overlayClasses = `fixed top-0 left-0 z-50 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`;
    const desktopClasses = "hidden md:flex sticky top-0";

    const content = (
        <>
            {/* Overlay Background */}
            {isOverlay && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside
                id="app-sidebar"
                className={`${baseClasses} ${isOverlay ? overlayClasses : desktopClasses}`}
                style={{ touchAction: "pan-y" }}
            >
                {/* TODO
                
                <nav className="flex flex-col gap-1 mb-8">
                    <Link to="/profile" className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition">
                        <User size={20} />
                        <span className="font-medium">Profile</span>
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition">
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>

                */}

                {/* Push Notifications Sub */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-2">
                        <Bell size={16} />
                        App Features
                    </h3>

                    <>
                        <Button
                            onClick={() => setIsInstallDialogOpen(true)}
                            className="
                                w-full text-sm font-medium rounded-md shadow-sm transition-colors 
                                text-white bg-orange-400 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-400
                            "
                        >
                            Install this App on your Device
                        </Button>

                        <CustomDialog isOpen={isInstallDialogOpen} onClose={() => setIsInstallDialogOpen(false)}>
                            <img
                                src="/PWA.png" alt="PWA Installation Guide"
                                className="block m-auto max-w-full h-auto rounded-lg shadow-lg"
                            />
                        </CustomDialog>
                    </>

                    {isSubscribed ? (
                        <Button
                            onClick={handleDisablePush}
                            className="
                                w-full mt-4 text-sm font-medium rounded-md shadow-sm transition-colors 
                                text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600
                            "
                        >
                            Disable Push Notifications
                        </Button>
                    ) : (
                        <Button
                            onClick={handleEnablePush}
                            className="
                                w-full mt-4 text-sm font-medium rounded-md shadow-sm transition-colors 
                                text-white bg-neutral-800 hover:bg-neutral-900 dark:bg-neutral-700 dark:hover:bg-neutral-600
                            "
                        >
                            Enable Push Notifications
                        </Button>
                    )}
                </div>

                {/* Update Announcement */}
                {user?.is_superuser && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-2">
                            <Megaphone size={16} />
                            New Update
                        </h3>
                        <form className="flex flex-col gap-2" onSubmit={handleUpdateSubmit}>
                            <textarea
                                value={updateContent}
                                onChange={(e) => setUpdateContent(e.target.value)}
                                disabled={isSubmittingUpdate}
                                placeholder="Write about the latest updates & Notify all users..."
                                className="
                                    w-full text-base md:text-sm p-2 rounded-md border 
                                    border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 
                                    text-neutral-900 dark:text-neutral-100 resize-none outline-none 
                                    focus:ring-2 focus:ring-green-500 transition-shadow disabled:opacity-50
                                "
                                rows={4}
                            />

                            <Button
                                disabled={isSubmittingUpdate || !updateContent.trim()} type="submit"
                                className="
                                    w-full mt-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 
                                    rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                "
                            >
                                {isSubmittingUpdate ? "Publishing..." : "Publish & Notify"}
                            </Button>
                        </form>
                    </div>
                )}

                {/* Feedback Message */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-2">
                        <MessageSquare size={16} />
                        Feedback
                    </h3>

                    <form className="flex flex-col gap-2" onSubmit={handleFeedbackSubmit}>
                        <textarea
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            disabled={isSubmittingFeedback}
                            placeholder="Say what's on your mind..."
                            className="
                                w-full text-base md:text-sm p-2 rounded-md border 
                                border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 
                                text-neutral-900 dark:text-neutral-100 resize-none outline-none 
                                focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50
                            "
                            rows={4}
                        />

                        <Button
                            disabled={isSubmittingFeedback || !feedbackMessage.trim()} type="submit"
                            className="
                                w-full mt-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                                rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            {isSubmittingFeedback ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </div>

                {/* Newsletter Subscription */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-2">
                        <Mail size={16} />
                        Newsletter
                    </h3>

                    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                        <input
                            disabled
                            type="email"
                            placeholder="Your email address"
                            className="
                                w-full text-base md:text-sm p-2 rounded-md border border-neutral-200 dark:border-neutral-700 
                                bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 
                                outline-none focus:ring-2 focus:ring-blue-500 transition-shadow
                            "
                        />

                        <Button
                            disabled
                            type="submit"
                            className="
                                w-full mt-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                                rounded-md shadow-sm transition-colors
                            "
                        >
                            Subscribe
                        </Button>

                        {/* TODO: Unsubscribe Button */}
                    </form>
                </div>

                {/* Footer Section */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-4">
                    {/* Contact Info */}
                    <div className="flex items-center justify-center gap-4">
                        {/* TODO
                        
                        <a href={VITE_GITHUB_URL} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
                            <Github size={18} />
                        </a>
                        <a href={VITE_LINKEDIN_URL} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
                            <Linkedin size={18} />
                        </a>
                        
                        */}

                        <a
                            href={VITE_WHATSAPP_URL}
                            target="_blank" rel="noreferrer"
                            className="
                                text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition
                            "
                        >
                            <Phone size={18} />
                        </a>

                        <a
                            href={`mailto:${VITE_CONTACT_EMAIL}`}
                            className="
                                text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition truncate text-sm
                            "
                        >
                            {VITE_CONTACT_EMAIL}
                        </a>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <PopupLink href="/terms-of-service">
                                Terms of Service
                            </PopupLink>
                            <PopupLink href="/privacy-policy">
                                Privacy Policy
                            </PopupLink>
                            <PopupLink href="/data-deletion">
                                Data Deletion
                            </PopupLink>
                        </div>

                        {/* Copyright */}
                        <p className="text-xs text-center text-neutral-400 dark:text-neutral-500">
                            &copy; {new Date().getFullYear()} {VITE_PROJECT_NAME}.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );

    if (isOverlay && typeof document !== "undefined") {
        return createPortal(content, document.body);
    }

    return content;
}
