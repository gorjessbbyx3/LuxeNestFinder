import { pgTable, text, serial, integer, boolean, decimal, timestamp, json, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }).notNull(),
  squareFeet: integer("square_feet").notNull(),
  lotSize: decimal("lot_size", { precision: 8, scale: 2 }),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  propertyType: text("property_type").notNull(), // 'estate', 'condo', 'villa', 'land'
  status: text("status").notNull().default("active"), // 'active', 'pending', 'sold'
  featured: boolean("featured").default(false),
  virtualTourUrl: text("virtual_tour_url"),
  images: json("images").$type<string[]>().default([]),
  amenities: json("amenities").$type<string[]>().default([]),
  neighborhood: text("neighborhood"),
  yearBuilt: integer("year_built"),
  pricePerSqFt: decimal("price_per_sq_ft", { precision: 8, scale: 2 }),
  hoaFees: decimal("hoa_fees", { precision: 8, scale: 2 }),
  propertyTaxes: decimal("property_taxes", { precision: 8, scale: 2 }),
  aiLifestyleScore: integer("ai_lifestyle_score"), // 1-100 AI compatibility score
  investmentScore: integer("investment_score"), // 1-100 investment potential
  marketValueScore: integer("market_value_score"), // 1-100 market value score
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Neighborhoods table
export const neighborhoods = pgTable("neighborhoods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  description: text("description"),
  averagePrice: decimal("average_price", { precision: 12, scale: 2 }),
  safetyScore: decimal("safety_score", { precision: 3, scale: 1 }),
  schoolRating: decimal("school_rating", { precision: 3, scale: 1 }),
  walkabilityScore: decimal("walkability_score", { precision: 3, scale: 1 }),
  luxuryScore: decimal("luxury_score", { precision: 3, scale: 1 }),
  investmentGrowth: decimal("investment_growth", { precision: 5, scale: 2 }),
  popularSpots: json("popular_spots").$type<string[]>().default([]),
  amenities: json("amenities").$type<string[]>().default([]),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leads table for contact management
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  interests: json("interests").$type<string[]>().default([]),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  propertyType: text("property_type"),
  lifestyle: json("lifestyle").$type<{
    familySize?: string;
    workFromHome?: boolean;
    oceanActivities?: boolean;
    nightlife?: boolean;
    nature?: boolean;
    golf?: boolean;
    privacy?: boolean;
  }>(),
  source: text("source").default("website"), // 'website', 'ai_chat', 'virtual_tour'
  status: text("status").default("new"), // 'new', 'contacted', 'qualified', 'converted'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property inquiries/bookings
export const propertyInquiries = pgTable("property_inquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  leadId: integer("lead_id").references(() => leads.id),
  inquiryType: text("inquiry_type").notNull(), // 'viewing', 'info_request', 'virtual_tour'
  scheduledDate: timestamp("scheduled_date"),
  message: text("message"),
  status: text("status").default("pending"), // 'pending', 'confirmed', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
});

// AI chat conversations
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  messages: json("messages").$type<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>>().default([]),
  preferences: json("preferences").$type<{
    propertyType?: string;
    priceRange?: { min: number; max: number };
    location?: string;
    lifestyle?: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const propertiesRelations = relations(properties, ({ many }) => ({
  inquiries: many(propertyInquiries),
}));

export const leadsRelations = relations(leads, ({ many }) => ({
  inquiries: many(propertyInquiries),
  conversations: many(chatConversations),
}));

export const propertyInquiriesRelations = relations(propertyInquiries, ({ one }) => ({
  property: one(properties, {
    fields: [propertyInquiries.propertyId],
    references: [properties.id],
  }),
  lead: one(leads, {
    fields: [propertyInquiries.leadId],
    references: [leads.id],
  }),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one }) => ({
  lead: one(leads, {
    fields: [chatConversations.leadId],
    references: [leads.id],
  }),
}));

// Insert schemas
export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNeighborhoodSchema = createInsertSchema(neighborhoods).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyInquirySchema = createInsertSchema(propertyInquiries).omit({
  id: true,
  createdAt: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Neighborhood = typeof neighborhoods.$inferSelect;
export type InsertNeighborhood = z.infer<typeof insertNeighborhoodSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type PropertyInquiry = typeof propertyInquiries.$inferSelect;
export type InsertPropertyInquiry = z.infer<typeof insertPropertyInquirySchema>;

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
