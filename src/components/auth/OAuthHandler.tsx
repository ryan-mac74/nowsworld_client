import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCustomToast from "@/hooks/useCustomToast";
import ConsentDialog from "@/components/dialogs/ConsentDialog";
import useAuth from "@/hooks/useAuth";

export default function OAuthHandler() {
    const [searchParams, setSearchParams] = useSearchParams();
    const auth = searchParams.get("auth");

    const [isLoading, setIsLoading] = useState(false);
    const [isConsentOpen, setIsConsentOpen] = useState(
        auth === "consent"
    );

    const { showSuccessToast, showErrorToast } = useCustomToast();
    const { oauthConsent } = useAuth();

    const handled = useRef(false);
    const token = searchParams.get("token");

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);

            // Clean up URL without reloading the page
            window.history.replaceState({}, document.title, "/");
        }
    }, [searchParams]);

    useEffect(() => {
        // Prevent handling multiple times
        // if component re-renders with the same query params
        if (handled.current) {
            return;
        }

        // No auth query param => do nothing
        if (!auth) {
            return;
        }

        handled.current = true;

        if (auth === "error") {
            showErrorToast("Authentication failed");
        }

        if (auth === "signup-success") {
            showSuccessToast("Your account has been created");
        }

        if (auth === "login-success") {
            showSuccessToast("You are successfully logged in");
        }

        if (auth === "link-success") {
            showSuccessToast("Your accounts are now linked");
        }

        if (auth === "link-error") {
            showErrorToast("Account already linked to another user");
        }

        if (auth === "provider-success") {
            showSuccessToast("Your account is already linked to this user");
        }

        if (auth === "provider-error") {
            showErrorToast("You can't link accounts from the same provider");
        }

        // Remove query params after reading
        setSearchParams(new URLSearchParams());
    }, [searchParams, setSearchParams, showSuccessToast, showErrorToast]);

    const handleOAuthConsent = async () => {
        setIsLoading(true);

        try {
            await oauthConsent(token);
            setIsConsentOpen(false);
        } catch (error) {
            console.error("❌ Failed to create account:", error);
            setIsConsentOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (isConsentOpen) {
        return (
            <ConsentDialog
                isLoading={isLoading}
                isOpen={isConsentOpen}
                setOpen={setIsConsentOpen}
                onConfirm={handleOAuthConsent}
            />
        );
    }

    return null;
}
