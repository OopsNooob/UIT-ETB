"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import EventForm from "@/components/EventForm";
import { AlertCircle } from "lucide-react";
import RoleGuard from "@/components/RoleGuard";
import Spinner from "@/components/Spinner";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { getEventById } = useEvents();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getEventById(eventId);
        if (result.success) {
          setEvent(result.data);
        } else {
          console.error("Failed to fetch event:", result.error);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, getEventById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!event) {
    return (
      <RoleGuard allowedRole="organizer">
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Event not found</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRole="organizer">
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
            <h2 className="text-2xl font-bold">Edit Event</h2>
            <p className="text-blue-100 mt-2">Update your event details</p>
          </div>

          <div className="p-6">
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-2 text-amber-800">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">
                  Note: If you modify the total number of tickets, any tickets
                  already sold will remain valid. You can only increase the total
                  number of tickets, not decrease it below the number of tickets
                  already sold.
                </p>
              </div>
            </div>

            <EventForm mode="edit" initialData={event} />
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
