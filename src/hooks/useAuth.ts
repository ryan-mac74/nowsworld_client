import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useCustomToast from "@/hooks/useCustomToast";

export type UserPublic = {
  id: number;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
};

export type UserRegister = {
  email: string;
  username: string;
  name: string;
};

export default function useAuth() {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const VITE_API_URL = import.meta.env.VITE_API_URL || '';

  const fetchUser = useCallback(async () => {
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
    fetchUser();
  }, [fetchUser]);

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
      navigate("/");

      if (toast) {
        showSuccessToast("You have been logged out");
      }
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

      setUser((prev) => prev ? { ...prev, is_active: false } : null);
      logout(false);

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

      setUser((prev) => prev ? { ...prev, is_active: true } : null);
      navigate("/");

      showSuccessToast("Your account has been reactivated");
    } catch (error: unknown) {
      console.error(error);
      showErrorToast("Something went wrong");
    }
  };

  return {
    user,
    isLoading,
    logout,
    refetchUser: fetchUser,
    deactivateAccount,
    activateAccount,
  };
}
