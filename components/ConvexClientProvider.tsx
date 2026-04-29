"use client";

import { ReactNode, useState, useEffect } from "react";

// Mock Convex provider - no actual Convex connection needed
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <>{children}</>;
  }

  // Return children directly without ConvexProvider
  return <>{children}</>;
}
