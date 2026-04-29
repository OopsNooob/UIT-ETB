"use client";

import React, { useState } from "react";
import { mockUser } from "@/lib/mockData";
import Link from "next/link";
import { LogOut } from "lucide-react";

// Clerk component mocks
export function SignedIn({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  return null;
}

export function SignInButton({ 
  children,
  mode,
}: { 
  children: React.ReactNode;
  mode?: string;
}) {
  return <>{children}</>;
}

export function UserButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    // Clear mock user session
    localStorage.removeItem("mockUser");
    window.location.href = "/sign-in";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:bg-blue-600 transition"
        title={`${mockUser.firstName} ${mockUser.lastName}`}
      >
        {mockUser.firstName?.[0]}{mockUser.lastName?.[0]}
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{mockUser.firstName} {mockUser.lastName}</p>
            <p className="text-xs text-gray-500">{mockUser.email}</p>
          </div>
          
          <Link href="/settings">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
              Settings
            </button>
          </Link>
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-100"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// Convex component mocks
export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// ConvexReactClient mock
export class ConvexReactClient {
  constructor(url: string) {
    console.log("Mock ConvexReactClient initialized with URL:", url);
  }
}

// ClerkProvider mock
export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// ConvexHttpClient mock
export class ConvexHttpClient {
  constructor(url: string) {
    console.log("Mock ConvexHttpClient initialized with URL:", url);
  }
}
