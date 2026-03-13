import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import useCustomToast from "@/hooks/useCustomToast";

export default function OAuthHandler() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { showSuccessToast, showErrorToast } = useCustomToast();
    const handled = useRef(false);

    useEffect(() => {
        if (handled.current) {
            return;
        }

        const auth = searchParams.get("auth");
        if (!auth) {
            return;
        }

        handled.current = true;

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

        if (auth === "error") {
            showErrorToast("Authentication failed");
        }

        // Remove query params after reading
        setSearchParams(new URLSearchParams());
    }, [searchParams, setSearchParams, showSuccessToast, showErrorToast]);

    return null;
}
