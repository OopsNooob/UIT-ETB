"use client";

import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import JoinQueue from "@/components/JoinQueue";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function EventPage() {
  const { user } = useAuth();
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
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Event not found</p>
      </div>
    );
  }

  const imageUrl = event.banner_url;
  const price = event.price || 0;
  const totalTickets = event.total_capacity || 0;
  const remainingTickets = event.remaining_capacity ?? totalTickets;
  const purchasedCount = totalTickets - remainingTickets;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {imageUrl && (
            <div className="aspect-[21/9] relative w-full">
              <Image
                src={imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Event Details */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </h1>
                  <p className="text-lg text-gray-600">{event.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-gray-900">{event.location}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Availability</span>
                    </div>
                    <p className="text-gray-900">
                      {remainingTickets} / {totalTickets} left
                    </p>
                  </div>
                </div>

                {/* Additional Event Information */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Event Information
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Please arrive 30 minutes before the event starts</li>
                    <li>• Tickets are non-refundable</li>
                    <li>• Age restriction: 18+</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Ticket Purchase Card */}
              <div>
                <div className="sticky top-8 space-y-4">
                  {/* Ticket Purchase Section */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Get Your Ticket
                    </h3>
                    
                    {user ? (
                      user.role === "organizer" ? (
                        <div className="w-full text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-gray-600 font-medium">Organizers cannot purchase tickets.</p>
                        </div>
                      ) : (
                        <JoinQueue
                          eventId={eventId}
                          userId={user.id}
                        />
                      )
                    ) : (
                      <div className="w-full">
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                          onClick={() => window.location.href = '/sign-in'}
                        >
                          Sign in to buy tickets
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
