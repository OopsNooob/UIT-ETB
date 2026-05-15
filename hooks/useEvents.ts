"use client";

import { useCallback, useReducer } from "react";
import { apiClient, ApiResponse } from "@/lib/api-client";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  price?: number;
  total_capacity: number;
  remaining_capacity?: number;
  organizer_id: string;
  banner_url?: string;
  status?: "draft" | "published" | "cancelled" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  total_capacity: number;
  banner_url?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
  status?: "draft" | "published" | "cancelled" | "completed";
}

interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
}

type EventsAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_EVENTS"; payload: Event[] }
  | { type: "SET_CURRENT_EVENT"; payload: Event | null }
  | { type: "ADD_EVENT"; payload: Event }
  | { type: "UPDATE_EVENT"; payload: Event }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,
};

function eventsReducer(state: EventsState, action: EventsAction): EventsState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_EVENTS":
      return { ...state, events: action.payload, isLoading: false, error: null };
    case "SET_CURRENT_EVENT":
      return { ...state, currentEvent: action.payload, isLoading: false };
    case "ADD_EVENT":
      return {
        ...state,
        events: [...state.events, action.payload],
        isLoading: false,
      };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
        currentEvent:
          state.currentEvent?.id === action.payload.id
            ? action.payload
            : state.currentEvent,
        isLoading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export const useEvents = () => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const getAllEvents = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiClient.get<any>(
        "/events",
        false
      );
      
      console.log("useEvents: getAllEvents response:", response);
      
      // Handle different response formats
      let eventsData: Event[] = [];
      
      // Check if response has success flag and data property
      if (response.success && response.data) {
        // If data is an array, use it directly
        if (Array.isArray(response.data)) {
          eventsData = response.data;
        } 
        // If data is object with items property (pagination), use items array
        else if (response.data.items && Array.isArray(response.data.items)) {
          eventsData = response.data.items;
        }
        // If data is a single object but not an array, wrap in array
        else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          eventsData = [response.data];
        }
      }
      // Direct array response
      else if (Array.isArray(response)) {
        eventsData = response;
      }
      // Object with items property but no success flag
      else if (response.items && Array.isArray(response.items)) {
        eventsData = response.items;
      }
      
      console.log("useEvents: Parsed events:", eventsData);
      dispatch({ type: "SET_EVENTS", payload: eventsData });
      return { success: true, data: eventsData };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch events";
      console.log("useEvents: getAllEvents error:", message);
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, error: message };
    }
  }, []);

  const getEventById = useCallback(async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiClient.get<any>(
        `/events/${id}`,
        false
      );
      
      let eventData: Event | null = null;
      if (response.success) {
        if (response.data && !Array.isArray(response.data)) {
          eventData = response.data as Event;
        } else if (response.data && (response.data as any).data) {
          eventData = (response.data as any).data as Event;
        }
      }
      
      if (eventData) {
        dispatch({ type: "SET_CURRENT_EVENT", payload: eventData });
        return { success: true, data: eventData };
      }
      throw new Error("Failed to fetch event");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch event";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, error: message };
    }
  }, []);

  const createEvent = useCallback(async (data: CreateEventData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiClient.post<any>(
        "/events",
        data,
        true
      );
      
      let eventData: Event | null = null;
      if (response.success) {
        if (response.data && !Array.isArray(response.data)) {
          eventData = response.data as Event;
        } else if (response.data && (response.data as any).data) {
          eventData = (response.data as any).data as Event;
        }
      }
      
      if (eventData) {
        dispatch({ type: "ADD_EVENT", payload: eventData });
        return { success: true, data: eventData };
      }
      throw new Error("Failed to create event");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create event";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, error: message };
    }
  }, []);

  const updateEvent = useCallback(async (data: UpdateEventData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { id, ...updateData } = data;
      const response = await apiClient.put<any>(
        `/events/${id}`,
        updateData,
        true
      );
      
      let eventData: Event | null = null;
      if (response.success) {
        if (response.data && !Array.isArray(response.data)) {
          eventData = response.data as Event;
        } else if (response.data && (response.data as any).data) {
          eventData = (response.data as any).data as Event;
        }
      }
      
      if (eventData) {
        dispatch({ type: "UPDATE_EVENT", payload: eventData });
        return { success: true, data: eventData };
      }
      throw new Error("Failed to update event");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update event";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, error: message };
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return {
    ...state,
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    clearError,
  };
};
