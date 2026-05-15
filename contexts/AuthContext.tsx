"use client";

import { createContext, useContext, useReducer, useCallback, useEffect, useState, ReactNode } from "react";
import { apiClient } from "@/lib/api-client";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role?: "user" | "organizer" | "admin";
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: AuthUser }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    default:
      return state;
  }
}

type AuthContextType = AuthState & {
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
  login: (data: { email: string; password: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  getProfile: () => Promise<{ success: boolean; data?: any; error?: string }>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore auth state on mount if token exists
  useEffect(() => {
    const restoreAuth = async () => {
      const token = apiClient.getAuthToken();
      if (token) {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
          const response = await apiClient.get<any>(
            "/auth/me",
            true,
          );
          // Handle different response formats
          const user = response?.user || response;
          if (user && user.id) {
            dispatch({ type: "SET_USER", payload: user });
          } else {
            // Token invalid, clear it
            apiClient.clearAuthToken();
            dispatch({ type: "LOGOUT" });
          }
        } catch (error) {
          // Token invalid or expired, clear it
          apiClient.clearAuthToken();
          dispatch({ type: "LOGOUT" });
        }
      }
    };

    restoreAuth();
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await apiClient.post<any>(
          "/auth/register",
          data,
        );
        
        // Handle different response formats
        const user = response?.user || response?.data?.user;
        const token = response?.token || response?.data?.token;
        
        if (user && token) {
          apiClient.setAuthToken(token);
          dispatch({ type: "SET_USER", payload: user });
          return { success: true, data: response };
        }
        throw new Error("Registration failed: no user or token in response");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Registration failed";
        dispatch({ type: "SET_ERROR", payload: message });
        return { success: false, error: message };
      }
    },
    [],
  );

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await apiClient.post<any>(
          "/auth/login",
          data,
        );
        
        // Handle different response formats
        const user = response?.user || response?.data?.user;
        const token = response?.token || response?.data?.token;
        
        if (user && token) {
          apiClient.setAuthToken(token);
          dispatch({ type: "SET_USER", payload: user });
          return { success: true, data: response };
        }
        throw new Error("Login failed: no user or token in response");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        dispatch({ type: "SET_ERROR", payload: message });
        return { success: false, error: message };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Try to call logout endpoint but don't fail if it errors
      try {
        await apiClient.post("/auth/logout", {}, true);
      } catch (apiError) {
        // Continue with local logout even if API call fails
      }
      
      apiClient.clearAuthToken();
      dispatch({ type: "LOGOUT" });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, error: message };
    }
  }, []);

  const getProfile = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiClient.get<any>(
        "/auth/me",
        true,
      );
      // Handle different response formats
      const user = response?.user || response;
      if (user && user.id) {
        dispatch({ type: "SET_USER", payload: user });
        return { success: true, data: response };
      }
      throw new Error("Failed to fetch profile");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch profile";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, error: message };
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value: AuthContextType = {
    ...state,
    register,
    login,
    logout,
    getProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
