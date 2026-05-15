"use client";

import { useEffect } from "react";
import EventCard from "./EventCard";
import Spinner from "./Spinner";
import { CalendarDays, Ticket } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";

export default function EventList() {
  const { events, isLoading, getAllEvents } = useEvents();

  useEffect(() => {
    console.log("EventList: Fetching events...");
    getAllEvents();
  }, [getAllEvents]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const now = new Date().getTime();
  const upcomingEvents = (events || [])
    .filter((event: any) => new Date(event.start_date).getTime() > now)
    .sort(
      (a: any, b: any) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

  const pastEvents = (events || [])
    .filter((event: any) => new Date(event.start_date).getTime() <= now)
    .sort(
      (a: any, b: any) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="mt-2 text-gray-600">
            Discover & book tickets for amazing events
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="w-5 h-5" />
            <span className="font-medium">
              {upcomingEvents.length} Upcoming Events
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Events Grid */}
      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upcomingEvents.map((event: any) => (
            <EventCard key={event.id} eventId={event.id} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center mb-12">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No upcoming events
          </h3>
          <p className="text-gray-600 mt-1">Check back later for new events</p>
        </div>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event: any) => (
              <EventCard key={event.id} eventId={event.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
