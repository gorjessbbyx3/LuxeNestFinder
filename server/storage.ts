import { 
  properties, 
  neighborhoods, 
  leads, 
  propertyInquiries, 
  chatConversations,
  type Property, 
  type InsertProperty,
  type Neighborhood,
  type InsertNeighborhood,
  type Lead,
  type InsertLead,
  type PropertyInquiry,
  type InsertPropertyInquiry,
  type ChatConversation,
  type InsertChatConversation
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, between, ilike } from "drizzle-orm";

export interface IStorage {
  // Properties
  getProperties(filters?: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    propertyType?: string;
    city?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property>;
  
  // Neighborhoods
  getNeighborhoods(): Promise<Neighborhood[]>;
  getNeighborhood(id: number): Promise<Neighborhood | undefined>;
  createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood>;
  
  // Leads
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead>;
  
  // Property Inquiries
  createPropertyInquiry(inquiry: InsertPropertyInquiry): Promise<PropertyInquiry>;
  getPropertyInquiries(propertyId?: number, leadId?: number): Promise<PropertyInquiry[]>;
  updatePropertyInquiry(id: number, inquiry: Partial<InsertPropertyInquiry>): Promise<PropertyInquiry>;
  
  // Chat Conversations
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatConversation(id: number): Promise<ChatConversation | undefined>;
  updateChatConversation(id: number, conversation: Partial<InsertChatConversation>): Promise<ChatConversation>;
  
  // Search
  searchProperties(query: string): Promise<Property[]>;
}

export class DatabaseStorage implements IStorage {
  // Properties
  async getProperties(filters: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    propertyType?: string;
    city?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<Property[]> {
    let query = db.select().from(properties);
    
    const conditions = [];
    
    if (filters.minPrice) {
      conditions.push(sql`${properties.price} >= ${filters.minPrice}`);
    }
    if (filters.maxPrice) {
      conditions.push(sql`${properties.price} <= ${filters.maxPrice}`);
    }
    if (filters.bedrooms) {
      conditions.push(eq(properties.bedrooms, filters.bedrooms));
    }
    if (filters.propertyType) {
      conditions.push(eq(properties.propertyType, filters.propertyType));
    }
    if (filters.city) {
      conditions.push(ilike(properties.city, `%${filters.city}%`));
    }
    if (filters.featured !== undefined) {
      conditions.push(eq(properties.featured, filters.featured));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    query = query.orderBy(desc(properties.featured), desc(properties.createdAt)) as any;
    
    if (filters.limit) {
      query = query.limit(filters.limit) as any;
    }
    if (filters.offset) {
      query = query.offset(filters.offset) as any;
    }
    
    return await query;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  // Neighborhoods
  async getNeighborhoods(): Promise<Neighborhood[]> {
    return await db.select().from(neighborhoods).orderBy(asc(neighborhoods.name));
  }

  async getNeighborhood(id: number): Promise<Neighborhood | undefined> {
    const [neighborhood] = await db.select().from(neighborhoods).where(eq(neighborhoods.id, id));
    return neighborhood;
  }

  async createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood> {
    const [newNeighborhood] = await db.insert(neighborhoods).values(neighborhood).returning();
    return newNeighborhood;
  }

  // Leads
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead> {
    const [updatedLead] = await db
      .update(leads)
      .set({ ...lead, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return updatedLead;
  }

  // Property Inquiries
  async createPropertyInquiry(inquiry: InsertPropertyInquiry): Promise<PropertyInquiry> {
    const [newInquiry] = await db.insert(propertyInquiries).values(inquiry).returning();
    return newInquiry;
  }

  async getPropertyInquiries(propertyId?: number, leadId?: number): Promise<PropertyInquiry[]> {
    let query = db.select().from(propertyInquiries);
    
    const conditions = [];
    if (propertyId) conditions.push(eq(propertyInquiries.propertyId, propertyId));
    if (leadId) conditions.push(eq(propertyInquiries.leadId, leadId));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(propertyInquiries.createdAt));
  }

  async updatePropertyInquiry(id: number, inquiry: Partial<InsertPropertyInquiry>): Promise<PropertyInquiry> {
    const [updatedInquiry] = await db
      .update(propertyInquiries)
      .set(inquiry)
      .where(eq(propertyInquiries.id, id))
      .returning();
    return updatedInquiry;
  }

  // Chat Conversations
  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const [newConversation] = await db.insert(chatConversations).values(conversation).returning();
    return newConversation;
  }

  async getChatConversation(id: number): Promise<ChatConversation | undefined> {
    const [conversation] = await db.select().from(chatConversations).where(eq(chatConversations.id, id));
    return conversation;
  }

  async updateChatConversation(id: number, conversation: Partial<InsertChatConversation>): Promise<ChatConversation> {
    const [updatedConversation] = await db
      .update(chatConversations)
      .set({ ...conversation, updatedAt: new Date() })
      .where(eq(chatConversations.id, id))
      .returning();
    return updatedConversation;
  }

  // Search
  async searchProperties(query: string): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(
        sql`to_tsvector('english', ${properties.title} || ' ' || ${properties.description} || ' ' || ${properties.address} || ' ' || ${properties.city} || ' ' || ${properties.neighborhood}) @@ plainto_tsquery('english', ${query})`
      )
      .orderBy(desc(properties.featured), desc(properties.createdAt));
  }
}

export const storage = new DatabaseStorage();
