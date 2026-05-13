"use client";

import { useCallback, useReducer, useState } from "react";
import { apiClient, AuthResponse } from "@/lib/api-client";

type AuthUser = {
  id: string;
  email: string;
  name: string;
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
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
}

export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await apiClient.post<AuthResponse>(
          "/auth/register",
          data,
        );
        if (response.success && response.user) {
          dispatch({ type: "SET_USER", payload: response.user });
          return { success: true, data: response };
        }
        throw new Error("Registration failed");
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
        const response = await apiClient.post<AuthResponse>(
          "/auth/login",
          data,
        );
        if (response.success && response.user && response.token) {
          apiClient.setAuthToken(response.token);
          dispatch({ type: "SET_USER", payload: response.user });
          return { success: true, data: response };
        }
        throw new Error("Login failed");
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
      await apiClient.post("/auth/logout", {}, true);
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
      const response = await apiClient.get<{ user: AuthUser }>(
        "/auth/me",
        true,
      );
      if (response.success && response.user) {
        dispatch({ type: "SET_USER", payload: response.user });
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

  return {
    ...state,
    register,
    login,
    logout,
    getProfile,
    clearError,
  };
};
