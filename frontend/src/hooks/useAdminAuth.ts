import { useCallback, useEffect, useState } from "react";

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAdminAuthReturn extends AdminAuthState {
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/me", {
        credentials: "include",
      });

      setState((prev) => ({
        ...prev,
        isAuthenticated: response.ok,
        isLoading: false,
        error: null,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }));
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
          error: data.message ?? "Invalid password",
        }));
        return false;
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        error: "Login failed. Please try again.",
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    checkAuth,
  };
}
