// Mock data for frontend development without Convex and Clerk

// Get current user from localStorage or default to regular user
export const getCurrentMockUser = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mockUser");
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return mockUser; // Default to regular user
};

export const mockUser = {
  id: "user_123",
  email: "demo@example.com",
  firstName: "Demo",
  lastName: "User",
  fullName: "Demo User",
  primaryEmailAddress: {
    emailAddress: "demo@example.com",
  },
  imageUrl: "https://www.gravatar.com/avatar/demo",
};

export const mockOrganizerUser = {
  id: "organizer_123",
  email: "organizer@example.com",
  firstName: "John",
  lastName: "Organizer",
  fullName: "John Organizer",
  primaryEmailAddress: {
    emailAddress: "organizer@example.com",
  },
  imageUrl: "https://www.gravatar.com/avatar/organizer",
};

export const mockAdminUser = {
  id: "admin_123",
  email: "dodinhkhang8@gmail.com",
  firstName: "Admin",
  lastName: "User",
  fullName: "Admin User",
  primaryEmailAddress: {
    emailAddress: "dodinhkhang8@gmail.com",
  },
  imageUrl: "https://www.gravatar.com/avatar/admin",
};

export const mockEvents = [
  {
    _id: "event_1",
    _creationTime: Date.now() - 86400000,
    title: "React Conference 2026",
    description: "Join us for an amazing React conference with industry experts",
    eventDate: new Date(Date.now() + 2592000000).getTime(), // 30 days from now
    date: new Date(Date.now() + 2592000000).toISOString(),
    time: "09:00",
    location: "San Francisco, CA",
    eventImageUrl: "https://images.unsplash.com/photo-1540575467063-178f50002311",
    price: 99,
    categoryId: "cat_1",
    organizerId: "user_123",
    capacity: 500,
    registeredCount: 245,
    status: "active",
    isHighlight: true,
  },
  {
    _id: "event_2",
    _creationTime: Date.now() - 172800000,
    title: "Web Development Workshop",
    description: "Learn modern web development practices",
    eventDate: new Date(Date.now() + 604800000).getTime(), // 7 days from now
    date: new Date(Date.now() + 604800000).toISOString(),
    time: "14:00",
    location: "New York, NY",
    eventImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    price: 49,
    categoryId: "cat_2",
    organizerId: "user_456",
    capacity: 100,
    registeredCount: 78,
    status: "active",
    isHighlight: false,
  },
  {
    _id: "event_3",
    _creationTime: Date.now() - 259200000,
    title: "JavaScript Masterclass",
    description: "Advanced JavaScript concepts and patterns",
    eventDate: new Date(Date.now() + 1209600000).getTime(), // 14 days from now
    date: new Date(Date.now() + 1209600000).toISOString(),
    time: "10:00",
    location: "Austin, TX",
    eventImageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    price: 79,
    categoryId: "cat_1",
    organizerId: "user_789",
    capacity: 200,
    registeredCount: 145,
    status: "active",
    isHighlight: true,
  },
];

export const mockTickets = [
  {
    _id: "ticket_1",
    _creationTime: Date.now() - 86400000,
    userId: "user_123",
    eventId: "event_1",
    ticketNumber: "TKT-20260429-001",
    qrCode: "https://mockApi.qrserver.com/v1/create-qr-code/?size=300x300&data=TKT-20260429-001",
    purchaseDate: new Date().toISOString(),
    status: "active",
    eventTitle: "React Conference 2026",
    eventDate: "2026-05-29",
  },
  {
    _id: "ticket_2",
    _creationTime: Date.now() - 172800000,
    userId: "user_123",
    eventId: "event_2",
    ticketNumber: "TKT-20260422-001",
    qrCode: "https://mockApi.qrserver.com/v1/create-qr-code/?size=300x300&data=TKT-20260422-001",
    purchaseDate: new Date(Date.now() - 259200000).toISOString(),
    status: "active",
    eventTitle: "Web Development Workshop",
    eventDate: "2026-05-06",
  },
];

export const mockUserRole = {
  _id: "role_1",
  userId: "user_123",
  role: "organizer",
};

export const mockCategories = [
  { _id: "cat_1", name: "Technology" },
  { _id: "cat_2", name: "Business" },
  { _id: "cat_3", name: "Design" },
];

export const mockDashboardMetrics = {
  totalEvents: 5,
  activeEvents: 3,
  totalRevenue: 45000,
  totalTicketsSold: 450,
  upcomingEvents: 2,
};
