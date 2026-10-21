import { createInsertSchema } from "drizzle-zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const guestWishesTable = pgTable("guest_wishes", {
  id: serial("id").primaryKey(),
  invitationId: text("invitation_id")
    .notNull()
    .default("ubaid-zaib-walima-2026"),
  guestName: text("guest_name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertGuestWishSchema = createInsertSchema(guestWishesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertGuestWish = z.infer<typeof insertGuestWishSchema>;
export type GuestWish = typeof guestWishesTable.$inferSelect;
