"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import Link from "next/link";
import { useEffect } from "react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { events, isLoading, getAllEvents } = useEvents();

  useEffect(() => {
    console.log("SellerDashboard: user =", user);
    getAllEvents();
  }, [getAllEvents]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const organizerEvents = events.filter(
    (event) => event.organizer_id === user?.id
  );

  console.log("SellerDashboard: events =", events);
  console.log("SellerDashboard: user?.id =", user?.id);
  console.log("SellerDashboard: organizerEvents =", organizerEvents);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your events and sales</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Total Events</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {organizerEvents.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Active Events</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {organizerEvents.filter((e) => e.status === "published").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Total Capacity</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {organizerEvents.reduce(
              (sum, e) => sum + (e.total_capacity || 0),
              0
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Available Slots</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {organizerEvents.reduce(
              (sum, e) => sum + (e.remaining_capacity || 0),
              0
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-8">
        <Link href="/seller/new-event">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            + Create New Event
          </button>
        </Link>
      </div>

      {/* Events Summary */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {organizerEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-gray-600">
                      No events yet.{" "}
                      <Link
                        href="/seller/new-event"
                        className="text-blue-600 hover:underline"
                      >
                        Create one now
                      </Link>
                    </p>
                  </td>
                </tr>
              ) : (
                organizerEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">
                        {event.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">
                        {new Date(event.start_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">
                        {event.total_capacity}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">
                        {event.remaining_capacity}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === "published"
                            ? "bg-green-100 text-green-800"
                            : event.status === "draft"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {event.status || "draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/seller/events/${event.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
