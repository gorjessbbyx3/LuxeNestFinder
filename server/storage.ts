import { 
  properties, 
  neighborhoods, 
  leads, 
  propertyInquiries, 
  chatConversations,
  agents,
  appointments,
  contracts,
  commissions,
  marketingCampaigns,
  type Property, 
  type InsertProperty,
  type Neighborhood,
  type InsertNeighborhood,
  type Lead,
  type InsertLead,
  type PropertyInquiry,
  type InsertPropertyInquiry,
  type ChatConversation,
  type InsertChatConversation,
  type Agent,
  type InsertAgent,
  type Appointment,
  type InsertAppointment,
  type Contract,
  type InsertContract,
  type Commission,
  type InsertCommission,
  type MarketingCampaign,
  type InsertMarketingCampaign
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
  
  // REVOLUTIONARY CRM CAPABILITIES - Beyond OpenAI's basic functions
  
  // Advanced Lead Management
  getLeads(filters?: {
    status?: string;
    priority?: number;
    buyerType?: string;
    timeframe?: string;
    minBudget?: number;
    maxBudget?: number;
    tags?: string[];
    agentId?: number;
    limit?: number;
    offset?: number;
  }): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead>;
  
  // Agent Management
  getAgents(filters?: { role?: string; teamId?: number; isActive?: boolean }): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent>;
  
  // Appointment Scheduling
  getAppointments(filters?: {
    agentId?: number;
    leadId?: number;
    propertyId?: number;
    type?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  
  // Contract & Offer Management
  getContracts(filters?: {
    agentId?: number;
    propertyId?: number;
    status?: string;
    type?: string;
  }): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract>;
  
  // Commission Tracking
  getCommissions(filters?: { agentId?: number; status?: string }): Promise<Commission[]>;
  createCommission(commission: InsertCommission): Promise<Commission>;
  updateCommission(id: number, commission: Partial<InsertCommission>): Promise<Commission>;
  
  // Marketing Automation
  getMarketingCampaigns(filters?: { agentId?: number; status?: string; type?: string }): Promise<MarketingCampaign[]>;
  createMarketingCampaign(campaign: InsertMarketingCampaign): Promise<MarketingCampaign>;
  updateMarketingCampaign(id: number, campaign: Partial<InsertMarketingCampaign>): Promise<MarketingCampaign>;
  
  // Property Inquiries
  createPropertyInquiry(inquiry: InsertPropertyInquiry): Promise<PropertyInquiry>;
  getPropertyInquiries(propertyId?: number, leadId?: number): Promise<PropertyInquiry[]>;
  updatePropertyInquiry(id: number, inquiry: Partial<InsertPropertyInquiry>): Promise<PropertyInquiry>;
  
  // Chat Conversations
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatConversation(id: number): Promise<ChatConversation | undefined>;
  updateChatConversation(id: number, conversation: Partial<InsertChatConversation>): Promise<ChatConversation>;
  
  // Advanced Analytics
  getAgentPerformance(agentId: number, dateFrom?: Date, dateTo?: Date): Promise<{
    totalLeads: number;
    convertedLeads: number;
    totalCommissions: number;
    avgDealSize: number;
    appointmentsBooked: number;
    appointmentsCompleted: number;
  }>;
  
  // Search
  searchProperties(query: string): Promise<Property[]>;
  searchLeads(query: string): Promise<Lead[]>;
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

  // REVOLUTIONARY CRM IMPLEMENTATIONS - Enterprise-grade functionality

  async getLeads(filters?: {
    status?: string;
    priority?: number;
    buyerType?: string;
    timeframe?: string;
    minBudget?: number;
    maxBudget?: number;
    tags?: string[];
    agentId?: number;
    limit?: number;
    offset?: number;
  }): Promise<Lead[]> {
    let query = db.select().from(leads);
    const conditions: any[] = [];

    if (filters?.status) conditions.push(eq(leads.status, filters.status));
    if (filters?.priority) conditions.push(eq(leads.priority, filters.priority));
    if (filters?.buyerType) conditions.push(eq(leads.buyerType, filters.buyerType));
    if (filters?.timeframe) conditions.push(eq(leads.timeframe, filters.timeframe));
    if (filters?.minBudget) conditions.push(sql`${leads.budget} >= ${filters.minBudget}`);
    if (filters?.maxBudget) conditions.push(sql`${leads.budget} <= ${filters.maxBudget}`);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query
      .orderBy(desc(leads.priority), desc(leads.createdAt))
      .limit(filters?.limit || 50)
      .offset(filters?.offset || 0);
  }

  async getAgents(filters?: { role?: string; teamId?: number; isActive?: boolean }): Promise<Agent[]> {
    let query = db.select().from(agents);
    const conditions: any[] = [];

    if (filters?.role) conditions.push(eq(agents.role, filters.role));
    if (filters?.teamId) conditions.push(eq(agents.teamId, filters.teamId));
    if (filters?.isActive !== undefined) conditions.push(eq(agents.isActive, filters.isActive));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(asc(agents.firstName));
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const [newAgent] = await db.insert(agents).values(agent).returning();
    return newAgent;
  }

  async updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent> {
    const [updatedAgent] = await db
      .update(agents)
      .set({ ...agent, updatedAt: new Date() })
      .where(eq(agents.id, id))
      .returning();
    return updatedAgent;
  }

  async getAppointments(filters?: {
    agentId?: number;
    leadId?: number;
    propertyId?: number;
    type?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Appointment[]> {
    let query = db.select().from(appointments);
    const conditions: any[] = [];

    if (filters?.agentId) conditions.push(eq(appointments.agentId, filters.agentId));
    if (filters?.leadId) conditions.push(eq(appointments.leadId, filters.leadId));
    if (filters?.propertyId) conditions.push(eq(appointments.propertyId, filters.propertyId));
    if (filters?.type) conditions.push(eq(appointments.type, filters.type));
    if (filters?.status) conditions.push(eq(appointments.status, filters.status));
    if (filters?.dateFrom) conditions.push(sql`${appointments.scheduledDate} >= ${filters.dateFrom}`);
    if (filters?.dateTo) conditions.push(sql`${appointments.scheduledDate} <= ${filters.dateTo}`);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(asc(appointments.scheduledDate));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...appointment, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async getContracts(filters?: {
    agentId?: number;
    propertyId?: number;
    status?: string;
    type?: string;
  }): Promise<Contract[]> {
    let query = db.select().from(contracts);
    const conditions: any[] = [];

    if (filters?.agentId) conditions.push(eq(contracts.agentId, filters.agentId));
    if (filters?.propertyId) conditions.push(eq(contracts.propertyId, filters.propertyId));
    if (filters?.status) conditions.push(eq(contracts.status, filters.status));
    if (filters?.type) conditions.push(eq(contracts.type, filters.type));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(contracts.createdAt));
  }

  async createContract(contract: InsertContract): Promise<Contract> {
    const [newContract] = await db.insert(contracts).values(contract).returning();
    return newContract;
  }

  async updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract> {
    const [updatedContract] = await db
      .update(contracts)
      .set({ ...contract, updatedAt: new Date() })
      .where(eq(contracts.id, id))
      .returning();
    return updatedContract;
  }

  async getCommissions(filters?: { agentId?: number; status?: string }): Promise<Commission[]> {
    let query = db.select().from(commissions);
    const conditions: any[] = [];

    if (filters?.agentId) conditions.push(eq(commissions.agentId, filters.agentId));
    if (filters?.status) conditions.push(eq(commissions.status, filters.status));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(commissions.createdAt));
  }

  async createCommission(commission: InsertCommission): Promise<Commission> {
    const [newCommission] = await db.insert(commissions).values(commission).returning();
    return newCommission;
  }

  async updateCommission(id: number, commission: Partial<InsertCommission>): Promise<Commission> {
    const [updatedCommission] = await db
      .update(commissions)
      .set(commission)
      .where(eq(commissions.id, id))
      .returning();
    return updatedCommission;
  }

  async getMarketingCampaigns(filters?: { agentId?: number; status?: string; type?: string }): Promise<MarketingCampaign[]> {
    let query = db.select().from(marketingCampaigns);
    const conditions: any[] = [];

    if (filters?.agentId) conditions.push(eq(marketingCampaigns.agentId, filters.agentId));
    if (filters?.status) conditions.push(eq(marketingCampaigns.status, filters.status));
    if (filters?.type) conditions.push(eq(marketingCampaigns.type, filters.type));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(marketingCampaigns.createdAt));
  }

  async createMarketingCampaign(campaign: InsertMarketingCampaign): Promise<MarketingCampaign> {
    const [newCampaign] = await db.insert(marketingCampaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateMarketingCampaign(id: number, campaign: Partial<InsertMarketingCampaign>): Promise<MarketingCampaign> {
    const [updatedCampaign] = await db
      .update(marketingCampaigns)
      .set({ ...campaign, updatedAt: new Date() })
      .where(eq(marketingCampaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async getAgentPerformance(agentId: number, dateFrom?: Date, dateTo?: Date): Promise<{
    totalLeads: number;
    convertedLeads: number;
    totalCommissions: number;
    avgDealSize: number;
    appointmentsBooked: number;
    appointmentsCompleted: number;
  }> {
    const dateConditions = [];
    if (dateFrom) dateConditions.push(sql`created_at >= ${dateFrom}`);
    if (dateTo) dateConditions.push(sql`created_at <= ${dateTo}`);

    // Get total leads
    let leadsQuery = db.select({ count: sql<number>`count(*)` }).from(leads);
    if (dateConditions.length > 0) {
      leadsQuery = leadsQuery.where(and(...dateConditions));
    }
    const totalLeads = (await leadsQuery)[0]?.count || 0;

    // Get converted leads
    let convertedQuery = db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, 'converted'));
    if (dateConditions.length > 0) {
      convertedQuery = convertedQuery.where(and(...dateConditions));
    }
    const convertedLeads = (await convertedQuery)[0]?.count || 0;

    // Get commission data
    let commissionsQuery = db.select({
      total: sql<number>`sum(net_commission)`,
      count: sql<number>`count(*)`,
      avgDeal: sql<number>`avg(sale_price)`
    }).from(commissions).where(eq(commissions.agentId, agentId));
    if (dateConditions.length > 0) {
      commissionsQuery = commissionsQuery.where(and(...dateConditions));
    }
    const commissionData = (await commissionsQuery)[0];

    // Get appointment data
    let appointmentsQuery = db.select({
      total: sql<number>`count(*)`,
      completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`
    }).from(appointments).where(eq(appointments.agentId, agentId));
    if (dateConditions.length > 0) {
      appointmentsQuery = appointmentsQuery.where(and(...dateConditions));
    }
    const appointmentData = (await appointmentsQuery)[0];

    return {
      totalLeads,
      convertedLeads,
      totalCommissions: Number(commissionData?.total) || 0,
      avgDealSize: Number(commissionData?.avgDeal) || 0,
      appointmentsBooked: Number(appointmentData?.total) || 0,
      appointmentsCompleted: Number(appointmentData?.completed) || 0,
    };
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

  async searchLeads(query: string): Promise<Lead[]> {
    return await db
      .select()
      .from(leads)
      .where(
        sql`${leads.firstName} ILIKE ${'%' + query + '%'} 
            OR ${leads.lastName} ILIKE ${'%' + query + '%'}
            OR ${leads.email} ILIKE ${'%' + query + '%'}
            OR ${leads.phone} ILIKE ${'%' + query + '%'}`
      )
      .orderBy(desc(leads.priority), desc(leads.createdAt))
      .limit(20);
  }
}

export const storage = new DatabaseStorage();
