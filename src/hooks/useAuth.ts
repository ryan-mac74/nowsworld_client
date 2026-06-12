// source: https://github.com/fastapi/full-stack-fastapi-template/blob/master/frontend/src/hooks/useAuth.ts

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useCustomToast from "@/hooks/useCustomToast";
import type { UserPublic } from "@/types/user";

export default function useAuth() {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const VITE_API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api";

  const fetchMe = useCallback(async () => {
    if (!isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch(`${VITE_API_URL}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user ?? null);
    } catch (error: unknown) {
      console.error(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [VITE_API_URL]);

  useEffect(() => {
    fetchMe();

    // Sync logout across all components using this hook
    const handleLogout = () => setUser(null);
    window.addEventListener("auth-logout", handleLogout);

    // Clean up event listener on unmount
    return () => window.removeEventListener("auth-logout", handleLogout);
  }, [fetchMe]);

  const logout = async (toast: boolean = true) => {
    try {
      const res = await fetch(`${VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to log out");
      }

      setUser(null);

      // Notify all instances of this hook to update their state
      window.dispatchEvent(new Event("auth-logout"));

      navigate("/");

      if (toast) {
        showSuccessToast("You have been logged out");
      }
    } catch (error: unknown) {
      console.error(error);
      showErrorToast("Something went wrong");
    }
  };

  const deleteAllAccounts = async () => {
    if (!user || !user.is_superuser) {
      return;
    }

    try {
      const res = await fetch(`${VITE_API_URL}/auth/delete-all`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to process all scheduled account deletions");
      }

      showSuccessToast("All scheduled account deletions have been processed");
    } catch (error: unknown) {
      console.error(error);
      showErrorToast("Something went wrong");
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      return;
    }

    try {
      const res = await fetch(`${VITE_API_URL}/auth/delete`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to schedule account deletion");
      }

      setUser((prev) => prev ? {
        ...prev,
        is_active: false,
        deletedAt: new Date().toISOString()
      } : null);
      navigate("/");

      showSuccessToast("Your account has been scheduled for deletion");
    } catch (error: unknown) {
      console.error(error);
      showErrorToast("Something went wrong");
    }
  };

  const deactivateAccount = async () => {
    if (!user) {
      return;
    }

    try {
      const res = await fetch(`${VITE_API_URL}/auth/deactivate`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to deactivate account");
      }

      setUser((prev) => prev ? {
        ...prev,
        is_active: false,
      } : null);
      navigate("/");

      showSuccessToast("Your account has been deactivated");
    } catch (error: unknown) {
      console.error(error);
      showErrorToast("Something went wrong");
    }
  };

  const activateAccount = async () => {
    if (!user) {
      return;
    }

    try {
      const res = await fetch(`${VITE_API_URL}/auth/activate`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to reactivate account");
      }

      setUser((prev) => prev ? {
        ...prev,
        is_active: true,
        deletedAt: undefined,
      } : null);
      navigate("/");

      showSuccessToast("Your account has been reactivated");
    } catch (error: unknown) {
      console.error(error);
      showErrorToast("Something went wrong");
    }
  };

  const oauthConsent = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      const res = await fetch(`${VITE_API_URL}/auth/consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        throw new Error("❌ Failed to create account");
      }

      window.location.href = "/?auth=signup-success";
    } catch (error: unknown) {
      console.error(error);
      showErrorToast("Something went wrong");
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    refetchMe: fetchMe,
    deleteAllAccounts,
    deleteAccount,
    deactivateAccount,
    activateAccount,
    oauthConsent,
  };
}
