"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";
import { Search } from "lucide-react";
import Spinner from "@/components/Spinner";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { events, isLoading, getAllEvents } = useEvents();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  useEffect(() => {
    if (query.trim() && events.length > 0) {
      // Filter events by title or description
      const results = events.filter(
        (event: any) =>
          event.title?.toLowerCase().includes(query.toLowerCase()) ||
          event.description?.toLowerCase().includes(query.toLowerCase()) ||
          event.location?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query, events]);

  const now = new Date().getTime();
  const upcomingEvents = searchResults
    .filter((event: any) => new Date(event.start_date).getTime() > now)
    .sort(
      (a: any, b: any) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

  const pastEvents = searchResults
    .filter((event: any) => new Date(event.start_date).getTime() <= now)
    .sort(
      (a: any, b: any) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Results Header */}
        <div className="flex items-center gap-3 mb-8">
          <Search className="w-6 h-6 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for &quot;{query}&quot;
            </h1>
            <p className="text-gray-600 mt-1">
              Found {searchResults.length} events
            </p>
          </div>
        </div>

        {/* No Results State */}
        {searchResults.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No events found
            </h3>
            <p className="text-gray-600 mt-1">
              Try adjusting your search terms or browse all events
            </p>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event: any) => (
                <EventCard key={event.id} eventId={event.id} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event: any) => (
                <EventCard key={event.id} eventId={event.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

