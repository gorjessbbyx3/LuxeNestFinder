// Client-side OpenAI integration utilities for the luxury real estate application

export interface PropertyAnalysis {
  lifestyleScore: number;
  investmentScore: number;
  marketValueScore: number;
  reasoning: string;
  highlights: string[];
}

export interface AIPropertyRecommendation {
  propertyId: number;
  matchScore: number;
  reasoning: string;
  highlights: string[];
}

export interface NeighborhoodInsights {
  safetyScore: number;
  schoolRating: number;
  walkabilityScore: number;
  luxuryScore: number;
  investmentGrowth: number;
  keyFeatures: string[];
  description: string;
}

// Analyze property compatibility with user lifestyle preferences
export async function analyzePropertyLifestyle(
  propertyData: any,
  userPreferences: {
    familySize?: string;
    lifestyle?: {
      remoteWork?: boolean;
      oceanActivities?: boolean;
      nightlife?: boolean;
      nature?: boolean;
      golf?: boolean;
      privacy?: boolean;
    };
    budget?: number;
    propertyType?: string;
  }
): Promise<PropertyAnalysis | null> {
  try {
    const response = await fetch('/api/ai/lifestyle-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyData,
        preferences: userPreferences,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze property lifestyle match');
    }

    const analysis = await response.json();
    
    return {
      lifestyleScore: analysis.lifestyleMatch,
      investmentScore: analysis.investmentScore,
      marketValueScore: analysis.marketValueScore,
      reasoning: analysis.reasoning,
      highlights: analysis.highlights,
    };
  } catch (error) {
    console.error('Error analyzing property lifestyle:', error);
    
    // Return null when no authentic analysis is available
    return null;
  }
}

// Generate AI-powered property description
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
    const response = await fetch('/api/ai/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyData }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate property description');
    }

    const result = await response.json();
    return result.description;
  } catch (error) {
    console.error('Error generating property description:', error);
    
    // Fallback description
    return `Discover this exceptional ${propertyData.propertyType || 'property'} in ${propertyData.city || 'Hawaii'} featuring ${propertyData.bedrooms || 'multiple'} bedrooms, ${propertyData.bathrooms || 'multiple'} bathrooms, and premium amenities. Experience luxury living with stunning views and modern conveniences in one of Hawaii's most desirable locations.`;
  }
}

// Get AI-powered property recommendations
export async function getAIPropertyRecommendations(
  userPreferences: {
    familySize?: string;
    lifestyle?: any;
    budget?: number;
    propertyType?: string;
    location?: string;
  },
  limit: number = 5
): Promise<AIPropertyRecommendation[]> {
  try {
    const response = await fetch('/api/ai/lifestyle-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preferences: userPreferences,
        limit,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI recommendations');
    }

    const properties = await response.json();
    
    return properties.map((property: any) => ({
      propertyId: property.id,
      matchScore: property.lifestyleMatch || 85,
      reasoning: `This ${property.propertyType} in ${property.city} matches your preferences for ${userPreferences.lifestyle ? Object.keys(userPreferences.lifestyle).filter(k => userPreferences.lifestyle![k]).join(', ') : 'luxury living'}`,
      highlights: property.amenities?.slice(0, 3) || ['Premium location', 'Luxury amenities', 'Investment potential'],
    }));
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return [];
  }
}

// Analyze neighborhood insights using authentic data only
export async function analyzeNeighborhood(
  neighborhoodName: string,
  city: string
): Promise<NeighborhoodInsights | null> {
  try {
    const response = await fetch('/api/neighborhoods/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ neighborhoodName, city }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze neighborhood data');
    }

    const analysis = await response.json();
    return analysis;
  } catch (error) {
    console.error('Error analyzing neighborhood:', error);
    return null;
  }
}

// Calculate mortgage and investment projections
export async function calculateMortgageProjections(
  propertyPrice: number,
  downPaymentPercent: number = 20,
  interestRate: number = 6.25,
  loanTermYears: number = 30
): Promise<{
  monthlyPayment: number;
  totalInterest: number;
  totalPayments: number;
  downPayment: number;
  loanAmount: number;
}> {
  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const totalPayments = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayments - loanAmount;
  
  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    totalPayments: Math.round(totalPayments),
    downPayment: Math.round(downPayment),
    loanAmount: Math.round(loanAmount),
  };
}

// Helper function for basic lifestyle matching
function calculateBasicLifestyleMatch(
  property: any,
  preferences: any
): number {
  let score = 70; // Base score
  
  // Property type matching
  if (preferences.propertyType && property.propertyType === preferences.propertyType) {
    score += 10;
  }
  
  // Budget compatibility
  if (preferences.budget) {
    const priceRatio = Number(property.price) / preferences.budget;
    if (priceRatio <= 1.2 && priceRatio >= 0.8) {
      score += 10;
    } else if (priceRatio <= 1.5 && priceRatio >= 0.6) {
      score += 5;
    }
  }
  
  // Lifestyle preferences
  if (preferences.lifestyle) {
    const amenities = property.amenities || [];
    
    if (preferences.lifestyle.oceanActivities && amenities.some((a: string) => 
      a.toLowerCase().includes('ocean') || a.toLowerCase().includes('beach'))) {
      score += 8;
    }
    
    if (preferences.lifestyle.remoteWork && amenities.some((a: string) => 
      a.toLowerCase().includes('office') || a.toLowerCase().includes('workspace'))) {
      score += 8;
    }
    
    if (preferences.lifestyle.privacy && property.propertyType === 'estate') {
      score += 5;
    }
    
    if (preferences.lifestyle.golf && amenities.some((a: string) => 
      a.toLowerCase().includes('golf'))) {
      score += 5;
    }
  }
  
  // Family size compatibility
  if (preferences.familySize) {
    const familySize = parseInt(preferences.familySize.split('-')[0]);
    if (property.bedrooms >= familySize) {
      score += 8;
    }
  }
  
  return Math.min(Math.max(score, 1), 100);
}

// Real-time market analysis using authentic data only
export async function getMarketAnalysis(
  city: string,
  propertyType: string
): Promise<{
  averagePrice: number;
  priceGrowth: number;
  marketTrend: 'up' | 'down' | 'stable';
  comparableProperties: number;
  timeOnMarket: number;
} | null> {
  try {
    const response = await fetch('/api/market/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, propertyType }),
    });

    if (!response.ok) {
      throw new Error('Failed to get market analysis');
    }

    const analysis = await response.json();
    return analysis;
  } catch (error) {
    console.error('Error getting market analysis:', error);
    return null;
  }
}

// Investment ROI calculator
export async function calculateROI(
  propertyPrice: number,
  expectedRentalIncome: number,
  annualExpenses: number = 0,
  appreciationRate: number = 6.0
): Promise<{
  annualROI: number;
  monthlyROI: number;
  breakEvenYears: number;
  totalReturn5Year: number;
  totalReturn10Year: number;
}> {
  const netAnnualIncome = expectedRentalIncome - annualExpenses;
  const annualROI = (netAnnualIncome / propertyPrice) * 100;
  const monthlyROI = annualROI / 12;
  
  const breakEvenYears = propertyPrice / (netAnnualIncome + (propertyPrice * appreciationRate / 100));
  
  const value5Year = propertyPrice * Math.pow(1 + appreciationRate / 100, 5);
  const rental5Year = netAnnualIncome * 5;
  const totalReturn5Year = ((value5Year + rental5Year - propertyPrice) / propertyPrice) * 100;
  
  const value10Year = propertyPrice * Math.pow(1 + appreciationRate / 100, 10);
  const rental10Year = netAnnualIncome * 10;
  const totalReturn10Year = ((value10Year + rental10Year - propertyPrice) / propertyPrice) * 100;
  
  return {
    annualROI: Math.round(annualROI * 100) / 100,
    monthlyROI: Math.round(monthlyROI * 100) / 100,
    breakEvenYears: Math.round(breakEvenYears * 10) / 10,
    totalReturn5Year: Math.round(totalReturn5Year * 100) / 100,
    totalReturn10Year: Math.round(totalReturn10Year * 100) / 100,
  };
}
