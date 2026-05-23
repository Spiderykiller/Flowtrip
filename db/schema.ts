// src/db/schema.ts
import { pgTable, text, timestamp, jsonb, boolean, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Base44 user ID
  email: text('email').notNull().unique(),
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  // Preferences
  preferred_travel_style: text('preferred_travel_style'), // 'adventure' | 'luxury' | 'budget' | 'cultural'
  preferred_climate: text('preferred_climate'),           // 'tropical' | 'cold' | 'temperate' | 'desert'
  currency: text('currency').default('USD'),
  // Notifications
  email_notifications: boolean('email_notifications').default(true),
  trip_reminders: boolean('trip_reminders').default(true),
  // Timestamps
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const saved_trips = pgTable('saved_trips', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  destination: text('destination').notNull(),
  cover_image_url: text('cover_image_url'),
  duration_days: text('duration_days'),
  budget: text('budget'),
  itinerary: jsonb('itinerary'), // full AI-generated itinerary JSON
  notes: text('notes'),
  is_public: boolean('is_public').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const trip_history = pgTable('trip_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  destination: text('destination').notNull(),
  query: text('query'), // the original prompt the user typed
  ai_provider: text('ai_provider'), // 'gemini' | 'groq'
  viewed_at: timestamp('viewed_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SavedTrip = typeof saved_trips.$inferSelect;
export type NewSavedTrip = typeof saved_trips.$inferInsert;
export type TripHistory = typeof trip_history.$inferSelect;