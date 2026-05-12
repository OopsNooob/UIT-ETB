export const SeverityLevel = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  CRITICAL: "CRITICAL",
} as const;

export const AuditEvent = {
  SECURITY: {
    UNAUTHORIZED_ACCESS_ATTEMPT: {
      code: "SEC-001",
      description:
        "Unauthorized access attempt blocked by Auth Middleware (Missing/Invalid JWT).",
    },
    INSUFFICIENT_ROLE_ACCESS: {
      code: "SEC-002",
      description:
        "User attempted to access a restricted API endpoint without the required role (Caught by RoleGuard).",
    },
    INVALID_SESSION: {
      code: "SEC-003",
      description: "Invalid or expired authentication session detected.",
    },
    ROLE_SWITCHED: {
      code: "SEC-004",
      description:
        "User successfully switched role from User to Organizer via Account Settings.",
    },
    BRUTE_FORCE_ATTEMPT: {
      code: "SEC-005",
      description:
        "Multiple failed login attempts detected (Potential Brute-force blocked by Rate Limiter).",
    },
    PASSWORD_RESET: {
      code: "SEC-006",
      description:
        "Password reset workflow initiated or successfully completed.",
    },
    USER_REGISTERED: {
      code: "SEC-007",
      description: "User successfully registered a new account.",
    },
  },

  BUSINESS: {
    EVENT_CREATED: {
      code: "BUS-001",
      description: "New Event successfully created by an Organizer.",
    },
    EVENT_UPDATE_FAILED: {
      code: "BUS-002",
      description:
        "Event update failed due to validation constraints (Caught by Zod/Validation Utils).",
    },
    TICKET_INVENTORY_MUTATED: {
      code: "BUS-003",
      description:
        "Ticket inventory mutation completed: Quantity successfully deducted with pessimistic lock (SELECT FOR UPDATE).",
    },
    TICKET_DELETION_BLOCKED: {
      code: "BUS-004",
      description:
        "Ticket deletion blocked: The ticket tier already has existing purchases.",
    },
    USER_ADDED_TO_WAITING_LIST: {
      code: "BUS-005",
      description:
        "User successfully added to the Waiting List queue (Stored in Redis ZSET).",
    },
    WAITING_LIST_OFFER_EXPIRED: {
      code: "BUS-006",
      description:
        "User Waiting List offer expired: Slot passed to the next user in queue.",
    },
    DB_BATCH_INSERTION: {
      code: "BUS-007",
      description:
        "Database batch insertion executed: Large volume of tickets/giftcodes generated.",
    },
    PAYMENT_CAPTURED: {
      code: "BUS-008",
      description: "Payment transaction successfully captured and verified.",
    },
    PAYMENT_FAILED: {
      code: "BUS-009",
      description:
        "Payment intent failed or rejected by the payment gateway (e.g., insufficient funds).",
    },
    TICKET_REFUNDED: {
      code: "BUS-010",
      description:
        "Ticket refund successfully processed and inventory restored.",
    },
    GIFTCODE_APPLIED: {
      code: "BUS-011",
      description:
        "User successfully applied and consumed an active Giftcode during checkout.",
    },
    EVENT_CANCELLED: {
      code: "BUS-012",
      description:
        "Event successfully cancelled by Organizer. All related tickets marked for refund.",
    },
    TICKET_CHECKED_IN: {
      code: "BUS-013",
      description: "Ticket successfully checked-in.",
    },
    TICKET_CHECK_IN_FAILED: {
      code: "BUS-014",
      description:
        "Ticket check-in failed (Invalid, expired, or already used QR code).",
    },
  },

  SYSTEM: {
    BACKGROUND_WORKER_EXECUTED: {
      code: "SYS-001",
      description:
        "RabbitMQ Background Worker executed: Expired giftcodes/offers successfully cleaned up.",
    },
    NOTIFICATION_DISPATCHED: {
      code: "SYS-002",
      description:
        "RabbitMQ Worker: Notification email containing QR ticket successfully dispatched.",
    },
    UNHANDLED_ERROR: {
      code: "SYS-003",
      description:
        "Global Exception Handler triggered: Unhandled server error caught, masked, and logged.",
    },
    DB_CONNECTION_STATUS_CHANGED: {
      code: "SYS-004",
      description:
        "Connection lost or successfully reconnected to PostgreSQL Database / Redis Cluster.",
    },
    THIRD_PARTY_API_FAILURE: {
      code: "SYS-005",
      description:
        "Third-party API timeout/failure detected (e.g., SMTP Provider unresponsive).",
    },
  },
} as const;
