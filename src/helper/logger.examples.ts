/**
 * EXAMPLES: How to use LoggerHelper with various events
 */

import { Request, Response } from "express";
import { SafeLoggingService } from "../services/safe-logging.service";
import { LoggerHelper } from "./logger.helper";
import { AuditEvent } from "./audit-log.constants";

// ==================== SECURITY EVENTS ====================

// 1. User Registration
const loggingService = new SafeLoggingService();

// Example: In Auth Controller
async function exampleRegister(req: Request, userId: string) {
  const log = LoggerHelper.createLogPayload(
    req,
    AuditEvent.SECURITY.USER_REGISTERED,
    userId,
  );
  loggingService.logFire(log); // Non-blocking
}

// 2. User Login
async function exampleLogin(req: Request, userId: string) {
  const log = LoggerHelper.createLogPayload(
    req,
    AuditEvent.SECURITY.USER_LOGIN,
    userId,
  );
  loggingService.logFire(log);
}

// 3. Role Switch
async function exampleRoleSwitch(req: Request, userId: string) {
  const log = LoggerHelper.createLogPayload(
    req,
    AuditEvent.SECURITY.ROLE_SWITCHED,
    userId,
    { action: "Switch Role from User to Organizer" }, // Override action
  );
  loggingService.logFire(log);
}

// ==================== BUSINESS EVENTS ====================

// 1. Event Created
async function exampleEventCreated(req: Request, userId: string) {
  const log = LoggerHelper.createLogPayload(
    req,
    AuditEvent.BUSINESS.EVENT_CREATED,
    userId,
    { targetEntity: "Event", targetId: "event-123" }, // Specify the target
  );
  loggingService.logFire(log);
}

// 2. Payment Captured
async function examplePaymentCaptured(req: Request, userId: string) {
  const log = LoggerHelper.createLogPayload(
    req,
    AuditEvent.BUSINESS.PAYMENT_CAPTURED,
    userId,
    { targetEntity: "Transaction", targetId: "txn-456" },
  );
  loggingService.logFire(log);
}

// 3. Ticket Check-in
async function exampleTicketCheckIn(req: Request, userId: string) {
  const log = LoggerHelper.createLogPayload(
    req,
    AuditEvent.BUSINESS.TICKET_CHECKED_IN,
    userId,
    { targetEntity: "Ticket", targetId: "ticket-789" },
  );
  loggingService.logFire(log);
}

// ==================== SYSTEM EVENTS ====================

// Database connection recovered
async function exampleDBReconnected(req: Request) {
  const log = LoggerHelper.createLogPayload(
    req,
    AuditEvent.SYSTEM.DB_CONNECTION_STATUS_CHANGED,
    undefined, // System event - no user
  );
  loggingService.logFire(log);
}

// ==================== CUSTOM BUSINESS EVENTS ====================

// For business events not in constants
async function exampleCustomEvent(
  req: Request,
  userId: string,
  eventCode: string,
  description: string,
  targetEntity: string,
  targetId: string,
) {
  const log = LoggerHelper.createBusinessLog(
    req,
    eventCode,
    description,
    userId,
    targetEntity,
    targetId,
  );
  loggingService.logFire(log);
}

// Example: Refund processed
async function exampleRefund(req: Request, userId: string, ticketId: string) {
  const log = LoggerHelper.createBusinessLog(
    req,
    "REFUND-001",
    "Ticket refund processed",
    userId,
    "Refund",
    ticketId,
  );
  loggingService.logFire(log);
}

export {
  exampleRegister,
  exampleLogin,
  exampleEventCreated,
  examplePaymentCaptured,
  exampleTicketCheckIn,
  exampleDBReconnected,
  exampleCustomEvent,
  exampleRefund,
};
