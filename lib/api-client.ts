const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  error?: string;
  [key: string]: any;
  data?: T;
};

export type AuthResponse = {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  message?: string;
};

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

const clearAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

export const apiClient = {
  async post<T = any>(endpoint: string, body: any, requiresAuth = false): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requiresAuth) {
      const token = getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return response.json();
  },

  async get<T = any>(endpoint: string, requiresAuth = false): Promise<T> {
    const headers: HeadersInit = {};

    if (requiresAuth) {
      const token = getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return response.json();
  },

  setAuthToken,
  getAuthToken,
  clearAuthToken,
};
