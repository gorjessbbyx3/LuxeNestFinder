import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertLeadSchema, 
  insertPropertyInquirySchema, 
  insertChatConversationSchema,
  insertAgentSchema,
  insertAppointmentSchema,
  insertContractSchema,
  insertCommissionSchema,
  insertMarketingCampaignSchema
} from "@shared/schema";
import { generatePropertyDescription } from "./lib/openai";
import { hawaiiParcelService } from "./lib/hawaii-parcels";
import { hiCentralMLSService } from "./lib/hicentral-mls";
import { mlsScraperService } from "./lib/mls-scraper";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Properties endpoints
  app.get("/api/properties", async (req, res) => {
    try {
      const {
        minPrice,
        maxPrice,
        bedrooms,
        propertyType,
        city,
        featured,
        limit = 20,
        offset = 0
      } = req.query;

      const filters: any = {};
      if (minPrice) filters.minPrice = Number(minPrice);
      if (maxPrice) filters.maxPrice = Number(maxPrice);
      if (bedrooms) filters.bedrooms = Number(bedrooms);
      if (propertyType) filters.propertyType = String(propertyType);
      if (city) filters.city = String(city);
      if (featured !== undefined) filters.featured = featured === 'true';
      filters.limit = Number(limit);
      filters.offset = Number(offset);

      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(Number(req.params.id));
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.get("/api/properties/search/:query", async (req, res) => {
    try {
      const properties = await storage.searchProperties(req.params.query);
      res.json(properties);
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  // Neighborhoods endpoints
  app.get("/api/neighborhoods", async (req, res) => {
    try {
      const neighborhoods = await storage.getNeighborhoods();
      res.json(neighborhoods);
    } catch (error) {
      console.error("Error fetching neighborhoods:", error);
      res.status(500).json({ message: "Failed to fetch neighborhoods" });
    }
  });

  app.get("/api/neighborhoods/:id", async (req, res) => {
    try {
      const neighborhood = await storage.getNeighborhood(Number(req.params.id));
      if (!neighborhood) {
        return res.status(404).json({ message: "Neighborhood not found" });
      }
      res.json(neighborhood);
    } catch (error) {
      console.error("Error fetching neighborhood:", error);
      res.status(500).json({ message: "Failed to fetch neighborhood" });
    }
  });

  // Leads endpoints
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(400).json({ message: "Invalid lead data" });
    }
  });

  // Property inquiries endpoints
  app.post("/api/property-inquiries", async (req, res) => {
    try {
      const inquiryData = insertPropertyInquirySchema.parse(req.body);
      const inquiry = await storage.createPropertyInquiry(inquiryData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating property inquiry:", error);
      res.status(400).json({ message: "Invalid inquiry data" });
    }
  });

  app.get("/api/property-inquiries", async (req, res) => {
    try {
      const { propertyId, leadId } = req.query;
      const inquiries = await storage.getPropertyInquiries(
        propertyId ? Number(propertyId) : undefined,
        leadId ? Number(leadId) : undefined
      );
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Chat conversations endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, leadId, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      let conversation;
      
      if (conversationId) {
        conversation = await storage.getChatConversation(conversationId);
        if (!conversation) {
          return res.status(404).json({ message: "Conversation not found" });
        }
      } else {
        // Create new conversation
        const conversationData = insertChatConversationSchema.parse({
          leadId: leadId || null,
          messages: [],
        });
        conversation = await storage.createChatConversation(conversationData);
      }

      // Add user message
      const updatedMessages = [
        ...conversation.messages,
        {
          role: 'user' as const,
          content: message,
          timestamp: new Date().toISOString(),
        }
      ];

      // Generate AI response (simplified - in production, integrate with OpenAI)
      const aiResponse = await generateAIResponse(message, conversation);
      
      updatedMessages.push({
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date().toISOString(),
      });

      // Update conversation
      const updatedConversation = await storage.updateChatConversation(conversation.id, {
        messages: updatedMessages,
      });

      res.json(updatedConversation);
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Chat service unavailable" });
    }
  });

  // AI property description generation
  app.post("/api/ai/generate-description", async (req, res) => {
    try {
      const { propertyData } = req.body;
      
      if (!propertyData) {
        return res.status(400).json({ message: "Property data is required" });
      }

      const description = await generatePropertyDescription(propertyData);
      res.json({ description });
    } catch (error) {
      console.error("Error generating description:", error);
      res.status(500).json({ message: "Failed to generate description" });
    }
  });

  // AI lifestyle matching
  app.post("/api/ai/lifestyle-match", async (req, res) => {
    try {
      const { preferences } = req.body;
      
      if (!preferences) {
        return res.status(400).json({ message: "Preferences are required" });
      }

      // Get properties and calculate lifestyle scores
      const properties = await storage.getProperties({ limit: 50 });
      
      const scoredProperties = properties.map(property => ({
        ...property,
        lifestyleMatch: calculateLifestyleMatch(property, preferences)
      })).sort((a, b) => b.lifestyleMatch - a.lifestyleMatch);

      res.json(scoredProperties.slice(0, 10));
    } catch (error) {
      console.error("Error in lifestyle matching:", error);
      res.status(500).json({ message: "Lifestyle matching service unavailable" });
    }
  });

  // 🚀 REVOLUTIONARY CRM ENDPOINTS - Enterprise capabilities beyond OpenAI's basic suggestions!

  // AGENTS - Multi-agent team management
  app.get("/api/agents", async (req, res) => {
    try {
      const { role, teamId, isActive } = req.query;
      const agents = await storage.getAgents({
        role: role as string,
        teamId: teamId ? parseInt(teamId as string) : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined
      });
      res.json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const agent = insertAgentSchema.parse(req.body);
      const newAgent = await storage.createAgent(agent);
      res.json(newAgent);
    } catch (error) {
      console.error("Error creating agent:", error);
      res.status(400).json({ message: "Invalid agent data" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgent(parseInt(req.params.id));
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  app.patch("/api/agents/:id", async (req, res) => {
    try {
      const updatedAgent = await storage.updateAgent(parseInt(req.params.id), req.body);
      res.json(updatedAgent);
    } catch (error) {
      console.error("Error updating agent:", error);
      res.status(500).json({ message: "Failed to update agent" });
    }
  });

  // APPOINTMENTS - Advanced scheduling system
  app.get("/api/appointments", async (req, res) => {
    try {
      const { agentId, leadId, propertyId, type, status, dateFrom, dateTo } = req.query;
      const appointments = await storage.getAppointments({
        agentId: agentId ? parseInt(agentId as string) : undefined,
        leadId: leadId ? parseInt(leadId as string) : undefined,
        propertyId: propertyId ? parseInt(propertyId as string) : undefined,
        type: type as string,
        status: status as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined
      });
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointment = insertAppointmentSchema.parse(req.body);
      const newAppointment = await storage.createAppointment(appointment);
      res.json(newAppointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ message: "Invalid appointment data" });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const updatedAppointment = await storage.updateAppointment(parseInt(req.params.id), req.body);
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  // CONTRACTS - Digital offer management
  app.get("/api/contracts", async (req, res) => {
    try {
      const { agentId, propertyId, status, type } = req.query;
      const contracts = await storage.getContracts({
        agentId: agentId ? parseInt(agentId as string) : undefined,
        propertyId: propertyId ? parseInt(propertyId as string) : undefined,
        status: status as string,
        type: type as string
      });
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      const contract = insertContractSchema.parse(req.body);
      const newContract = await storage.createContract(contract);
      res.json(newContract);
    } catch (error) {
      console.error("Error creating contract:", error);
      res.status(400).json({ message: "Invalid contract data" });
    }
  });

  app.patch("/api/contracts/:id", async (req, res) => {
    try {
      const updatedContract = await storage.updateContract(parseInt(req.params.id), req.body);
      res.json(updatedContract);
    } catch (error) {
      console.error("Error updating contract:", error);
      res.status(500).json({ message: "Failed to update contract" });
    }
  });

  // COMMISSIONS - Financial tracking
  app.get("/api/commissions", async (req, res) => {
    try {
      const { agentId, status } = req.query;
      const commissions = await storage.getCommissions({
        agentId: agentId ? parseInt(agentId as string) : undefined,
        status: status as string
      });
      res.json(commissions);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      res.status(500).json({ message: "Failed to fetch commissions" });
    }
  });

  app.post("/api/commissions", async (req, res) => {
    try {
      const commission = insertCommissionSchema.parse(req.body);
      const newCommission = await storage.createCommission(commission);
      res.json(newCommission);
    } catch (error) {
      console.error("Error creating commission:", error);
      res.status(400).json({ message: "Invalid commission data" });
    }
  });

  // MARKETING CAMPAIGNS - Automated marketing
  app.get("/api/marketing-campaigns", async (req, res) => {
    try {
      const { agentId, status, type } = req.query;
      const campaigns = await storage.getMarketingCampaigns({
        agentId: agentId ? parseInt(agentId as string) : undefined,
        status: status as string,
        type: type as string
      });
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching marketing campaigns:", error);
      res.status(500).json({ message: "Failed to fetch marketing campaigns" });
    }
  });

  app.post("/api/marketing-campaigns", async (req, res) => {
    try {
      const campaign = insertMarketingCampaignSchema.parse(req.body);
      const newCampaign = await storage.createMarketingCampaign(campaign);
      res.json(newCampaign);
    } catch (error) {
      console.error("Error creating marketing campaign:", error);
      res.status(400).json({ message: "Invalid campaign data" });
    }
  });

  app.patch("/api/marketing-campaigns/:id", async (req, res) => {
    try {
      const updatedCampaign = await storage.updateMarketingCampaign(parseInt(req.params.id), req.body);
      res.json(updatedCampaign);
    } catch (error) {
      console.error("Error updating marketing campaign:", error);
      res.status(500).json({ message: "Failed to update marketing campaign" });
    }
  });

  // ADVANCED LEADS ENDPOINT - Enhanced filtering
  app.get("/api/leads", async (req, res) => {
    try {
      const { status, priority, buyerType, timeframe, minBudget, maxBudget, tags, agentId, limit, offset } = req.query;
      const leads = await storage.getLeads({
        status: status as string,
        priority: priority ? parseInt(priority as string) : undefined,
        buyerType: buyerType as string,
        timeframe: timeframe as string,
        minBudget: minBudget ? parseFloat(minBudget as string) : undefined,
        maxBudget: maxBudget ? parseFloat(maxBudget as string) : undefined,
        tags: tags ? (tags as string).split(',') : undefined,
        agentId: agentId ? parseInt(agentId as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // ANALYTICS - Agent performance dashboard
  app.get("/api/analytics/agent-performance/:agentId", async (req, res) => {
    try {
      const agentId = parseInt(req.params.agentId);
      const { dateFrom, dateTo } = req.query;
      
      const performance = await storage.getAgentPerformance(
        agentId,
        dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo ? new Date(dateTo as string) : undefined
      );
      
      res.json(performance);
    } catch (error) {
      console.error("Error fetching agent performance:", error);
      res.status(500).json({ message: "Failed to fetch agent performance" });
    }
  });

  // ADVANCED SEARCH - Multi-entity search
  app.get("/api/search/leads", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const leads = await storage.searchLeads(q as string);
      res.json(leads);
    } catch (error) {
      console.error("Error searching leads:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Hawaii State Parcel Data Integration - Official Government Source
  app.get("/api/hawaii-parcels/luxury", async (req, res) => {
    try {
      const { minValue = 2000000 } = req.query;
      const luxuryParcels = await hawaiiParcelService.getLuxuryParcels(Number(minValue));
      res.json(luxuryParcels);
    } catch (error) {
      console.error("Error fetching luxury parcels:", error);
      res.status(500).json({ error: "Failed to fetch luxury parcel data" });
    }
  });

  app.get("/api/hawaii-parcels/by-bounds", async (req, res) => {
    try {
      const { minLat, maxLat, minLng, maxLng, county } = req.query;
      
      if (!minLat || !maxLat || !minLng || !maxLng) {
        return res.status(400).json({ error: "Missing required boundary parameters" });
      }
      
      const parcels = await hawaiiParcelService.getParcelsByBounds(
        Number(minLat),
        Number(maxLat), 
        Number(minLng),
        Number(maxLng),
        county ? String(county) : undefined
      );
      
      res.json(parcels);
    } catch (error) {
      console.error("Error fetching parcels by bounds:", error);
      res.status(500).json({ error: "Failed to fetch parcel data" });
    }
  });

  app.get("/api/hawaii-parcels/tmk/:tmk", async (req, res) => {
    try {
      const { tmk } = req.params;
      const parcel = await hawaiiParcelService.getParcelByTMK(tmk);
      
      if (!parcel) {
        return res.status(404).json({ error: "Parcel not found" });
      }
      
      res.json(parcel);
    } catch (error) {
      console.error("Error fetching parcel by TMK:", error);
      res.status(500).json({ error: "Failed to fetch parcel data" });
    }
  });

  app.post("/api/hawaii-parcels/enrich-property", async (req, res) => {
    try {
      const { lat, lng, radius = 0.001 } = req.body;
      
      if (!lat || !lng) {
        return res.status(400).json({ error: "Missing latitude or longitude" });
      }
      
      const enrichmentData = await hawaiiParcelService.enrichPropertyWithParcelData(
        Number(lat),
        Number(lng),
        Number(radius)
      );
      
      res.json(enrichmentData);
    } catch (error) {
      console.error("Error enriching property with parcel data:", error);
      res.status(500).json({ error: "Failed to enrich property data" });
    }
  });

  // HiCentral MLS Integration - Real Hawaii MLS Data
  app.get("/api/mls/luxury", async (req, res) => {
    try {
      const { minPrice = 1500000 } = req.query;
      const listings = await hiCentralMLSService.getLuxuryListings(Number(minPrice));
      res.json(listings);
    } catch (error) {
      console.error("Error fetching luxury MLS listings:", error);
      res.status(500).json({ error: "Failed to fetch MLS data" });
    }
  });

  app.get("/api/mls/search", async (req, res) => {
    try {
      const filters = {
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        propertyType: req.query.propertyType as string,
        neighborhood: req.query.neighborhood as string,
        bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
        bathrooms: req.query.bathrooms ? Number(req.query.bathrooms) : undefined,
        minSqft: req.query.minSqft ? Number(req.query.minSqft) : undefined,
        maxSqft: req.query.maxSqft ? Number(req.query.maxSqft) : undefined,
        oceanView: req.query.oceanView === 'true',
        status: req.query.status as string,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        offset: req.query.offset ? Number(req.query.offset) : 0,
      };

      const listings = await hiCentralMLSService.searchProperties(filters);
      res.json(listings);
    } catch (error) {
      console.error("Error searching MLS listings:", error);
      res.status(500).json({ error: "Failed to search MLS data" });
    }
  });

  app.get("/api/mls/property/:mlsNumber", async (req, res) => {
    try {
      const { mlsNumber } = req.params;
      const listing = await hiCentralMLSService.getPropertyByMLS(mlsNumber);
      
      if (!listing) {
        return res.status(404).json({ error: "MLS listing not found" });
      }
      
      res.json(listing);
    } catch (error) {
      console.error("Error fetching MLS property:", error);
      res.status(500).json({ error: "Failed to fetch MLS property" });
    }
  });

  app.get("/api/mls/nearby", async (req, res) => {
    try {
      const { lat, lng, radius = 5 } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ error: "Missing latitude or longitude" });
      }
      
      const listings = await hiCentralMLSService.getPropertiesInRadius(
        Number(lat),
        Number(lng),
        Number(radius)
      );
      
      res.json(listings);
    } catch (error) {
      console.error("Error fetching nearby MLS properties:", error);
      res.status(500).json({ error: "Failed to fetch nearby MLS properties" });
    }
  });

  app.get("/api/mls/open-houses", async (req, res) => {
    try {
      const openHouses = await hiCentralMLSService.getOpenHouses();
      res.json(openHouses);
    } catch (error) {
      console.error("Error fetching open houses:", error);
      res.status(500).json({ error: "Failed to fetch open houses" });
    }
  });

  app.get("/api/mls/market-stats/:neighborhood", async (req, res) => {
    try {
      const { neighborhood } = req.params;
      const stats = await hiCentralMLSService.getMarketStats(neighborhood);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching market stats:", error);
      res.status(500).json({ error: "Failed to fetch market statistics" });
    }
  });

  app.get("/api/mls/photos/:mlsNumber", async (req, res) => {
    try {
      const { mlsNumber } = req.params;
      const listing = await hiCentralMLSService.getPropertyByMLS(mlsNumber);
      
      if (!listing) {
        return res.status(404).json({ error: "MLS listing not found" });
      }
      
      res.json({
        mlsNumber: listing.mlsNumber,
        address: listing.address,
        photos: listing.photos,
        totalPhotos: listing.photos.length,
        listPrice: listing.listPrice,
        propertyType: listing.propertyType
      });
    } catch (error) {
      console.error("Error fetching MLS photos:", error);
      res.status(500).json({ error: "Failed to fetch MLS photos" });
    }
  });

  // MLS Scraper Management Endpoints
  app.post("/api/scraper/sync", async (req, res) => {
    try {
      console.log('🔄 Manual MLS sync triggered...');
      await mlsScraperService.scrapeNewListings();
      res.json({ 
        success: true, 
        message: "MLS sync completed successfully" 
      });
    } catch (error) {
      console.error("Error during manual MLS sync:", error);
      res.status(500).json({ error: "Failed to sync MLS data" });
    }
  });

  app.get("/api/scraper/status", async (req, res) => {
    try {
      const status = mlsScraperService.getScraperStatus();
      res.json(status);
    } catch (error) {
      console.error("Error fetching scraper status:", error);
      res.status(500).json({ error: "Failed to fetch scraper status" });
    }
  });

  // Start automatic MLS scraping on server startup
  mlsScraperService.startAutoScraping();

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions
async function generateAIResponse(message: string, conversation: any): Promise<string> {
  // Simplified AI response - in production, integrate with OpenAI API
  const responses = [
    "I'd be happy to help you find the perfect property! Could you tell me more about your preferences?",
    "Based on your requirements, I found several properties that might interest you. Would you like to see them?",
    "That's a great question! Let me provide you with detailed information about that property.",
    "I can schedule a virtual tour or in-person viewing for you. What would you prefer?",
    "The estimated ROI for that property is quite attractive. Would you like a detailed financial analysis?",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function calculateLifestyleMatch(property: any, preferences: any): number {
  let score = 0;
  let factors = 0;

  // Location preferences
  if (preferences.oceanView && property.amenities?.includes('Ocean View')) {
    score += 25;
  }
  factors++;

  // Property type matching
  if (preferences.propertyType && property.propertyType === preferences.propertyType) {
    score += 20;
  }
  factors++;

  // Size requirements
  if (preferences.familySize) {
    const familySize = parseInt(preferences.familySize.split('-')[0]);
    if (property.bedrooms >= familySize) {
      score += 15;
    }
  }
  factors++;

  // Lifestyle amenities
  if (preferences.lifestyle?.remoteWork && property.amenities?.includes('Home Office')) {
    score += 20;
  }
  if (preferences.lifestyle?.oceanActivities && property.amenities?.includes('Beach Access')) {
    score += 20;
  }
  if (preferences.lifestyle?.privacy && property.propertyType === 'estate') {
    score += 15;
  }
  factors += 3;

  return Math.min(Math.round(score / factors * 4), 100);
}
