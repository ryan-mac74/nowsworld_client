import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCustomToast from "@/hooks/useCustomToast";
import ConsentDialog from "@/components/dialogs/ConsentDialog";
import { setToken } from "@/utils/token";
import useAuth from "@/hooks/useAuth";

export default function OAuthHandler() {
    const [searchParams, setSearchParams] = useSearchParams();
    const auth = searchParams.get("auth");
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [isConsentOpen, setIsConsentOpen] = useState(false);
    const [pendingConsentToken, setPendingConsentToken] = useState<string | null>(null);

    const { showSuccessToast, showErrorToast } = useCustomToast();
    const { oauthConsent } = useAuth();

    const handled = useRef(false);

    useEffect(() => {
        // Prevent handling multiple times across re-renders
        if (handled.current || !auth) {
            return;
        }

        handled.current = true;

        if (auth === "consent") {
            if (token) {
                // Save temporary token in state before clearing searchParams
                setPendingConsentToken(token);
                setIsConsentOpen(true);
            } else {
                showErrorToast("Invalid/Missing consent token");
            }
        } else {
            if (token) {
                // Save session token if available
                setToken(token);
            }
        }

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

        // Clean up query params from URL without reloading the page
        setSearchParams(new URLSearchParams(), { replace: true });
    }, [auth, token, setSearchParams, showSuccessToast, showErrorToast]);

    const handleOAuthConsent = async () => {
        if (!pendingConsentToken) {
            showErrorToast("Missing consent token");
            return;
        }

        setIsLoading(true);

        try {
            await oauthConsent(pendingConsentToken);
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
