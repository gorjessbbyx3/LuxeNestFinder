import { Express, Request, Response, NextFunction } from "express";
import { Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertPropertySchema, 
  insertNeighborhoodSchema, 
  insertLeadSchema, 
  insertPropertyInquirySchema, 
  insertChatConversationSchema,
  insertTaskSchema,
  insertCommunicationSchema,
  insertMessageTemplateSchema,
  insertAutomationRuleSchema,
  insertLeadActivitySchema,
  insertPropertyFavoriteSchema,
  insertSavedSearchSchema
} from "@shared/schema";
import { log } from "./vite";

const PORT = parseInt(process.env.PORT || "3000");

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties API
  app.get("/api/properties", async (req, res) => {
    try {
      const { minPrice, maxPrice, bedrooms, propertyType, city, featured, limit, offset } = req.query;
      const properties = await storage.getProperties({
        minPrice: minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms as string) : undefined,
        propertyType: propertyType as string,
        city: city as string,
        featured: featured === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const property = insertPropertySchema.parse(req.body);
      const newProperty = await storage.createProperty(property);
      res.status(201).json(newProperty);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  // Neighborhoods API
  app.get("/api/neighborhoods", async (req, res) => {
    try {
      const neighborhoods = await storage.getNeighborhoods();
      res.json(neighborhoods);
    } catch (error) {
      console.error("Error fetching neighborhoods:", error);
      res.status(500).json({ message: "Failed to fetch neighborhoods" });
    }
  });

  // Leads API
  app.post("/api/leads", async (req, res) => {
    try {
      const lead = insertLeadSchema.parse(req.body);
      const newLead = await storage.createLead(lead);
      res.status(201).json(newLead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ message: "Failed to create lead" });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // Property Inquiries API
  app.post("/api/property-inquiries", async (req, res) => {
    try {
      const inquiry = insertPropertyInquirySchema.parse(req.body);
      const newInquiry = await storage.createPropertyInquiry(inquiry);
      res.status(201).json(newInquiry);
    } catch (error) {
      console.error("Error creating property inquiry:", error);
      res.status(500).json({ message: "Failed to create property inquiry" });
    }
  });

  // Chat Conversations API
  app.post("/api/chat-conversations", async (req, res) => {
    try {
      const conversation = insertChatConversationSchema.parse(req.body);
      const newConversation = await storage.createChatConversation(conversation);
      res.status(201).json(newConversation);
    } catch (error) {
      console.error("Error creating chat conversation:", error);
      res.status(500).json({ message: "Failed to create chat conversation" });
    }
  });

  // AI Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId, propertyId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const conversation = conversationId ? 
        await storage.getChatConversation(conversationId) : null;

      const aiResponse = await generateAIResponse(message, conversation);
      
      res.json({ 
        response: aiResponse,
        conversationId: conversation?.id || null
      });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // HiCentral Scraper API endpoints
  app.post("/api/hicentral/sync", async (req, res) => {
    try {
      const { hicentralScraper } = await import("./lib/hicentral-scraper");
      await hicentralScraper.syncProperties();
      res.json({ message: "HiCentral sync completed successfully" });
    } catch (error) {
      console.error("Error syncing HiCentral properties:", error);
      res.status(500).json({ message: "Failed to sync HiCentral properties" });
    }
  });

  app.get("/api/hicentral/status", async (req, res) => {
    try {
      const { hicentralScraper } = await import("./lib/hicentral-scraper");
      const lastSync = await hicentralScraper.getLastSync();
      res.json({
        status: "active",
        schedule: "Every hour",
        source: "HiCentral MLS",
        lastSync: lastSync || new Date().toISOString()
      });
    } catch (error) {
      console.error("Error getting HiCentral status:", error);
      res.status(500).json({ message: "Failed to get HiCentral status" });
    }
  });

  // ========================================
  // ADVANCED CRM AUTOMATION & WORKFLOW ENDPOINTS
  // ========================================

  // Task Management & Follow-ups
  app.get("/api/tasks", async (req, res) => {
    try {
      const { leadId, agentId, propertyId, type, priority, status, automated, dueDateFrom, dueDateTo } = req.query;
      const tasks = await storage.getTasks({
        leadId: leadId ? parseInt(leadId as string) : undefined,
        agentId: agentId ? parseInt(agentId as string) : undefined,
        propertyId: propertyId ? parseInt(propertyId as string) : undefined,
        type: type as string,
        priority: priority as string,
        status: status as string,
        automated: automated === 'true' ? true : automated === 'false' ? false : undefined,
        dueDateFrom: dueDateFrom ? new Date(dueDateFrom as string) : undefined,
        dueDateTo: dueDateTo ? new Date(dueDateTo as string) : undefined,
      });
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const task = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask(task);
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.updateTask(id, req.body);
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.post("/api/tasks/:id/complete", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { notes } = req.body;
      const task = await storage.completeTask(id, notes);
      res.json(task);
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  // Communication Tracking (Email, SMS, Calls)
  app.get("/api/communications", async (req, res) => {
    try {
      const { leadId, agentId, type, direction, status, dateFrom, dateTo } = req.query;
      const communications = await storage.getCommunications({
        leadId: leadId ? parseInt(leadId as string) : undefined,
        agentId: agentId ? parseInt(agentId as string) : undefined,
        type: type as string,
        direction: direction as string,
        status: status as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      });
      res.json(communications);
    } catch (error) {
      console.error("Error fetching communications:", error);
      res.status(500).json({ message: "Failed to fetch communications" });
    }
  });

  app.post("/api/communications", async (req, res) => {
    try {
      const communication = insertCommunicationSchema.parse(req.body);
      const newCommunication = await storage.createCommunication(communication);
      res.status(201).json(newCommunication);
    } catch (error) {
      console.error("Error creating communication:", error);
      res.status(500).json({ message: "Failed to create communication" });
    }
  });

  app.post("/api/communications/:id/track", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { event } = req.body; // 'opened', 'clicked', 'replied'
      const communication = await storage.trackCommunicationEvent(id, event);
      res.json(communication);
    } catch (error) {
      console.error("Error tracking communication event:", error);
      res.status(500).json({ message: "Failed to track communication event" });
    }
  });

  // Message Templates for Automation
  app.get("/api/message-templates", async (req, res) => {
    try {
      const { agentId, type, category, isActive } = req.query;
      const templates = await storage.getMessageTemplates({
        agentId: agentId ? parseInt(agentId as string) : undefined,
        type: type as string,
        category: category as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      });
      res.json(templates);
    } catch (error) {
      console.error("Error fetching message templates:", error);
      res.status(500).json({ message: "Failed to fetch message templates" });
    }
  });

  app.post("/api/message-templates", async (req, res) => {
    try {
      const template = insertMessageTemplateSchema.parse(req.body);
      const newTemplate = await storage.createMessageTemplate(template);
      res.status(201).json(newTemplate);
    } catch (error) {
      console.error("Error creating message template:", error);
      res.status(500).json({ message: "Failed to create message template" });
    }
  });

  app.put("/api/message-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.updateMessageTemplate(id, req.body);
      res.json(template);
    } catch (error) {
      console.error("Error updating message template:", error);
      res.status(500).json({ message: "Failed to update message template" });
    }
  });

  // Automation Rules & Triggers
  app.get("/api/automation-rules", async (req, res) => {
    try {
      const { agentId, triggerType, actionType, isActive } = req.query;
      const rules = await storage.getAutomationRules({
        agentId: agentId ? parseInt(agentId as string) : undefined,
        triggerType: triggerType as string,
        actionType: actionType as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      });
      res.json(rules);
    } catch (error) {
      console.error("Error fetching automation rules:", error);
      res.status(500).json({ message: "Failed to fetch automation rules" });
    }
  });

  app.post("/api/automation-rules", async (req, res) => {
    try {
      const rule = insertAutomationRuleSchema.parse(req.body);
      const newRule = await storage.createAutomationRule(rule);
      res.status(201).json(newRule);
    } catch (error) {
      console.error("Error creating automation rule:", error);
      res.status(500).json({ message: "Failed to create automation rule" });
    }
  });

  app.put("/api/automation-rules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rule = await storage.updateAutomationRule(id, req.body);
      res.json(rule);
    } catch (error) {
      console.error("Error updating automation rule:", error);
      res.status(500).json({ message: "Failed to update automation rule" });
    }
  });

  app.post("/api/automation-rules/:ruleId/execute", async (req, res) => {
    try {
      const ruleId = parseInt(req.params.ruleId);
      const { leadId } = req.body;
      await storage.executeAutomationRule(ruleId, leadId);
      res.json({ message: "Automation rule executed successfully" });
    } catch (error) {
      console.error("Error executing automation rule:", error);
      res.status(500).json({ message: "Failed to execute automation rule" });
    }
  });

  // Lead Activity Tracking
  app.post("/api/lead-activities", async (req, res) => {
    try {
      const activity = insertLeadActivitySchema.parse(req.body);
      const newActivity = await storage.trackLeadActivity(activity);
      res.status(201).json(newActivity);
    } catch (error) {
      console.error("Error tracking lead activity:", error);
      res.status(500).json({ message: "Failed to track lead activity" });
    }
  });

  app.get("/api/leads/:leadId/activities", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activities = await storage.getLeadActivities(leadId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching lead activities:", error);
      res.status(500).json({ message: "Failed to fetch lead activities" });
    }
  });

  app.get("/api/leads/:leadId/activity-summary", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const summary = await storage.getLeadActivitySummary(leadId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching lead activity summary:", error);
      res.status(500).json({ message: "Failed to fetch lead activity summary" });
    }
  });

  // Property Favorites & Saved Searches
  app.get("/api/leads/:leadId/favorites", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const favorites = await storage.getFavoriteProperties(leadId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorite properties:", error);
      res.status(500).json({ message: "Failed to fetch favorite properties" });
    }
  });

  app.post("/api/leads/:leadId/favorites", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const { propertyId, notes } = req.body;
      const favorite = await storage.addPropertyToFavorites(leadId, propertyId, notes);
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding property to favorites:", error);
      res.status(500).json({ message: "Failed to add property to favorites" });
    }
  });

  app.delete("/api/leads/:leadId/favorites/:propertyId", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const propertyId = parseInt(req.params.propertyId);
      await storage.removePropertyFromFavorites(leadId, propertyId);
      res.json({ message: "Property removed from favorites" });
    } catch (error) {
      console.error("Error removing property from favorites:", error);
      res.status(500).json({ message: "Failed to remove property from favorites" });
    }
  });

  app.get("/api/leads/:leadId/saved-searches", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const searches = await storage.getSavedSearches(leadId);
      res.json(searches);
    } catch (error) {
      console.error("Error fetching saved searches:", error);
      res.status(500).json({ message: "Failed to fetch saved searches" });
    }
  });

  app.post("/api/leads/:leadId/saved-searches", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const search = insertSavedSearchSchema.parse({ ...req.body, leadId });
      const newSearch = await storage.createSavedSearch(search);
      res.status(201).json(newSearch);
    } catch (error) {
      console.error("Error creating saved search:", error);
      res.status(500).json({ message: "Failed to create saved search" });
    }
  });

  app.put("/api/saved-searches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const search = await storage.updateSavedSearch(id, req.body);
      res.json(search);
    } catch (error) {
      console.error("Error updating saved search:", error);
      res.status(500).json({ message: "Failed to update saved search" });
    }
  });

  app.delete("/api/saved-searches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSavedSearch(id);
      res.json({ message: "Saved search deleted" });
    } catch (error) {
      console.error("Error deleting saved search:", error);
      res.status(500).json({ message: "Failed to delete saved search" });
    }
  });

  // Advanced Behavioral Triggers & Lead Intelligence
  app.get("/api/leads/inactive", async (req, res) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const inactiveLeads = await storage.checkInactiveLeads(days);
      res.json(inactiveLeads);
    } catch (error) {
      console.error("Error fetching inactive leads:", error);
      res.status(500).json({ message: "Failed to fetch inactive leads" });
    }
  });

  app.get("/api/leads/high-engagement", async (req, res) => {
    try {
      const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 5;
      const highEngagementLeads = await storage.getHighEngagementLeads(threshold);
      res.json(highEngagementLeads);
    } catch (error) {
      console.error("Error fetching high engagement leads:", error);
      res.status(500).json({ message: "Failed to fetch high engagement leads" });
    }
  });

  app.get("/api/leads/recent-activity", async (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const recentLeads = await storage.getLeadsByLastActivity(hours);
      res.json(recentLeads);
    } catch (error) {
      console.error("Error fetching leads with recent activity:", error);
      res.status(500).json({ message: "Failed to fetch leads with recent activity" });
    }
  });

  app.get("/api/leads/hot-leads", async (req, res) => {
    try {
      const hotLeads = await storage.identifyHotLeads();
      res.json(hotLeads);
    } catch (error) {
      console.error("Error fetching hot leads:", error);
      res.status(500).json({ message: "Failed to fetch hot leads" });
    }
  });

  app.get("/api/leads/:leadId/score", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const score = await storage.calculateLeadScore(leadId);
      res.json({ leadId, score });
    } catch (error) {
      console.error("Error calculating lead score:", error);
      res.status(500).json({ message: "Failed to calculate lead score" });
    }
  });

  // Communication Automation
  app.post("/api/leads/:leadId/send-automated-message", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const { templateId, variables } = req.body;
      const communication = await storage.sendAutomatedMessage(leadId, templateId, variables);
      res.status(201).json(communication);
    } catch (error) {
      console.error("Error sending automated message:", error);
      res.status(500).json({ message: "Failed to send automated message" });
    }
  });

  app.post("/api/leads/:leadId/schedule-follow-up", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const { agentId, delayMinutes, taskType } = req.body;
      const task = await storage.scheduleFollowUp(leadId, agentId, delayMinutes, taskType);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      res.status(500).json({ message: "Failed to schedule follow-up" });
    }
  });

  app.post("/api/leads/:leadId/trigger-drip-campaign", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const { campaignType } = req.body;
      await storage.triggerDripCampaign(leadId, campaignType);
      res.json({ message: "Drip campaign triggered successfully" });
    } catch (error) {
      console.error("Error triggering drip campaign:", error);
      res.status(500).json({ message: "Failed to trigger drip campaign" });
    }
  });

  app.post("/api/leads/:leadId/check-triggers", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      await storage.checkAutomationTriggers(leadId);
      res.json({ message: "Automation triggers checked successfully" });
    } catch (error) {
      console.error("Error checking automation triggers:", error);
      res.status(500).json({ message: "Failed to check automation triggers" });
    }
  });

  // Return the app configured with routes - server startup handled by index.ts
  return app as any;
}

async function generateAIResponse(message: string, conversation: any): Promise<string> {
  // Basic AI response for now - this would integrate with OpenAI API
  return `Thank you for your inquiry about "${message}". I'm here to help you find the perfect luxury property in Hawaii. How can I assist you further?`;
}