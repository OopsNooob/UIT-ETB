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
    _id: "event_organizer_1",
    _creationTime: Date.now() - 86400000,
    title: "TypeScript Bootcamp",
    description: "Master TypeScript from basics to advanced",
    eventDate: new Date(Date.now() + 1814400000).getTime(), // 21 days from now
    date: new Date(Date.now() + 1814400000).toISOString(),
    time: "09:00",
    location: "Boston, MA",
    eventImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
    imageStorageId: "mock_image_1",
    price: 89,
    categoryId: "cat_1",
    organizerId: "organizer_123",
    capacity: 150,
    registeredCount: 82,
    status: "active",
    isHighlight: false,
  },
  {
    _id: "event_organizer_2",
    _creationTime: Date.now() - 172800000,
    title: "Node.js API Development",
    description: "Build scalable APIs with Node.js",
    eventDate: new Date(Date.now() + 864000000).getTime(), // 10 days from now
    date: new Date(Date.now() + 864000000).toISOString(),
    time: "14:00",
    location: "Seattle, WA",
    eventImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    imageStorageId: "mock_image_2",
    price: 69,
    categoryId: "cat_2",
    organizerId: "organizer_123",
    capacity: 80,
    registeredCount: 45,
    status: "active",
    isHighlight: false,
  },
  {
    _id: "event_organizer_3",
    _creationTime: Date.now() - 259200000,
    title: "React Advanced Patterns",
    description: "Deep dive into advanced React patterns and hooks",
    eventDate: new Date(Date.now() + 1209600000).getTime(), // 14 days from now
    date: new Date(Date.now() + 1209600000).toISOString(),
    time: "10:00",
    location: "Austin, TX",
    eventImageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    imageStorageId: "mock_image_3",
    price: 79,
    categoryId: "cat_1",
    organizerId: "organizer_123",
    capacity: 200,
    registeredCount: 145,
    status: "active",
    isHighlight: true,
  },
  {
    _id: "event_organizer_4",
    _creationTime: Date.now() - 345600000,
    title: "Web Development Workshop",
    description: "Learn modern web development practices",
    eventDate: new Date(Date.now() + 604800000).getTime(), // 7 days from now
    date: new Date(Date.now() + 604800000).toISOString(),
    time: "14:00",
    location: "New York, NY",
    eventImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    imageStorageId: "mock_image_4",
    price: 49,
    categoryId: "cat_2",
    organizerId: "organizer_123",
    capacity: 100,
    registeredCount: 78,
    status: "active",
    isHighlight: false,
  },
];

export const mockTickets = [
  {
    _id: "ticket_1",
    _creationTime: Date.now() - 86400000,
    userId: "demo@example.com",
    eventId: "event_organizer_1",
    event: mockEvents[0],
    ticketNumber: "TKT-20260429-001",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TKT-20260429-001",
    purchasedAt: new Date().toISOString(),
    purchaseDate: new Date().toISOString(),
    status: "valid",
    eventTitle: "TypeScript Bootcamp",
    eventDate: "2026-05-20",
  },
  {
    _id: "ticket_2",
    _creationTime: Date.now() - 172800000,
    userId: "demo@example.com",
    eventId: "event_organizer_2",
    event: mockEvents[1],
    ticketNumber: "TKT-20260422-001",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TKT-20260422-001",
    purchasedAt: new Date(Date.now() - 259200000).toISOString(),
    purchaseDate: new Date(Date.now() - 259200000).toISOString(),
    status: "valid",
    eventTitle: "Node.js API Development",
    eventDate: "2026-05-09",
  },
  {
    _id: "ticket_3",
    _creationTime: Date.now() - 3600000,
    userId: "demo@example.com",
    eventId: "event_organizer_3",
    event: mockEvents[2],
    ticketNumber: "TKT-20260429-002",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TKT-20260429-002",
    purchasedAt: new Date(Date.now() - 3600000).toISOString(),
    purchaseDate: new Date(Date.now() - 3600000).toISOString(),
    status: "valid",
    eventTitle: "React Advanced Patterns",
    eventDate: "2026-05-13",
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
