import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertPropertyInquirySchema, insertChatConversationSchema } from "@shared/schema";
import { generatePropertyDescription } from "./lib/openai";

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
