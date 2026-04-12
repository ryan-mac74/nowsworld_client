import { useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, Mail, Phone } from "lucide-react";
import useCustomToast from "@/hooks/useCustomToast";
import Button from "@/components/ui/Button";

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
    isOverlay?: boolean;
};

export default function Sidebar({ isOpen = false, onClose, isOverlay = false }: SidebarProps) {
    const VITE_PROJECT_NAME =
        import.meta.env.VITE_PROJECT_NAME ||
        "NowSWorld";

    /* TODO
    
    const VITE_GITHUB_URL = import.meta.env.VITE_GITHUB_URL;
    const VITE_LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL;

    */

    const VITE_WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL;
    const VITE_CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;

    const VITE_API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:3000/api";

    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const { showSuccessToast, showErrorToast } = useCustomToast();

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!feedbackMessage.trim()) {
            return;
        }

        setIsSubmittingFeedback(true);

        try {
            const res = await fetch(`${VITE_API_URL}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: feedbackMessage }),
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
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

    const width = Math.round(window.screen.width * 0.8);
    const height = Math.round(window.screen.height * 0.8);
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);

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
                <div className="mb-8">
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
                    </form>
                </div>

                {/* Footer Section */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-4">
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
                                text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition
                            "
                        >
                            <Phone size={18} />
                        </a>
                        <a
                            href={`mailto:${VITE_CONTACT_EMAIL}`}
                            className="
                                text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 transition truncate
                            "
                        >
                            {VITE_CONTACT_EMAIL}
                        </a>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <a
                                onClick={(e) => {
                                    e.preventDefault();

                                    window.open(
                                        "/terms-of-service",
                                        "popup",
                                        `toolbar=no,scrollbars=yes,resizable=yes,top=${top},left=${left},width=${width},height=${height}`
                                    );
                                }}
                                className="
                                    hover:text-neutral-900 dark:hover:text-neutral-200 transition
                                    hover:underline break-all cursor-pointer
                                "
                            >
                                Terms of Service
                            </a>
                            <a
                                onClick={(e) => {
                                    e.preventDefault();

                                    window.open(
                                        "/privacy-policy",
                                        "popup",
                                        `toolbar=no,scrollbars=yes,resizable=yes,top=${top},left=${left},width=${width},height=${height}`
                                    );
                                }}
                                className="
                                    hover:text-neutral-900 dark:hover:text-neutral-200 transition
                                    hover:underline break-all cursor-pointer
                                "
                            >
                                Privacy Policy
                            </a>
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
