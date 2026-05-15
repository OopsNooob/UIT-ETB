"use client";

import { useAuth } from "@/hooks/useAuth";
import Spinner from "./Spinner";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: "user" | "organizer" | "admin";
  onRoleMismatch?: () => void;
}

export default function RoleGuard({ children, allowedRole, onRoleMismatch }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // If user not logged in or role doesn't match
  if (!user) {
    onRoleMismatch?.();
    return null;
  }

  // Map user.role to allowed role
  // Backend returns role as "organizer", "admin", or "user" (stored in user table)
  const userRole = user.role || "user";
  
  if (userRole !== allowedRole) {
    onRoleMismatch?.();
    return null;
  }

  return <>{children}</>;
}
