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
  homeValuations,
  marketPredictions,
  openHouses,
  tasks,
  communications,
  messageTemplates,
  automationRules,
  leadActivities,
  propertyFavorites,
  savedSearches,
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
  type InsertMarketingCampaign,
  type HomeValuation,
  type InsertHomeValuation,
  type MarketPrediction,
  type InsertMarketPrediction,
  type OpenHouse,
  type InsertOpenHouse,
  type Task,
  type InsertTask,
  type Communication,
  type InsertCommunication,
  type MessageTemplate,
  type InsertMessageTemplate,
  type AutomationRule,
  type InsertAutomationRule,
  type LeadActivity,
  type InsertLeadActivity,
  type PropertyFavorite,
  type InsertPropertyFavorite,
  type SavedSearch,
  type InsertSavedSearch
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
  getPropertyByMLSNumber(mlsNumber: string): Promise<Property | undefined>;
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
  
  // Home Valuations
  createHomeValuation(valuation: InsertHomeValuation): Promise<HomeValuation>;
  getHomeValuation(id: number): Promise<HomeValuation | undefined>;
  getHomeValuations(leadId?: number): Promise<HomeValuation[]>;
  updateHomeValuation(id: number, valuation: Partial<InsertHomeValuation>): Promise<HomeValuation>;
  
  // Market Predictions  
  createMarketPrediction(prediction: InsertMarketPrediction): Promise<MarketPrediction>;
  getMarketPrediction(id: number): Promise<MarketPrediction | undefined>;
  getMarketPredictions(propertyId?: number): Promise<MarketPrediction[]>;
  
  // Open Houses
  getOpenHouses(filters?: { active?: boolean; upcoming?: boolean }): Promise<OpenHouse[]>;
  createOpenHouse(openHouse: InsertOpenHouse): Promise<OpenHouse>;
  updateOpenHouse(id: number, openHouse: Partial<InsertOpenHouse>): Promise<OpenHouse>;
  
  // ADVANCED CRM AUTOMATION & WORKFLOW FEATURES
  
  // Task Management & Follow-ups
  getTasks(filters?: {
    leadId?: number;
    agentId?: number;
    propertyId?: number;
    type?: string;
    priority?: string;
    status?: string;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    automated?: boolean;
  }): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;
  getTask(id: number): Promise<Task | undefined>;
  completeTask(id: number, notes?: string): Promise<Task>;
  
  // Communication Tracking (Email, SMS, Calls)
  getCommunications(filters?: {
    leadId?: number;
    agentId?: number;
    type?: string;
    direction?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Communication[]>;
  createCommunication(communication: InsertCommunication): Promise<Communication>;
  updateCommunication(id: number, communication: Partial<InsertCommunication>): Promise<Communication>;
  markCommunicationRead(id: number): Promise<Communication>;
  trackCommunicationEvent(id: number, event: 'opened' | 'clicked' | 'replied'): Promise<Communication>;
  
  // Message Templates for Automation
  getMessageTemplates(filters?: {
    agentId?: number;
    type?: string;
    category?: string;
    isActive?: boolean;
  }): Promise<MessageTemplate[]>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  updateMessageTemplate(id: number, template: Partial<InsertMessageTemplate>): Promise<MessageTemplate>;
  getMessageTemplate(id: number): Promise<MessageTemplate | undefined>;
  incrementTemplateUsage(id: number): Promise<void>;
  
  // Automation Rules & Triggers
  getAutomationRules(filters?: {
    agentId?: number;
    triggerType?: string;
    actionType?: string;
    isActive?: boolean;
  }): Promise<AutomationRule[]>;
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  updateAutomationRule(id: number, rule: Partial<InsertAutomationRule>): Promise<AutomationRule>;
  executeAutomationRule(ruleId: number, leadId: number): Promise<void>;
  checkAutomationTriggers(leadId: number): Promise<void>;
  
  // Lead Activity Tracking
  trackLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity>;
  getLeadActivities(leadId: number, limit?: number): Promise<LeadActivity[]>;
  getLeadActivitySummary(leadId: number): Promise<{
    totalViews: number;
    propertiesViewed: number;
    lastActivity: Date | null;
    engagementScore: number;
  }>;
  
  // Property Favorites & Saved Searches
  getFavoriteProperties(leadId: number): Promise<PropertyFavorite[]>;
  addPropertyToFavorites(leadId: number, propertyId: number, notes?: string): Promise<PropertyFavorite>;
  removePropertyFromFavorites(leadId: number, propertyId: number): Promise<void>;
  
  getSavedSearches(leadId: number): Promise<SavedSearch[]>;
  createSavedSearch(search: InsertSavedSearch): Promise<SavedSearch>;
  updateSavedSearch(id: number, search: Partial<InsertSavedSearch>): Promise<SavedSearch>;
  deleteSavedSearch(id: number): Promise<void>;
  checkSavedSearchMatches(searchId: number): Promise<Property[]>;
  
  // Advanced Behavioral Triggers
  checkInactiveLeads(daysSinceLastContact: number): Promise<Lead[]>;
  getHighEngagementLeads(propertyViewThreshold: number): Promise<Lead[]>;
  getLeadsByLastActivity(hours: number): Promise<Lead[]>;
  
  // Lead Scoring & Intelligence
  calculateLeadScore(leadId: number): Promise<number>;
  updateLeadEngagementScore(leadId: number): Promise<void>;
  identifyHotLeads(): Promise<Lead[]>;
  
  // Communication Automation
  sendAutomatedMessage(leadId: number, templateId: number, variables?: Record<string, string>): Promise<Communication>;
  scheduleFollowUp(leadId: number, agentId: number, delayMinutes: number, taskType: string): Promise<Task>;
  triggerDripCampaign(leadId: number, campaignType: string): Promise<void>;
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

  async getPropertyByMLSNumber(mlsNumber: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.mlsNumber, mlsNumber));
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
  // Home Valuations
  async createHomeValuation(valuation: InsertHomeValuation): Promise<HomeValuation> {
    const [result] = await db.insert(homeValuations).values(valuation).returning();
    return result;
  }

  async getHomeValuation(id: number): Promise<HomeValuation | undefined> {
    const [result] = await db.select().from(homeValuations).where(eq(homeValuations.id, id));
    return result;
  }

  async getHomeValuations(leadId?: number): Promise<HomeValuation[]> {
    if (leadId) {
      return await db.select().from(homeValuations).where(eq(homeValuations.leadId, leadId));
    }
    return await db.select().from(homeValuations).orderBy(desc(homeValuations.createdAt));
  }

  async updateHomeValuation(id: number, valuation: Partial<InsertHomeValuation>): Promise<HomeValuation> {
    const [result] = await db
      .update(homeValuations)
      .set({ ...valuation, updatedAt: new Date() })
      .where(eq(homeValuations.id, id))
      .returning();
    return result;
  }

  // Market Predictions
  async createMarketPrediction(prediction: InsertMarketPrediction): Promise<MarketPrediction> {
    const [result] = await db.insert(marketPredictions).values(prediction).returning();
    return result;
  }

  async getMarketPrediction(id: number): Promise<MarketPrediction | undefined> {
    const [result] = await db.select().from(marketPredictions).where(eq(marketPredictions.id, id));
    return result;
  }

  async getMarketPredictions(propertyId?: number): Promise<MarketPrediction[]> {
    if (propertyId) {
      return await db.select().from(marketPredictions).where(eq(marketPredictions.propertyId, propertyId));
    }
    return await db.select().from(marketPredictions).orderBy(desc(marketPredictions.createdAt));
  }

  // Open Houses
  async getOpenHouses(filters?: { active?: boolean; upcoming?: boolean }): Promise<OpenHouse[]> {
    try {
      let query = db.select().from(openHouses);
      
      if (filters?.active !== undefined) {
        query = query.where(eq(openHouses.isActive, filters.active));
      }
      
      if (filters?.upcoming) {
        const now = new Date();
        query = query.where(and(
          eq(openHouses.isActive, true),
          sql`${openHouses.dateTime} >= ${now}`
        ));
      }
      
      return await query.orderBy(asc(openHouses.dateTime));
    } catch (error) {
      console.error("Error fetching open houses:", error);
      return [];
    }
  }

  async createOpenHouse(openHouse: InsertOpenHouse): Promise<OpenHouse> {
    const [newOpenHouse] = await db.insert(openHouses).values(openHouse).returning();
    return newOpenHouse;
  }

  async updateOpenHouse(id: number, openHouse: Partial<InsertOpenHouse>): Promise<OpenHouse> {
    const [updated] = await db.update(openHouses)
      .set({ ...openHouse, updatedAt: new Date() })
      .where(eq(openHouses.id, id))
      .returning();
    return updated;
  }

  // ADVANCED CRM AUTOMATION & WORKFLOW IMPLEMENTATION

  // Task Management & Follow-ups
  async getTasks(filters: {
    leadId?: number;
    agentId?: number;
    propertyId?: number;
    type?: string;
    priority?: string;
    status?: string;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    automated?: boolean;
  } = {}): Promise<Task[]> {
    let query = db.select().from(tasks);
    
    const conditions = [];
    if (filters.leadId) conditions.push(eq(tasks.leadId, filters.leadId));
    if (filters.agentId) conditions.push(eq(tasks.agentId, filters.agentId));
    if (filters.propertyId) conditions.push(eq(tasks.propertyId, filters.propertyId));
    if (filters.type) conditions.push(eq(tasks.type, filters.type));
    if (filters.priority) conditions.push(eq(tasks.priority, filters.priority));
    if (filters.status) conditions.push(eq(tasks.status, filters.status));
    if (filters.automated !== undefined) conditions.push(eq(tasks.automatedTask, filters.automated));
    if (filters.dueDateFrom) conditions.push(sql`${tasks.dueDate} >= ${filters.dueDateFrom}`);
    if (filters.dueDateTo) conditions.push(sql`${tasks.dueDate} <= ${filters.dueDateTo}`);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(tasks.createdAt));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async completeTask(id: number, notes?: string): Promise<Task> {
    const [completedTask] = await db
      .update(tasks)
      .set({ 
        status: 'completed', 
        completedAt: new Date(),
        notes: notes,
        updatedAt: new Date()
      })
      .where(eq(tasks.id, id))
      .returning();
    return completedTask;
  }

  // Communication Tracking (Email, SMS, Calls)
  async getCommunications(filters: {
    leadId?: number;
    agentId?: number;
    type?: string;
    direction?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}): Promise<Communication[]> {
    let query = db.select().from(communications);
    
    const conditions = [];
    if (filters.leadId) conditions.push(eq(communications.leadId, filters.leadId));
    if (filters.agentId) conditions.push(eq(communications.agentId, filters.agentId));
    if (filters.type) conditions.push(eq(communications.type, filters.type));
    if (filters.direction) conditions.push(eq(communications.direction, filters.direction));
    if (filters.status) conditions.push(eq(communications.status, filters.status));
    if (filters.dateFrom) conditions.push(sql`${communications.createdAt} >= ${filters.dateFrom}`);
    if (filters.dateTo) conditions.push(sql`${communications.createdAt} <= ${filters.dateTo}`);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(communications.createdAt));
  }

  async createCommunication(communication: InsertCommunication): Promise<Communication> {
    const [newCommunication] = await db.insert(communications).values({
      ...communication,
      sentAt: new Date()
    }).returning();
    return newCommunication;
  }

  async updateCommunication(id: number, communication: Partial<InsertCommunication>): Promise<Communication> {
    const [updatedCommunication] = await db
      .update(communications)
      .set(communication)
      .where(eq(communications.id, id))
      .returning();
    return updatedCommunication;
  }

  async markCommunicationRead(id: number): Promise<Communication> {
    const [updatedCommunication] = await db
      .update(communications)
      .set({ openedAt: new Date() })
      .where(eq(communications.id, id))
      .returning();
    return updatedCommunication;
  }

  async trackCommunicationEvent(id: number, event: 'opened' | 'clicked' | 'replied'): Promise<Communication> {
    const updateData: any = {};
    if (event === 'opened') updateData.openedAt = new Date();
    if (event === 'clicked') updateData.clickedAt = new Date();
    if (event === 'replied') updateData.repliedAt = new Date();

    const [updatedCommunication] = await db
      .update(communications)
      .set(updateData)
      .where(eq(communications.id, id))
      .returning();
    return updatedCommunication;
  }

  // Message Templates for Automation
  async getMessageTemplates(filters: {
    agentId?: number;
    type?: string;
    category?: string;
    isActive?: boolean;
  } = {}): Promise<MessageTemplate[]> {
    let query = db.select().from(messageTemplates);
    
    const conditions = [];
    if (filters.agentId) conditions.push(eq(messageTemplates.agentId, filters.agentId));
    if (filters.type) conditions.push(eq(messageTemplates.type, filters.type));
    if (filters.category) conditions.push(eq(messageTemplates.category, filters.category));
    if (filters.isActive !== undefined) conditions.push(eq(messageTemplates.isActive, filters.isActive));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(messageTemplates.name);
  }

  async createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate> {
    const [newTemplate] = await db.insert(messageTemplates).values(template).returning();
    return newTemplate;
  }

  async updateMessageTemplate(id: number, template: Partial<InsertMessageTemplate>): Promise<MessageTemplate> {
    const [updatedTemplate] = await db
      .update(messageTemplates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(messageTemplates.id, id))
      .returning();
    return updatedTemplate;
  }

  async getMessageTemplate(id: number): Promise<MessageTemplate | undefined> {
    const [template] = await db.select().from(messageTemplates).where(eq(messageTemplates.id, id));
    return template || undefined;
  }

  async incrementTemplateUsage(id: number): Promise<void> {
    await db
      .update(messageTemplates)
      .set({ 
        useCount: sql`${messageTemplates.useCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(messageTemplates.id, id));
  }

  // Automation Rules & Triggers
  async getAutomationRules(filters: {
    agentId?: number;
    triggerType?: string;
    actionType?: string;
    isActive?: boolean;
  } = {}): Promise<AutomationRule[]> {
    let query = db.select().from(automationRules);
    
    const conditions = [];
    if (filters.agentId) conditions.push(eq(automationRules.agentId, filters.agentId));
    if (filters.triggerType) conditions.push(eq(automationRules.triggerType, filters.triggerType));
    if (filters.actionType) conditions.push(eq(automationRules.actionType, filters.actionType));
    if (filters.isActive !== undefined) conditions.push(eq(automationRules.isActive, filters.isActive));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(automationRules.name);
  }

  async createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule> {
    const [newRule] = await db.insert(automationRules).values(rule).returning();
    return newRule;
  }

  async updateAutomationRule(id: number, rule: Partial<InsertAutomationRule>): Promise<AutomationRule> {
    const [updatedRule] = await db
      .update(automationRules)
      .set({ ...rule, updatedAt: new Date() })
      .where(eq(automationRules.id, id))
      .returning();
    return updatedRule;
  }

  // Lead Activity Tracking
  async trackLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity> {
    const [newActivity] = await db.insert(leadActivities).values(activity).returning();
    return newActivity;
  }

  async getLeadActivities(leadId: number, limit: number = 50): Promise<LeadActivity[]> {
    return db.select()
      .from(leadActivities)
      .where(eq(leadActivities.leadId, leadId))
      .orderBy(desc(leadActivities.createdAt))
      .limit(limit);
  }

  async getLeadActivitySummary(leadId: number): Promise<{
    totalViews: number;
    propertiesViewed: number;
    lastActivity: Date | null;
    engagementScore: number;
  }> {
    const activities = await this.getLeadActivities(leadId);
    
    const totalViews = activities.filter(a => a.activityType === 'property_view').length;
    const uniqueProperties = new Set(activities.map(a => a.propertyId).filter(Boolean));
    const propertiesViewed = uniqueProperties.size;
    const lastActivity = activities[0]?.createdAt || null;
    
    // Calculate engagement score based on activity frequency and recency
    const engagementScore = Math.min(100, (totalViews * 5) + (propertiesViewed * 10));

    return {
      totalViews,
      propertiesViewed,
      lastActivity,
      engagementScore
    };
  }

  // Property Favorites & Saved Searches
  async getFavoriteProperties(leadId: number): Promise<PropertyFavorite[]> {
    return db.select()
      .from(propertyFavorites)
      .where(eq(propertyFavorites.leadId, leadId))
      .orderBy(desc(propertyFavorites.createdAt));
  }

  async addPropertyToFavorites(leadId: number, propertyId: number, notes?: string): Promise<PropertyFavorite> {
    const [favorite] = await db.insert(propertyFavorites).values({
      leadId,
      propertyId,
      notes
    }).returning();
    
    // Track this as an activity
    await this.trackLeadActivity({
      leadId,
      propertyId,
      activityType: 'favorite',
      details: { propertyTitle: `Property ID ${propertyId}` }
    });
    
    return favorite;
  }

  async removePropertyFromFavorites(leadId: number, propertyId: number): Promise<void> {
    await db.delete(propertyFavorites)
      .where(and(
        eq(propertyFavorites.leadId, leadId),
        eq(propertyFavorites.propertyId, propertyId)
      ));
  }

  async getSavedSearches(leadId: number): Promise<SavedSearch[]> {
    return db.select()
      .from(savedSearches)
      .where(eq(savedSearches.leadId, leadId))
      .orderBy(desc(savedSearches.createdAt));
  }

  async createSavedSearch(search: InsertSavedSearch): Promise<SavedSearch> {
    const [newSearch] = await db.insert(savedSearches).values(search).returning();
    return newSearch;
  }

  async updateSavedSearch(id: number, search: Partial<InsertSavedSearch>): Promise<SavedSearch> {
    const [updatedSearch] = await db
      .update(savedSearches)
      .set({ ...search, updatedAt: new Date() })
      .where(eq(savedSearches.id, id))
      .returning();
    return updatedSearch;
  }

  async deleteSavedSearch(id: number): Promise<void> {
    await db.delete(savedSearches).where(eq(savedSearches.id, id));
  }

  async checkSavedSearchMatches(searchId: number): Promise<Property[]> {
    const [search] = await db.select().from(savedSearches).where(eq(savedSearches.id, searchId));
    if (!search || !search.criteria) return [];

    const criteria = search.criteria;
    return this.getProperties(criteria);
  }

  // Advanced Behavioral Triggers
  async checkInactiveLeads(daysSinceLastContact: number): Promise<Lead[]> {
    const cutoffDate = new Date(Date.now() - daysSinceLastContact * 24 * 60 * 60 * 1000);
    return db.select()
      .from(leads)
      .where(sql`${leads.updatedAt} < ${cutoffDate}`)
      .orderBy(asc(leads.updatedAt));
  }

  async getHighEngagementLeads(propertyViewThreshold: number): Promise<Lead[]> {
    // Get leads with high property view activity
    const highActivityLeads = await db.select({ 
      leadId: leadActivities.leadId,
      viewCount: sql<number>`count(*)`.as('viewCount')
    })
      .from(leadActivities)
      .where(eq(leadActivities.activityType, 'property_view'))
      .groupBy(leadActivities.leadId)
      .having(sql`count(*) >= ${propertyViewThreshold}`);

    if (highActivityLeads.length === 0) return [];

    const leadIds = highActivityLeads.map(l => l.leadId).filter(Boolean);
    return db.select()
      .from(leads)
      .where(sql`${leads.id} IN (${leadIds.join(',')})`);
  }

  async getLeadsByLastActivity(hours: number): Promise<Lead[]> {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const recentActivityLeads = await db.select({ leadId: leadActivities.leadId })
      .from(leadActivities)
      .where(sql`${leadActivities.createdAt} >= ${cutoffDate}`)
      .groupBy(leadActivities.leadId);

    if (recentActivityLeads.length === 0) return [];

    const leadIds = recentActivityLeads.map(l => l.leadId).filter(Boolean);
    return db.select()
      .from(leads)
      .where(sql`${leads.id} IN (${leadIds.join(',')})`);
  }

  // Lead Scoring & Intelligence
  async calculateLeadScore(leadId: number): Promise<number> {
    const lead = await this.getLead(leadId);
    if (!lead) return 0;

    let score = 0;

    // Base score from lead properties
    if (lead.budget && parseFloat(lead.budget) > 1000000) score += 30;
    if (lead.preApprovalAmount && parseFloat(lead.preApprovalAmount) > 0) score += 25;
    if (lead.timeframe === 'immediate') score += 20;
    if (lead.buyerType === 'cash_buyer') score += 15;

    // Activity-based scoring
    const activitySummary = await this.getLeadActivitySummary(leadId);
    score += Math.min(30, activitySummary.engagementScore * 0.3);

    return Math.min(100, Math.round(score));
  }

  async updateLeadEngagementScore(leadId: number): Promise<void> {
    const score = await this.calculateLeadScore(leadId);
    await this.updateLead(leadId, { 
      priority: score > 80 ? 5 : score > 60 ? 4 : score > 40 ? 3 : score > 20 ? 2 : 1 
    });
  }

  async identifyHotLeads(): Promise<Lead[]> {
    // Hot leads: high priority, recent activity, high budget
    return db.select()
      .from(leads)
      .where(and(
        sql`${leads.priority} >= 4`,
        sql`${leads.budget} > 1000000`,
        sql`${leads.updatedAt} > ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}`
      ))
      .orderBy(desc(leads.priority), desc(leads.updatedAt));
  }

  // Advanced automation methods (simplified implementations)
  async executeAutomationRule(ruleId: number, leadId: number): Promise<void> {
    // Implementation would handle rule execution logic
    console.log(`Executing automation rule ${ruleId} for lead ${leadId}`);
  }

  async checkAutomationTriggers(leadId: number): Promise<void> {
    // Implementation would check and execute triggers
    console.log(`Checking automation triggers for lead ${leadId}`);
  }

  async sendAutomatedMessage(leadId: number, templateId: number, variables: Record<string, string> = {}): Promise<Communication> {
    const template = await this.getMessageTemplate(templateId);
    if (!template) throw new Error('Template not found');

    const lead = await this.getLead(leadId);
    if (!lead) throw new Error('Lead not found');

    // Create the communication record
    return this.createCommunication({
      leadId,
      agentId: template.agentId!,
      type: template.type as any,
      direction: 'outbound',
      subject: template.subject || '',
      content: template.content,
      templateId
    });
  }

  async scheduleFollowUp(leadId: number, agentId: number, delayMinutes: number, taskType: string): Promise<Task> {
    const dueDate = new Date(Date.now() + delayMinutes * 60 * 1000);
    
    return this.createTask({
      leadId,
      agentId,
      title: `Follow up with lead`,
      type: taskType as any,
      priority: 'medium',
      dueDate,
      automatedTask: true,
      triggerType: 'time_based'
    });
  }

  async triggerDripCampaign(leadId: number, campaignType: string): Promise<void> {
    // Implementation would trigger drip campaign
    console.log(`Triggering drip campaign ${campaignType} for lead ${leadId}`);
  }
}

export const storage = new DatabaseStorage();
