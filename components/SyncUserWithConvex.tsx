"use client";

import { useEffect } from "react";
import { mockUser } from "@/lib/mockData";

export default function SyncUserWithConvex() {
  useEffect(() => {
    // Mock sync - just log to console
    console.log("Mock: Syncing user with Convex:", {
      userId: mockUser.id,
      email: mockUser.email,
      name: mockUser.fullName,
    });
    console.log("✅ Mock: User synced successfully");
  }, []);

  return null;
}
