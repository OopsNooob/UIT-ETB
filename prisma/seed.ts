import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  Role,
  EventStatus,
  TicketStatus,
  PurchaseStatus,
  GiftcodeType,
  GiftcodeStatus,
  WaitingListStatus,
} from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import bcrypt from "bcrypt";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file.");
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function encrypt(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (in reverse order of dependencies)
  await prisma.giftcodeRedemption.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.waitingList.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.giftcode.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log("✨ Cleared existing data");

  // ==================== CREATE USERS ====================
  const adminPassword = "Password123";
  const organizerPassword = "Password123";
  const user1Password = "Password123";
  const user2Password = "Password123";

  const adminPasswordHash = await encrypt(adminPassword);
  const organizerPasswordHash = await encrypt(organizerPassword);
  const user1PasswordHash = await encrypt(user1Password);
  const user2PasswordHash = await encrypt(user2Password);

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      phone: "0123456789",
      role: Role.admin,
      password_hash: adminPasswordHash,
      is_active: true,
    },
  });

  const organizerUser = await prisma.user.create({
    data: {
      name: "John Organizer",
      email: "organizer@example.com",
      phone: "0123456788",
      role: Role.organizer,
      password_hash: organizerPasswordHash,
      is_active: true,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "Alice Customer",
      email: "alice@example.com",
      phone: "0123456787",
      role: Role.user,
      password_hash: user1PasswordHash,
      is_active: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Bob Customer",
      email: "bob@example.com",
      phone: "0123456786",
      status: "banned",
      role: Role.user,
      password_hash: user2PasswordHash,
      is_active: true,
    },
  });

  console.log("✅ Created 4 users (1 admin, 1 organizer, 2 regular)");

  // ==================== CREATE EVENTS ====================
  const now = new Date();
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const endDate = new Date(futureDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later

  const event1 = await prisma.event.create({
    data: {
      organizer_id: organizerUser.id,
      title: "Tech Conference 2024",
      description:
        "Annual technology conference featuring the latest innovations",
      location: "Ho Chi Minh City, Vietnam",
      banner_url: "https://example.com/banner1.jpg",
      start_date: futureDate,
      end_date: endDate,
      total_capacity: 500,
      remaining_capacity: 500,
      status: EventStatus.published,
      created_by: organizerUser.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      organizer_id: organizerUser.id,
      title: "Music Festival 2024",
      description: "Summer music festival with multiple stages",
      location: "Hanoi, Vietnam",
      banner_url: "https://example.com/banner2.jpg",
      start_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days
      end_date: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000), // 16 days
      total_capacity: 1000,
      remaining_capacity: 1000,
      status: EventStatus.published,
      created_by: organizerUser.id,
    },
  });

  console.log("✅ Created 2 events");

  // ==================== CREATE TICKET TYPES ====================
  const ticketType1 = await prisma.ticketType.create({
    data: {
      event_id: event1.id,
      name: "Early Bird",
      description: "Special early bird pricing",
      price: 99.99,
      total_quantity: 100,
      sold_quantity: 0,
      sale_start: now,
      sale_end: futureDate,
      created_by: organizerUser.id,
    },
  });

  const ticketType2 = await prisma.ticketType.create({
    data: {
      event_id: event1.id,
      name: "Regular",
      description: "Standard ticket",
      price: 149.99,
      total_quantity: 300,
      sold_quantity: 0,
      sale_start: now,
      sale_end: futureDate,
      created_by: organizerUser.id,
    },
  });

  const ticketType3 = await prisma.ticketType.create({
    data: {
      event_id: event2.id,
      name: "General Admission",
      description: "General admission to festival",
      price: 49.99,
      total_quantity: 500,
      sold_quantity: 0,
      sale_start: now,
      sale_end: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      created_by: organizerUser.id,
    },
  });

  console.log("✅ Created 3 ticket types");

  // ==================== CREATE GIFTCODES ====================
  const giftcode1 = await prisma.giftcode.create({
    data: {
      code: "SUMMER2024",
      type: GiftcodeType.percentage,
      discount_value: 20, // 20% off
      event_id: event1.id,
      usage_limit: 50,
      used_count: 0,
      expired_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: GiftcodeStatus.active,
      created_by: organizerUser.id,
    },
  });

  const giftcode2 = await prisma.giftcode.create({
    data: {
      code: "DISCOUNT50",
      type: GiftcodeType.fixed_amount,
      discount_value: 50, // $50 off
      event_id: event2.id,
      usage_limit: 30,
      used_count: 0,
      expired_date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days
      status: GiftcodeStatus.active,
      created_by: organizerUser.id,
    },
  });

  console.log("✅ Created 2 giftcodes");

  // ==================== CREATE PURCHASES & TICKETS ====================
  const purchase1 = await prisma.purchase.create({
    data: {
      user_id: user1.id,
      event_id: event1.id,
      gateway_transaction_id: "TXN_20240513_001",
      total_amount: 149.99,
      discount_amount: 0,
      final_amount: 149.99,
      status: PurchaseStatus.completed,
    },
  });

  const ticket1 = await prisma.ticket.create({
    data: {
      purchase_id: purchase1.id,
      event_id: event1.id,
      ticket_type_id: ticketType2.id,
      user_id: user1.id,
      ticket_code: "TICKET-001-" + user1.id.slice(0, 8),
      status: TicketStatus.valid,
    },
  });

  const purchase2 = await prisma.purchase.create({
    data: {
      user_id: user2.id,
      event_id: event1.id,
      gateway_transaction_id: "TXN_20240513_002",
      total_amount: 199.98, // 2 tickets
      discount_amount: 30, // 15% discount
      final_amount: 169.98,
      status: PurchaseStatus.completed,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      purchase_id: purchase2.id,
      event_id: event1.id,
      ticket_type_id: ticketType1.id,
      user_id: user2.id,
      ticket_code: "TICKET-002-" + user2.id.slice(0, 8),
      status: TicketStatus.valid,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      purchase_id: purchase2.id,
      event_id: event1.id,
      ticket_type_id: ticketType1.id,
      user_id: user2.id,
      ticket_code: "TICKET-003-" + user2.id.slice(0, 8),
      status: TicketStatus.valid,
    },
  });

  console.log("✅ Created 2 purchases with 3 tickets");

  // ==================== CREATE GIFTCODE REDEMPTION ====================
  const redemption1 = await prisma.giftcodeRedemption.create({
    data: {
      giftcode_id: giftcode1.id,
      user_id: user1.id,
      purchase_id: purchase1.id,
    },
  });

  console.log("✅ Created 1 giftcode redemption");

  // ==================== CREATE WAITING LIST ENTRIES ====================
  const waitingList1 = await prisma.waitingList.create({
    data: {
      user_id: user2.id,
      event_id: event2.id,
      status: WaitingListStatus.waiting,
    },
  });

  console.log("✅ Created 1 waiting list entry");

  // ==================== CREATE AUDIT LOGS ====================
  await prisma.auditLog.create({
    data: {
      user_id: user1.id,
      event_code: "SEC-008", // USER_LOGIN
      severity_level: "normal",
      action: "SEC",
      target_entity: "System",
      target_id: null,
      ip_address: "192.168.1.100",
      details: {
        description: "User successfully signs in.",
        timestamp: new Date(),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      user_id: user1.id,
      event_code: "BUS-008", // PAYMENT_CAPTURED
      severity_level: "normal",
      action: "BUS",
      target_entity: "Transaction",
      target_id: purchase1.id,
      ip_address: "192.168.1.100",
      details: {
        description: "Payment transaction successfully captured and verified.",
        amount: 149.99,
        gateway_txn: "TXN_20240513_001",
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      user_id: organizerUser.id,
      event_code: "BUS-001", // EVENT_CREATED
      severity_level: "normal",
      action: "BUS",
      target_entity: "Event",
      target_id: event1.id,
      ip_address: "192.168.1.50",
      details: {
        description: "New Event successfully created by an Organizer.",
        event_name: "Tech Conference 2024",
      },
    },
  });

  console.log("✅ Created 3 audit logs");

  console.log("\n✨ Database seed completed successfully!");
  console.log(`
📊 Summary:
  - 4 Users (1 admin, 1 organizer, 2 regular)
  - 2 Events
  - 3 Ticket Types
  - 2 Giftcodes
  - 2 Purchases
  - 3 Tickets
  - 1 Giftcode Redemption
  - 1 Waiting List Entry
  - 3 Audit Logs
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
