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
  mlsNumber: text("mls_number").unique(), // Hawaii MLS listing number
  listingAgent: text("listing_agent"),
  sqft: integer("sqft"), // Alternative field name for compatibility
  coordinates: text("coordinates"), // "lat,lng" format
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

// REVOLUTIONARY CLIENT MANAGEMENT - Beyond OpenAI's basic features
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
  tags: json("tags").$type<string[]>().default([]), // 'Hot Lead', 'Investor', 'Cash Buyer', 'Celebrity'
  priority: integer("priority").default(3), // 1-5 priority score
  buyerType: text("buyer_type"), // 'primary', 'investment', 'vacation', 'relocation'
  timeframe: text("timeframe"), // 'immediate', '3_months', '6_months', '1_year'
  preApprovalAmount: decimal("pre_approval_amount", { precision: 12, scale: 2 }),
  currentProperty: text("current_property"),
  notes: text("notes"),
  aiPersonalityProfile: json("ai_personality_profile").$type<{
    communicationStyle?: string;
    decisionMakingSpeed?: string;
    priceFlexibility?: string;
    interestAreas?: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AGENT MANAGEMENT - Multi-agent CRM capabilities
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  licenseNumber: text("license_number"),
  role: text("role").default("agent"), // 'agent', 'broker', 'admin', 'assistant'
  teamId: integer("team_id"),
  specialties: json("specialties").$type<string[]>().default([]),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  profileImage: text("profile_image"),
  bio: text("bio"),
  achievements: json("achievements").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// APPOINTMENTS & SCHEDULING - Advanced calendar management
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  agentId: integer("agent_id").references(() => agents.id),
  propertyId: integer("property_id").references(() => properties.id),
  type: text("type").notNull(), // 'showing', 'consultation', 'signing', 'open_house'
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").default(60), // minutes
  status: text("status").default("scheduled"), // 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
  location: text("location"),
  meetingLink: text("meeting_link"),
  notes: text("notes"),
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CONTRACTS & OFFERS - Digital transaction management
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  buyerLeadId: integer("buyer_lead_id").references(() => leads.id),
  sellerLeadId: integer("seller_lead_id").references(() => leads.id),
  agentId: integer("agent_id").references(() => agents.id),
  offerAmount: decimal("offer_amount", { precision: 12, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'purchase', 'lease', 'option'
  status: text("status").default("draft"), // 'draft', 'pending', 'counter', 'accepted', 'rejected', 'closed'
  contingencies: json("contingencies").$type<{
    financing?: boolean;
    inspection?: boolean;
    appraisal?: boolean;
    saleOfProperty?: boolean;
  }>(),
  closeDate: timestamp("close_date"),
  earnestMoney: decimal("earnest_money", { precision: 12, scale: 2 }),
  terms: text("terms"),
  documents: json("documents").$type<Array<{
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>>().default([]),
  signatures: json("signatures").$type<Array<{
    party: string;
    signedAt: string;
    ipAddress: string;
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// COMMISSIONS & PAYMENTS - Financial tracking
export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").references(() => contracts.id),
  agentId: integer("agent_id").references(() => agents.id),
  salePrice: decimal("sale_price", { precision: 12, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  grossCommission: decimal("gross_commission", { precision: 12, scale: 2 }).notNull(),
  brokerageSplit: decimal("brokerage_split", { precision: 5, scale: 2 }).notNull(),
  netCommission: decimal("net_commission", { precision: 12, scale: 2 }).notNull(),
  referralFees: decimal("referral_fees", { precision: 12, scale: 2 }).default(0),
  status: text("status").default("pending"), // 'pending', 'paid', 'held'
  paidDate: timestamp("paid_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// MARKETING CAMPAIGNS - Automated marketing workflows
export const marketingCampaigns = pgTable("marketing_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'listing_announcement', 'lead_nurture', 'follow_up', 'neighborhood_report'
  agentId: integer("agent_id").references(() => agents.id),
  propertyId: integer("property_id").references(() => properties.id),
  targetAudience: json("target_audience").$type<{
    leadTags?: string[];
    priceRange?: { min: number; max: number };
    location?: string;
    buyerType?: string;
  }>(),
  emailTemplate: text("email_template"),
  smsTemplate: text("sms_template"),
  schedule: json("schedule").$type<{
    frequency: string;
    dayOfWeek?: number;
    timeOfDay?: string;
    endDate?: string;
  }>(),
  status: text("status").default("draft"), // 'draft', 'active', 'paused', 'completed'
  analytics: json("analytics").$type<{
    sent: number;
    opened: number;
    clicked: number;
    responded: number;
  }>().default({ sent: 0, opened: 0, clicked: 0, responded: 0 }),
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

// Market Value Predictions table
export const marketPredictions = pgTable("market_predictions", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  address: text("address").notNull(),
  predictedValue: decimal("predicted_value", { precision: 12, scale: 2 }).notNull(),
  currentMarketValue: decimal("current_market_value", { precision: 12, scale: 2 }).notNull(),
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }).notNull(), // 0.00 to 1.00
  factors: json("factors").$type<{
    comparableProperties: Array<{
      mlsNumber: string;
      price: number;
      pricePerSqFt: number;
      distance: number;
      similarity: number;
    }>;
    marketTrends: {
      priceAppreciation: number;
      daysOnMarket: number;
      demandIndex: number;
    };
    propertyFeatures: {
      locationScore: number;
      conditionScore: number;
      amenityScore: number;
      viewScore: number;
    };
    adjustments: Array<{
      factor: string;
      adjustment: number;
      reason: string;
    }>;
  }>().notNull(),
  methodology: text("methodology").notNull(),
  predictions: json("predictions").$type<{
    sixMonths: number;
    oneYear: number;
    threeYears: number;
    fiveYears: number;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Home Valuation Requests table
export const homeValuations = pgTable("home_valuations", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  address: text("address").notNull(),
  city: text("city").notNull(),
  zipCode: text("zip_code").notNull(),
  propertyType: text("property_type").notNull(),
  squareFeet: integer("square_feet"),
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  yearBuilt: integer("year_built"),
  lotSize: decimal("lot_size", { precision: 8, scale: 2 }),
  condition: text("condition"), // 'excellent', 'good', 'fair', 'poor'
  upgrades: json("upgrades").$type<string[]>().default([]),
  amenities: json("amenities").$type<string[]>().default([]),
  estimatedValue: decimal("estimated_value", { precision: 12, scale: 2 }),
  valueRange: json("value_range").$type<{
    low: number;
    high: number;
  }>(),
  marketAnalysis: json("market_analysis").$type<{
    comparables: Array<{
      address: string;
      price: number;
      squareFeet: number;
      pricePerSqFt: number;
      distance: number;
    }>;
    marketConditions: string;
    recommendedListPrice: number;
    timeToSell: string;
  }>(),
  status: text("status").default("pending"), // 'pending', 'completed', 'scheduled_visit'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Open Houses table
export const openHouses = pgTable("open_houses", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  mlsNumber: text("mls_number"),
  title: text("title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").default("HI"),
  zipCode: text("zip_code"),
  price: decimal("price", { precision: 12, scale: 2 }),
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  squareFeet: integer("square_feet"),
  lotSize: decimal("lot_size", { precision: 8, scale: 2 }),
  propertyType: text("property_type"),
  dateTime: timestamp("date_time").notNull(),
  endTime: timestamp("end_time"),
  hostAgent: text("host_agent"),
  hostPhone: text("host_phone"),
  hostEmail: text("host_email"),
  description: text("description"),
  images: json("images").$type<string[]>().default([]),
  source: text("source").default("HBR"), // Hawaii Board of Realtors
  sourceUrl: text("source_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ADVANCED RELATIONS - Enterprise-grade data relationships
export const propertiesRelations = relations(properties, ({ many }) => ({
  inquiries: many(propertyInquiries),
  appointments: many(appointments),
  contracts: many(contracts),
  marketingCampaigns: many(marketingCampaigns),
}));

export const leadsRelations = relations(leads, ({ many, one }) => ({
  inquiries: many(propertyInquiries),
  conversations: many(chatConversations),
  appointments: many(appointments),
  contractsAsBuyer: many(contracts, { relationName: "buyer" }),
  contractsAsSeller: many(contracts, { relationName: "seller" }),
}));

export const agentsRelations = relations(agents, ({ many }) => ({
  appointments: many(appointments),
  contracts: many(contracts),
  commissions: many(commissions),
  marketingCampaigns: many(marketingCampaigns),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  lead: one(leads, {
    fields: [appointments.leadId],
    references: [leads.id],
  }),
  agent: one(agents, {
    fields: [appointments.agentId],
    references: [agents.id],
  }),
  property: one(properties, {
    fields: [appointments.propertyId],
    references: [properties.id],
  }),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  property: one(properties, {
    fields: [contracts.propertyId],
    references: [properties.id],
  }),
  buyerLead: one(leads, {
    fields: [contracts.buyerLeadId],
    references: [leads.id],
    relationName: "buyer",
  }),
  sellerLead: one(leads, {
    fields: [contracts.sellerLeadId],
    references: [leads.id],
    relationName: "seller",
  }),
  agent: one(agents, {
    fields: [contracts.agentId],
    references: [agents.id],
  }),
  commission: one(commissions),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  contract: one(contracts, {
    fields: [commissions.contractId],
    references: [contracts.id],
  }),
  agent: one(agents, {
    fields: [commissions.agentId],
    references: [agents.id],
  }),
}));

export const marketingCampaignsRelations = relations(marketingCampaigns, ({ one }) => ({
  agent: one(agents, {
    fields: [marketingCampaigns.agentId],
    references: [agents.id],
  }),
  property: one(properties, {
    fields: [marketingCampaigns.propertyId],
    references: [properties.id],
  }),
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

// REVOLUTIONARY CRM INSERT SCHEMAS
export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  scheduledDate: z.coerce.date()
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommissionSchema = createInsertSchema(commissions).omit({
  id: true,
  createdAt: true,
});

export const insertMarketingCampaignSchema = createInsertSchema(marketingCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHomeValuationSchema = createInsertSchema(homeValuations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketPredictionSchema = createInsertSchema(marketPredictions).omit({
  id: true,
  createdAt: true,
});

export const insertOpenHouseSchema = createInsertSchema(openHouses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// COMPREHENSIVE TYPE DEFINITIONS
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

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type Commission = typeof commissions.$inferSelect;
export type InsertCommission = z.infer<typeof insertCommissionSchema>;

export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type InsertMarketingCampaign = z.infer<typeof insertMarketingCampaignSchema>;

export type HomeValuation = typeof homeValuations.$inferSelect;
export type InsertHomeValuation = z.infer<typeof insertHomeValuationSchema>;

export type MarketPrediction = typeof marketPredictions.$inferSelect;
export type InsertMarketPrediction = z.infer<typeof insertMarketPredictionSchema>;

export type OpenHouse = typeof openHouses.$inferSelect;
export type InsertOpenHouse = z.infer<typeof insertOpenHouseSchema>;
