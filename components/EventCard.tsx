"use client";

import {
  CalendarDays,
  MapPin,
  Ticket,
  Check,
  PencilIcon,
  StarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function EventCard({ eventId }: { eventId: any }) {
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"}/events/${eventId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success && data.data) {
          setEvent(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading || !event) {
    return null;
  }

  const isPastEvent = new Date(event.start_date).getTime() < Date.now();
  const isEventOwner = user?.id === event?.organizer_id;
  const availableTickets = event.remaining_capacity ?? event.total_capacity;
  const isSoldOut = availableTickets <= 0;

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden relative ${
        isPastEvent ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {/* Event Image Placeholder or Banner */}
      {event.banner_url ? (
        <div className="relative w-full h-48 bg-gray-100">
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        </div>
      ) : (
        <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <Ticket className="w-16 h-16 text-blue-300" />
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex flex-col items-start gap-2">
              {isEventOwner && (
                <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <StarIcon className="w-3 h-3" />
                  Your Event
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {event.title}
              </h2>
            </div>
            {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                Past Event
              </span>
            )}
          </div>

          {/* Status Tag */}
          <div className="flex flex-col items-end gap-2 ml-4">
            {event.status && (
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  event.status === "published"
                    ? "bg-green-100 text-green-800"
                    : event.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            )}
            {isSoldOut && (
              <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-sm">
                Sold Out
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>
              {new Date(event.start_date).toLocaleDateString()}
              {isPastEvent && " (Ended)"}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2" />
            <span>{availableTickets} / {event.total_capacity} available</span>
          </div>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
          {event.description}
        </p>

        <div onClick={(e) => e.stopPropagation()} className="mt-4">
          {isEventOwner && !isPastEvent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/seller/events/${eventId}/edit`);
              }}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
            >
              <PencilIcon className="w-5 h-5" />
              Edit Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

