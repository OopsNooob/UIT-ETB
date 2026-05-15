# Event Ticket Booking (ETB) Platform

A modern event ticketing platform built with **Next.js 15 (Frontend)** and **Express.js (Backend)** with **Prisma ORM** and **PostgreSQL**.

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18+** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Hook Form + Zod** - Form validation
- **Lucide React** - Icons
- **Leaflet** - Interactive maps

### Backend
- **Express.js** - REST API server
- **Prisma** - ORM for database
- **PostgreSQL** - Database
- **TypeScript** - Type-safe backend

### Authentication & Authorization
- **Context API + useReducer** - Global auth state management
- **localStorage** - Token persistence
- **Role-based access control** - User/Organizer/Admin roles

## 🚀 Features

### For Event Attendees
- � Browse and search events
- � Advanced search filtering by title, location, description
- �️ View event locations on interactive map
- �️ Purchase tickets in real-time
- 📱 View purchased tickets
- 💾 Download tickets as images with QR codes
- ❌ Request refunds for tickets
- � Receive tickets via email

### For Event Organizers
- 📝 Create and manage events
- �️ Set event location with interactive map picker
- � View event statistics and ticket sales
- 👥 See list of ticket purchasers
- ✏️ Edit event details
- 🎯 Manage ticket availability
- � Track revenue and metrics
- �️ Organize events (upcoming/past)

### For Administrators
- � User management
- � Role assignment and validation
- � System statistics
- 🛠️ Data migration tools

## 🛡️ Security Features
- **Role-Based Access Control (RBAC)**: User, Organizer, Admin roles
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: RoleGuard component for route protection
- **Input Validation**: Zod schemas for all inputs
- **CORS Protection**: Backend CORS configuration
- **Soft Deletes**: Preserve data history

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Environment Setup

Create `.env.local` for frontend:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

Create `.env` for backend:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/etb_db

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email (Optional - for ticket delivery)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### Installation

#### Backend Setup
```bash
# Navigate to backend directory
cd c:\SE356\UIT-ETB

# Install dependencies
npm install

# Setup database
npx prisma migrate dev --name init

# Seed sample data
npx prisma db seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3000`

#### Frontend Setup
```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:3001`

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy

# Reset database (dev only!)
npx prisma migrate reset
```

### Seed Data

The project includes seed data with:
- 4 sample users (2 users, 2 organizers)
- 2 sample events
- Sample tickets

```bash
npx prisma db seed
```

## 🔐 Authentication Flow

1. User signs up/logs in
2. Backend generates JWT token
3. Frontend stores token in localStorage
4. All API requests include Authorization header with token
5. Backend validates token on protected routes
6. User's role determines access to features

## 🛡️ Role-Based Access

### User Role
- View all events
- Purchase tickets
- View own tickets
- Request refunds
- Cannot create events

### Organizer Role
- Create and manage events
- View event statistics
- See ticket purchasers
- Cannot purchase tickets

### Admin Role
- Full system access
- User management
- Role assignment
- Migration tools

## � Project Structure

See structure above in the Project Structure section.

## 🗄️ Database Schema

See database schema above.

## 🔄 API Endpoints

See API endpoints above.

## 🧪 Testing

```bash
# Run backend tests
npm run test

# Run backend tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## � Build & Deployment

### Frontend Build
```bash
npm run build
npm start
```

### Backend Build
```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Events not showing on Dashboard
- Check browser console for API errors
- Verify token is stored in localStorage
- Check backend logs for API response errors
- Ensure user is logged in and role is "organizer"

### Edit Event returning 404
- Verify event ID is being passed correctly
- Check backend endpoint: `PUT /api/v1/events/:id`
- Ensure user owns the event

### Search not working
- Check if events are fetched from API
- Verify search query is being sent to backend
- Frontend-side filtering by title/description/location

### Email tickets not sending
- Configure Gmail credentials in `.env`
- Use [Google App Password](https://support.google.com/accounts/answer/185833)
- Check backend logs for email errors

## 📊 Performance Optimizations

- ✅ Database indexing on frequently queried fields
- ✅ Pagination for event listings
- ✅ Client-side debouncing for search
- ✅ API response caching in frontend state
- ✅ Lazy loading of components
- ✅ Image optimization with Next.js Image

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## � License

MIT License

## 👨‍� Authors

- **Course**: [Zero to Full Stack Hero](https://www.papareact.com/course) by Sonny Sangha
- **Implementation**: Event Ticket Booking Platform Team

---

**Built with ❤️ for event management**
