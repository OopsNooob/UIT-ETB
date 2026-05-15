"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { profile, getProfile } = useUserProfile();
  const { toast } = useToast();

  // Fetch profile on mount
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to access settings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>

          {profile && (
            <div className="mb-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Name</p>
                  <p className="text-lg text-gray-900">{profile.name}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600">Email</p>
                  <p className="text-lg text-gray-900">{profile.email}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600">Phone</p>
                  <p className="text-lg text-gray-900">{profile.phone || "Not set"}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600">Current Role</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      profile.role === "organizer"
                        ? "bg-blue-100 text-blue-800"
                        : profile.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600">Status</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      profile.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profile.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600">Member Since</p>
                  <p className="text-lg text-gray-900">
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <p className="text-gray-600">
              Profile information is managed by the system. Contact support to request changes.
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Info:</strong> More account management features coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
