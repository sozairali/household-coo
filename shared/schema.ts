import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep existing users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Task management tables for household COO
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  sourceType: text("source_type").notNull(), // 'gmail' | 'whatsapp'
  receivedAt: timestamp("received_at").notNull(),
  dueAt: timestamp("due_at"),
  savingsUsd: real("savings_usd"),
  importance: integer("importance").notNull().default(0),
  urgency: integer("urgency").notNull().default(0),
  savingsScore: integer("savings_score").notNull().default(0),
  status: text("status").notNull().default('open'), // 'open' | 'done' | 'dismissed'
});

export const budgetTransactions = pgTable("budget_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'add' | 'spend'
  amountUsd: real("amount_usd").notNull(),
  ts: timestamp("ts").notNull().default(sql`now()`),
  note: text("note"),
});

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").notNull(),
  dimension: text("dimension").notNull(), // 'importance' | 'urgency' | 'savings'
  signal: integer("signal").notNull(), // 1 | -1
  ts: timestamp("ts").notNull().default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

export const insertBudgetTransactionSchema = createInsertSchema(budgetTransactions).omit({
  id: true,
  ts: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  ts: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type BudgetTransaction = typeof budgetTransactions.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertBudgetTransaction = z.infer<typeof insertBudgetTransactionSchema>;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
