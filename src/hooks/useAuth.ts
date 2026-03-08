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

  const logout = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("❌ Logout failed");
      }

      setUser(null);
      navigate("/");
      showSuccessToast("You have been logged out");
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
  };
}
