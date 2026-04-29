// Mock hooks to replace Clerk and Convex
import React, { useState, useEffect } from "react";
import { mockUser, mockAdminUser, mockOrganizerUser, mockEvents, mockTickets, mockUserRole, mockDashboardMetrics, getCurrentMockUser } from "@/lib/mockData";

// Get current user considering localStorage
const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mockUser");
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return mockUser; // Default
};

// Mock Clerk hooks 
export function useUser() {
  const currentUser = getCurrentUser();
  return {
    user: currentUser,
    isLoaded: true,
    isSignedIn: true,
  };
}

export function useAuth() {
  const currentUser = getCurrentUser();
  return {
    userId: currentUser.id,
    isLoaded: true,
    isSignedIn: true,
    signOut: async () => {},
  };
}

// Mock Convex hooks
export function useQuery(query: any, args?: any): any {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    // Handle when query is skipped
    if (query === "skip" || args === "skip") {
      setData(undefined);
      return;
    }

    const currentUser = getCurrentUser();
    const result = handleQuery(query, args, currentUser);
    setData(result);
  }, [query, args?.userId, args?.eventId, args?.storageId]); // Re-run when args change
  
  return data;
}

// Separate function to handle query logic
function handleQuery(query: any, args: any, currentUser: any): any {
  // Handle when query is skipped
  if (query === "skip" || args === "skip") {
    return undefined;
  }

  const ADMIN_EMAILS = ["dodinhkhang8@gmail.com", "hoanghiepta2005@gmail.com", "23520657@gm.uit.edu.vn"];
  const ORGANIZER_EMAILS = ["organizer@example.com", "dodinhkhang8@gmail.com", "hoanghiepta2005@gmail.com"];

  // Extract mock data based on query type
  if (query?.name?.includes("getUserRole")) {
    // Determine role based on email
    if (ADMIN_EMAILS.includes(currentUser.email)) {
      return "organizer"; // Admin is also an organizer
    } else if (ORGANIZER_EMAILS.includes(currentUser.email)) {
      return "organizer";
    }
    return "user";
  }
  
  if (query?.name?.includes("getEventDetails") || query?.name?.includes("getById")) {
    const eventId = args?.eventId;
    if (eventId) {
      return mockEvents.find(e => e._id === eventId) || mockEvents[0];
    }
    return mockEvents[0];
  }

  if (query?.name?.includes("getAllEvents")) {
    return mockEvents;
  }

  if (query?.name?.includes("getEventsByOrganizer")) {
    return mockEvents.filter(e => e.organizerId === mockUser.id);
  }

  if (query?.name?.includes("getTicketsByUser")) {
    return mockTickets.filter(t => 
      t.userId === currentUser.id || t.userId === currentUser.email
    );
  }

  if (query?.name?.includes("getUserTickets")) {
    // Use currentUser from localStorage or fall back to args/default
    let userToFilter = currentUser;
    
    // If userId or userEmail is passed in args, use those
    if (args?.userId || args?.userEmail) {
      userToFilter = { id: args?.userId || currentUser.id, email: args?.userEmail || currentUser.email };
    }
    
    const result = mockTickets.filter(t => 
      t.userId === userToFilter.id || t.userId === userToFilter.email || t.userId === args?.userId || t.userId === args?.userEmail
    );
    console.log("getUserTickets - userToFilter:", userToFilter, "args:", args, "tickets found:", result.length, "total tickets:", mockTickets.length);
    return result;
  }

  if (query?.name?.includes("getUserTicketForEvent")) {
    const eventId = args?.eventId;
    if (eventId) {
      // Find ticket for this user and event
      return mockTickets.find(t => 
        t.eventId === eventId && (
          t.userId === args?.userId || 
          t.userId === args?.userEmail ||
          (currentUser && (t.userId === currentUser.id || t.userId === currentUser.email))
        )
      );
    }
    return undefined;
  }

  if (query?.name?.includes("getEventAvailability")) {
    // Return availability info
    return {
      totalCapacity: 500,
      ticketsSold: 245,
      ticketsAvailable: 255,
    };
  }

  if (query?.name?.includes("getSellerStats")) {
    // Return overall seller stats
    return {
      totalRevenue: 5000,
      netRevenue: 4500,
      totalTicketsSold: 245,
      totalEvents: 12,
      averageTicketPrice: 50,
      pendingAmount: 300,
      totalRefunded: 200,
    };
  }

  if (query?.name?.includes("getSellerStatsByMonth")) {
    // Return monthly seller stats
    return {
      monthlyRevenue: 1500,
      monthlyTicketsSold: 75,
      eventBreakdown: mockEvents.slice(0, 2).map(e => ({
        eventId: e._id,
        eventName: e.title,
        revenue: 500,
        ticketsSold: 25,
      })),
    };
  }

  if (query?.name?.includes("getUserTicketCountForEvent")) {
    // Return user's ticket count for event
    // Check both userId and email since tickets might be stored either way
    return mockTickets.filter(t => 
      t.eventId === args?.eventId && (
        t.userId === args?.userId || 
        t.userId === args?.userEmail ||
        (currentUser && (t.userId === currentUser.id || t.userId === currentUser.email))
      )
    ).length;
  }

  if (query?.name?.includes("getQueuePosition")) {
    // Return user's position in queue
    return {
      position: 42,
      estimatedWaitTime: "~2 hours",
    };
  }

  if (query?.name?.includes("getUrl")) {
    // Return a mock image URL for storage based on imageStorageId
    const mockImageMap: { [key: string]: string } = {
      "mock_image_1": "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
      "mock_image_2": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
      "mock_image_3": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
      "mock_image_4": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    };
    return mockImageMap[args?.storageId] || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop";
  }

  if (query?.name?.includes("getOrganizersEvents")) {
    return mockEvents.filter(e => e.organizerId === mockAdminUser.id);
  }

  if (query?.name?.includes("getSellerEvents")) {
    const currentUser = getCurrentUser();
    return mockEvents.filter(e => e.organizerId === currentUser.id || e.organizerId === currentUser.email);
  }

  if (query?.name?.includes("getSellerEventsWithStats")) {
    const currentUser = getCurrentUser();
    const userEvents = mockEvents.filter(e => e.organizerId === currentUser.id || e.organizerId === currentUser.email);
    return userEvents.map(e => ({
      ...e,
      stats: {
        ticketsSold: 45,
        revenue: 4455,
        attendees: 35,
      }
    }));
  }

  if (query?.name?.includes("getEventById")) {
    const eventId = args?.eventId;
    if (eventId) {
      return mockEvents.find(e => e._id === eventId) || mockEvents[0];
    }
    return mockEvents[0];
  }

  if (query?.name?.includes("getDashboardMetrics")) {
    return mockDashboardMetrics;
  }

  // Migrations handlers - return mock data
  if (query?.name?.includes("checkUsersRoleStatus")) {
    return {
      stats: {
        totalUsers: 3,
        usersWithRole: 3,
        usersWithoutRole: 0,
        organizers: 1,
        rolesCorrect: true,
      },
      usersWithoutRole: [],
    };
  }

  if (query?.name?.includes("getUsersWithEvents")) {
    return mockEvents.length > 0 ? [{ id: "organizer_123", email: "organizer@example.com", eventCount: mockEvents.length, eventNames: mockEvents.map(e => e.title) }] : [];
  }

  if (query?.name?.includes("findConflictTickets")) {
    return { totalConflicts: 0, conflicts: [] };
  }

  if (query?.name?.includes("getTicketsOverview")) {
    return { totalTickets: mockTickets.length, validTickets: mockTickets.length, expiredTickets: 0, totalTicketsData: [] };
  }

  if (query?.name?.includes("checkPurchasedWaitingListEntries")) {
    return { totalPurchasedEntries: 0, entries: [] };
  }

  if (query?.name?.includes("checkOversoldEvents")) {
    return { totalOversoldEvents: 0, oversoldEvents: [] };
  }

  if (query?.name?.includes("checkOrphanedPayments")) {
    return { 
      totalToDelete: 0, 
      organizerPaymentsCount: 0, 
      orphanedEventPaymentsCount: 0,
      organizerPayments: [],
      orphanedEventPayments: []
    };
  }

  // Default: return empty array for list queries
  return [];
}

export function useMutation(mutation: any) {
  return async (args: any) => {
    console.log("Mock mutation called:", { mutation, args });
    
    const currentUser = getCurrentUser();
    
    // Return mock success responses
    if (mutation?.name?.includes("updateUser")) {
      return { success: true };
    }
    
    if (mutation?.name?.includes("purchaseTicket")) {
      // Create a new ticket
      const event = mockEvents.find(e => e._id === args?.eventId) || mockEvents[0];
      const newTicket = {
        _id: "ticket_" + Date.now(),
        _creationTime: Date.now(),
        userId: (currentUser.email || currentUser.id) as string,
        eventId: args?.eventId as string,
        event: event,
        ticketNumber: "TKT-" + Date.now().toString().slice(-8),
        qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + Date.now(),
        purchasedAt: new Date().toISOString(),
        purchaseDate: new Date().toISOString(),
        status: "valid",
        eventTitle: event.title,
        eventDate: event.date,
      };
      
      // Add to mockTickets (this is in-memory only)
      mockTickets.push(newTicket as any);
      
      return { success: true, ticketId: newTicket._id, ticket: newTicket };
    }

    if (mutation?.name?.includes("refund")) {
      return { success: true };
    }

    if (mutation?.name?.includes("releaseTicket")) {
      return { success: true };
    }

    // Migrations mutations
    if (mutation?.name?.includes("migrateUserRoles")) {
      return { success: true, message: "User roles migrated successfully", migratedCount: 0 };
    }

    if (mutation?.name?.includes("resetAllRolesToUser")) {
      return { success: true, message: "All roles reset to user successfully", resetCount: 0 };
    }

    if (mutation?.name?.includes("deleteConflictTickets")) {
      return { success: true, message: "Conflict tickets deleted successfully", deletedCount: 0 };
    }

    if (mutation?.name?.includes("expirePurchasedWaitingListEntries")) {
      return { success: true, message: "Waiting list entries expired successfully", expiredCount: 0 };
    }

    if (mutation?.name?.includes("deletePurchasedWaitingListEntries")) {
      return { success: true, message: "Waiting list entries deleted successfully", deletedCount: 0 };
    }

    if (mutation?.name?.includes("cleanupOrphanedPayments")) {
      return { success: true, message: "Orphaned payments cleaned up successfully", cleanedCount: 0 };
    }

    return { success: true };
  };
}

// Mock Convex API
export const mockApi = {
  users: {
    updateUser: { name: "users.updateUser" },
    getUserRole: { name: "users.getUserRole" },
    canSwitchRole: { name: "users.canSwitchRole" },
    updateUserRole: { name: "users.updateUserRole" },
    getUserById: { name: "users.getUserById" },
  },
  events: {
    getEventDetails: { name: "events.getEventDetails" },
    getAllEvents: { name: "events.getAllEvents" },
    getEventsByOrganizer: { name: "events.getEventsByOrganizer" },
    getDashboardMetrics: { name: "events.getDashboardMetrics" },
    getOrganizersEvents: { name: "events.getOrganizersEvents" },
    getById: { name: "events.getById" },
    getEventById: { name: "events.getEventById" },
    getEventAvailability: { name: "events.getEventAvailability" },
    getUserTickets: { name: "events.getUserTickets" },
    getSellerEvents: { name: "events.getSellerEvents" },
    getSellerEventsWithStats: { name: "events.getSellerEventsWithStats" },
    search: { name: "events.search" },
    create: { name: "events.create" },
    updateEvent: { name: "events.updateEvent" },
    joinWaitingList: { name: "events.joinWaitingList" },
  },
  tickets: {
    getTicketsByUser: { name: "tickets.getTicketsByUser" },
    purchaseTicket: { name: "tickets.purchaseTicket" },
    refundTicket: { name: "tickets.refundTicket" },
    releaseTicket: { name: "tickets.releaseTicket" },
    getUserTicketForEvent: { name: "tickets.getUserTicketForEvent" },
    getUserTicketCountForEvent: { name: "tickets.getUserTicketCountForEvent" },
    getTicketWithDetails: { name: "tickets.getTicketWithDetails" },
    getValidTicketsForEvent: { name: "tickets.getValidTicketsForEvent" },
    updateExpiredTicketsForUser: { name: "tickets.updateExpiredTicketsForUser" },
  },
  waitingList: {
    getQueuePosition: { name: "waitingList.getQueuePosition" },
    releaseTicket: { name: "waitingList.releaseTicket" },
  },
  storage: {
    getUrl: { name: "storage.getUrl" },
    generateUploadUrl: { name: "storage.generateUploadUrl" },
    updateEventImage: { name: "storage.updateEventImage" },
    deleteImage: { name: "storage.deleteImage" },
  },
  payments: {
    getSellerStats: { name: "payments.getSellerStats" },
    getSellerStatsByMonth: { name: "payments.getSellerStatsByMonth" },
  },
  migrations: {
    checkUsersRoleStatus: { name: "migrations.checkUsersRoleStatus" },
    getUsersWithEvents: { name: "migrations.getUsersWithEvents" },
    findConflictTickets: { name: "migrations.findConflictTickets" },
    getTicketsOverview: { name: "migrations.getTicketsOverview" },
    checkPurchasedWaitingListEntries: { name: "migrations.checkPurchasedWaitingListEntries" },
    checkOversoldEvents: { name: "migrations.checkOversoldEvents" },
    checkOrphanedPayments: { name: "migrations.checkOrphanedPayments" },
    migrateUserRoles: { name: "migrations.migrateUserRoles" },
    resetAllRolesToUser: { name: "migrations.resetAllRolesToUser" },
    deleteConflictTickets: { name: "migrations.deleteConflictTickets" },
    expirePurchasedWaitingListEntries: { name: "migrations.expirePurchasedWaitingListEntries" },
    deletePurchasedWaitingListEntries: { name: "migrations.deletePurchasedWaitingListEntries" },
    cleanupOrphanedPayments: { name: "migrations.cleanupOrphanedPayments" },
  },
};
