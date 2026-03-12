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

        if (auth === "error") {
            showErrorToast("Authentication failed");
        }

        setSearchParams({});
    }, [searchParams, setSearchParams, showSuccessToast, showErrorToast]);

    return null;
}
