import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function generatePropertyDescription(propertyData: {
  title?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  propertyType?: string;
  city?: string;
  state?: string;
  amenities?: string[];
  price?: number;
  lotSize?: number;
}): Promise<string> {
  try {
    const prompt = `Create a compelling, SEO-optimized property description for a luxury Hawaiian real estate listing. 

Property Details:
- Title: ${propertyData.title || 'Luxury Hawaiian Property'}
- Type: ${propertyData.propertyType || 'Estate'}
- Location: ${propertyData.city || 'Hawaii'}, ${propertyData.state || 'HI'}
- Bedrooms: ${propertyData.bedrooms || 'Multiple'}
- Bathrooms: ${propertyData.bathrooms || 'Multiple'}
- Square Feet: ${propertyData.squareFeet || 'Spacious'}
- Lot Size: ${propertyData.lotSize || 'Large'}
- Price: $${propertyData.price?.toLocaleString() || 'Luxury pricing'}
- Amenities: ${propertyData.amenities?.join(', ') || 'Premium amenities'}

Requirements:
- Write in an engaging, luxury tone
- Highlight unique Hawaiian lifestyle benefits
- Include emotional appeal and lifestyle imagery
- Mention investment potential
- Keep it between 150-250 words
- Include call-to-action language
- Focus on exclusivity and premium features

Return only the description text, no additional formatting.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert luxury real estate copywriter specializing in Hawaiian properties. Create compelling, emotionally engaging property descriptions that highlight lifestyle benefits and investment potential."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Luxury Hawaiian property with exceptional amenities and investment potential.";

  } catch (error) {
    console.error("Error generating property description:", error);
    return "Discover this exceptional Hawaiian property featuring luxury amenities, stunning views, and prime location. Experience the ultimate island lifestyle with modern conveniences and timeless elegance.";
  }
}

export async function generateAIChatResponse(
  message: string, 
  context?: {
    propertyData?: any[];
    userPreferences?: any;
    conversationHistory?: any[];
  }
): Promise<string> {
  try {
    const systemPrompt = `You are Aloha Assistant, an expert AI real estate concierge for luxury Hawaiian properties. You help clients find their perfect home by understanding their lifestyle, preferences, and investment goals.

Your personality:
- Warm, professional, and knowledgeable about Hawaiian real estate
- Always start responses with a Hawaiian greeting or reference when appropriate
- Focus on lifestyle benefits, not just property specs
- Provide specific, actionable advice
- Ask follow-up questions to better understand client needs

Your expertise includes:
- Hawaiian real estate market trends
- Property investment analysis
- Neighborhood insights across all Hawaiian islands
- Lifestyle matching based on preferences
- Financing and mortgage guidance
- Virtual tour coordination
- Property comparison analysis

Always be helpful, informative, and personalized in your responses.`;

    const contextInfo = context?.propertyData ? 
      `\n\nAvailable Properties Context: ${JSON.stringify(context.propertyData.slice(0, 3))}` : '';

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt + contextInfo
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    return response.choices[0].message.content || "Aloha! I'd be happy to help you with your Hawaiian real estate needs. Could you tell me more about what you're looking for?";

  } catch (error) {
    console.error("Error generating AI chat response:", error);
    return "Aloha! I'm experiencing some technical difficulties right now. Please try asking your question again, or feel free to contact our team directly for immediate assistance.";
  }
}

export async function analyzeLifestyleMatch(
  propertyData: any,
  userPreferences: {
    familySize?: string;
    lifestyle?: any;
    budget?: number;
    propertyType?: string;
  }
): Promise<{
  score: number;
  reasoning: string;
  highlights: string[];
}> {
  try {
    const prompt = `Analyze how well this property matches the user's lifestyle preferences and provide a compatibility score.

Property:
${JSON.stringify(propertyData, null, 2)}

User Preferences:
${JSON.stringify(userPreferences, null, 2)}

Please respond with a JSON object containing:
{
  "score": (number from 1-100),
  "reasoning": "Brief explanation of the score",
  "highlights": ["key matching feature 1", "key matching feature 2", "key matching feature 3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI real estate analyst specializing in lifestyle compatibility analysis. Provide accurate, helpful assessments based on property features and user preferences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"score": 75, "reasoning": "Good match", "highlights": []}');
    
    return {
      score: Math.max(1, Math.min(100, result.score)),
      reasoning: result.reasoning || "Property analysis completed",
      highlights: result.highlights || []
    };

  } catch (error) {
    console.error("Error analyzing lifestyle match:", error);
    return {
      score: 75,
      reasoning: "Unable to complete detailed analysis at this time",
      highlights: ["Property location", "Available amenities", "Investment potential"]
    };
  }
}
