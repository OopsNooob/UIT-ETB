// Mock hooks to replace Clerk and Convex
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
  // Handle when query is skipped
  if (query === "skip" || args === "skip") {
    return undefined;
  }

  const currentUser = getCurrentUser();
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
    return mockTickets;
  }

  if (query?.name?.includes("getUserTicketForEvent")) {
    const eventId = args?.eventId;
    if (eventId) {
      return mockTickets.find(t => t.eventId === eventId);
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
    return mockTickets.filter(t => t.eventId === args?.eventId && t.userId === args?.userId).length;
  }

  if (query?.name?.includes("getQueuePosition")) {
    // Return user's position in queue
    return {
      position: 42,
      estimatedWaitTime: "~2 hours",
    };
  }

  if (query?.name?.includes("getUrl")) {
    // Return a mock image URL for storage
    return "https://images.unsplash.com/photo-1540575467063-178f50002311?w=500&h=300&fit=crop";
  }

  if (query?.name?.includes("getOrganizersEvents")) {
    return mockEvents.filter(e => e.organizerId === mockAdminUser.id);
  }

  if (query?.name?.includes("getDashboardMetrics")) {
    return mockDashboardMetrics;
  }

  // Default: return empty array for list queries
  return [];
}

export function useMutation(mutation: any) {
  return async (args: any) => {
    console.log("Mock mutation called:", { mutation, args });
    
    // Return mock success responses
    if (mutation?.name?.includes("updateUser")) {
      return { success: true };
    }
    
    if (mutation?.name?.includes("purchaseTicket")) {
      return { success: true, ticketId: "ticket_" + Date.now() };
    }

    if (mutation?.name?.includes("refund")) {
      return { success: true };
    }

    if (mutation?.name?.includes("releaseTicket")) {
      return { success: true };
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
};
