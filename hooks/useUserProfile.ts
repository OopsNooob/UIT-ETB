"use client";

import { useCallback, useReducer } from "react";
import { apiClient, ApiResponse } from "@/lib/api-client";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "user" | "organizer" | "admin";
  is_active: boolean;
  created_at?: string; // ISO format
  updated_at?: string; // ISO format
  deleted_at?: string | null; // ISO format
}

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

type UserProfileAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PROFILE"; payload: UserProfile }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "CLEAR_PROFILE" };

const initialState: UserProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

function userProfileReducer(
  state: UserProfileState,
  action: UserProfileAction
): UserProfileState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "CLEAR_PROFILE":
      return { ...state, profile: null };
    default:
      return state;
  }
}

export const useUserProfile = () => {
  const [state, dispatch] = useReducer(userProfileReducer, initialState);

  const getProfile = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiClient.get<any>(
        "/auth/me",
        true
      );
      
      let profileData: UserProfile | null = null;
      if (response.success) {
        // Backend returns { user: {...} } structure
        if (response.user) {
          profileData = response.user as UserProfile;
        } else if (response.data && !Array.isArray(response.data)) {
          profileData = response.data as UserProfile;
        } else if (response.data && (response.data as any).user) {
          profileData = (response.data as any).user as UserProfile;
        }
      }

      if (profileData) {
        dispatch({ type: "SET_PROFILE", payload: profileData });
        return { success: true, data: profileData };
      }
      
      throw new Error("Failed to fetch user profile");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch user profile";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, error: message };
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const clearProfile = useCallback(() => {
    dispatch({ type: "CLEAR_PROFILE" });
  }, []);

  return {
    ...state,
    getProfile,
    clearError,
    clearProfile,
  };
};
