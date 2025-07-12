/**
 * Hawaii MLS Web Scraper Service
 * Automatically scrapes new listings from HiCentral MLS
 * Updates database with real Hawaii luxury properties
 */

import { storage } from "../storage";
import { HiCentralListing, hiCentralMLSService } from "./hicentral-mls";

interface ScrapedListing {
  mlsNumber: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqftLiving: number;
  sqftLand?: number;
  propertyType: string;
  address: string;
  city: string;
  neighborhood: string;
  images: string[];
  amenities: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  listDate: string;
  daysOnMarket: number;
  status: string;
  features: {
    oceanView?: boolean;
    poolSpa?: boolean;
    airConditioning?: boolean;
    garage?: number;
    parking?: number;
  };
}

export class MLSScraperService {
  private readonly baseUrl = 'https://propertysearch.hicentral.com/HBR/ForSale';
  private lastScrapeTime: Date = new Date('2025-01-01');
  
  /**
   * Main scraper function - fetches new listings and updates database
   */
  async scrapeNewListings(): Promise<void> {
    console.log('🔍 Starting MLS scraper for new Hawaii luxury listings...');
    
    try {
      // Get latest MLS listings
      const mlsListings = await hiCentralMLSService.getLuxuryListings(0);
      
      // Convert MLS listings to our property format (skip duplicates)
      let newCount = 0;
      for (const mlsListing of mlsListings) {
        try {
          // Check if property already exists
          const existingProperty = await this.checkIfPropertyExists(mlsListing.mlsNumber);
          if (existingProperty) {
            console.log(`⏭️ Skipping existing property MLS#${mlsListing.mlsNumber}`);
            continue;
          }
          
          const scrapedProperty = await this.convertMLSToProperty(mlsListing);
          await this.savePropertyToDatabase(scrapedProperty);
          newCount++;
        } catch (error) {
          console.error(`❌ Error processing MLS#${mlsListing.mlsNumber}:`, error);
        }
      }
      
      this.lastScrapeTime = new Date();
      console.log(`✅ Successfully scraped ${newCount} new MLS listings`);
      
    } catch (error) {
      console.error('❌ Error scraping MLS listings:', error);
      throw error;
    }
  }

  /**
   * Convert HiCentral MLS listing to our property format
   */
  private async convertMLSToProperty(mlsListing: HiCentralListing): Promise<ScrapedListing> {
    // Generate rich property description
    const title = this.generatePropertyTitle(mlsListing);
    const description = this.generatePropertyDescription(mlsListing);
    const amenities = this.extractAmenities(mlsListing);

    return {
      mlsNumber: mlsListing.mlsNumber,
      title,
      description,
      price: mlsListing.listPrice,
      bedrooms: mlsListing.details.bedrooms,
      bathrooms: mlsListing.details.bathrooms,
      sqftLiving: mlsListing.details.sqftLiving,
      sqftLand: mlsListing.details.sqftLand,
      propertyType: this.mapPropertyType(mlsListing.propertyType),
      address: mlsListing.address.street,
      city: mlsListing.address.city,
      neighborhood: mlsListing.address.neighborhood,
      images: mlsListing.photos,
      amenities,
      coordinates: mlsListing.coordinates,
      listDate: mlsListing.listing.listDate,
      daysOnMarket: mlsListing.listing.daysOnMarket,
      status: mlsListing.listing.status.toLowerCase(),
      features: mlsListing.features,
    };
  }

  /**
   * Generate compelling property title from MLS data
   */
  private generatePropertyTitle(listing: HiCentralListing): string {
    const neighborhood = listing.address.neighborhood;
    const propertyType = listing.propertyType === 'Single Family Home' ? 'Estate' : 
                        listing.propertyType === 'Condo/Townhouse' ? 'Luxury Condo' : 
                        listing.propertyType;
    
    const oceanView = listing.features.oceanView ? 'Ocean View ' : '';
    const price = `$${(listing.listPrice / 1000000).toFixed(1)}M`;
    
    return `${oceanView}${propertyType} in ${neighborhood} - ${price}`;
  }

  /**
   * Generate rich property description from MLS data
   */
  private generatePropertyDescription(listing: HiCentralListing): string {
    const features = [];
    
    if (listing.features.oceanView) features.push('panoramic ocean views');
    if (listing.features.poolSpa) features.push('private pool and spa');
    if (listing.details.sqftLand && listing.details.sqftLand > 10000) features.push('expansive grounds');
    if (listing.address.neighborhood === 'Diamond Head') features.push('prestigious Diamond Head location');
    if (listing.address.neighborhood === 'Lanikai') features.push('world-famous Lanikai beachfront');
    if (listing.address.neighborhood === 'Ala Moana') features.push('luxury high-rise living');
    
    const baseDescription = listing.description || 
      `Exceptional ${listing.propertyType.toLowerCase()} offering ${listing.details.bedrooms} bedrooms and ${listing.details.bathrooms} bathrooms across ${listing.details.sqftLiving.toLocaleString()} square feet.`;
    
    const featureText = features.length > 0 ? ` This property features ${features.join(', ')}.` : '';
    const locationText = ` Located in the exclusive ${listing.address.neighborhood} neighborhood of ${listing.address.city}.`;
    
    return baseDescription + featureText + locationText;
  }

  /**
   * Extract amenities from MLS listing features
   */
  private extractAmenities(listing: HiCentralListing): string[] {
    const amenities: string[] = [];
    
    if (listing.features.oceanView) amenities.push('Ocean View');
    if (listing.features.poolSpa) amenities.push('Pool & Spa');
    if (listing.features.airConditioning) amenities.push('Air Conditioning');
    if (listing.features.garage && listing.features.garage > 0) {
      amenities.push(`${listing.features.garage}-Car Garage`);
    }
    if (listing.features.parking && listing.features.parking > 0) {
      amenities.push('Private Parking');
    }
    
    // Add location-based amenities
    if (listing.address.neighborhood === 'Lanikai') {
      amenities.push('Beach Access', 'Kayaking', 'World-Class Beach');
    }
    if (listing.address.neighborhood === 'Diamond Head') {
      amenities.push('Hiking Trails', 'Crater Views', 'Historic Area');
    }
    if (listing.address.neighborhood === 'Ala Moana') {
      amenities.push('Shopping Center', 'City Views', 'High-Rise Amenities');
    }
    
    return amenities;
  }

  /**
   * Map MLS property types to our system
   */
  private mapPropertyType(mlsType: string): string {
    switch (mlsType) {
      case 'Single Family Home': return 'house';
      case 'Condo/Townhouse': return 'condo';
      case 'Multi-Family': return 'multi-family';
      case 'Land': return 'land';
      default: return 'house';
    }
  }

  /**
   * Check if property already exists by MLS number
   */
  private async checkIfPropertyExists(mlsNumber: string): Promise<boolean> {
    try {
      const existingProperties = await storage.getProperties({ limit: 1000 });
      return existingProperties.some(p => 
        p.mlsNumber === mlsNumber || 
        p.title.includes(mlsNumber) || 
        p.description.includes(mlsNumber)
      );
    } catch (error) {
      console.error('Error checking property existence:', error);
      return false;
    }
  }

  /**
   * Save scraped property to database
   */
  private async savePropertyToDatabase(scrapedProperty: ScrapedListing): Promise<void> {
    try {
      // Check if property already exists by MLS number
      const existingProperties = await storage.getProperties();
      const existingProperty = existingProperties.find(p => 
        p.title.includes(scrapedProperty.mlsNumber) || 
        p.description.includes(scrapedProperty.mlsNumber)
      );

      if (existingProperty) {
        console.log(`🔄 Updating existing property MLS#${scrapedProperty.mlsNumber}`);
        await storage.updateProperty(existingProperty.id, {
          title: scrapedProperty.title,
          description: scrapedProperty.description,
          price: scrapedProperty.price,
          bedrooms: scrapedProperty.bedrooms,
          bathrooms: scrapedProperty.bathrooms,
          squareFeet: scrapedProperty.sqftLiving,
          propertyType: scrapedProperty.propertyType,
          images: scrapedProperty.images,
          amenities: scrapedProperty.amenities,
        });
      } else {
        console.log(`➕ Adding new property MLS#${scrapedProperty.mlsNumber}`);
        await storage.createProperty({
          title: scrapedProperty.title,
          description: scrapedProperty.description,
          price: scrapedProperty.price,
          bedrooms: scrapedProperty.bedrooms,
          bathrooms: scrapedProperty.bathrooms,
          squareFeet: scrapedProperty.sqftLiving,
          propertyType: scrapedProperty.propertyType,
          address: scrapedProperty.address,
          city: scrapedProperty.city,
          state: 'Hawaii',
          zipCode: '96815', // Default Hawaii zip
          images: scrapedProperty.images,
          amenities: scrapedProperty.amenities,
          virtualTourUrl: null,
          featured: scrapedProperty.price > 3000000, // Feature properties over $3M
          mlsNumber: scrapedProperty.mlsNumber,
          listingAgent: 'Hawaii Luxury Realty',
          yearBuilt: 2020, // Default for luxury properties
          lotSize: scrapedProperty.sqftLand || null,
          coordinates: scrapedProperty.coordinates ? 
            `${scrapedProperty.coordinates.lat},${scrapedProperty.coordinates.lng}` : null,
        });
      }
    } catch (error) {
      console.error(`❌ Error saving property MLS#${scrapedProperty.mlsNumber}:`, error);
    }
  }

  /**
   * Schedule automatic scraping every hour
   */
  startAutoScraping(): void {
    console.log('🚀 Starting automatic MLS scraping service...');
    
    // Initial scrape
    this.scrapeNewListings().catch(console.error);
    
    // Set up interval for every hour
    setInterval(async () => {
      try {
        await this.scrapeNewListings();
      } catch (error) {
        console.error('Scheduled scrape failed:', error);
      }
    }, 60 * 60 * 1000); // 1 hour in milliseconds
  }

  /**
   * Get scraper status and statistics
   */
  getScraperStatus(): {
    lastScrapeTime: Date;
    isRunning: boolean;
    nextScrapeIn: string;
  } {
    const nextScrapeTime = new Date(this.lastScrapeTime.getTime() + 60 * 60 * 1000);
    const msUntilNext = nextScrapeTime.getTime() - Date.now();
    const minutesUntilNext = Math.max(0, Math.floor(msUntilNext / (1000 * 60)));
    
    return {
      lastScrapeTime: this.lastScrapeTime,
      isRunning: true,
      nextScrapeIn: `${minutesUntilNext} minutes`,
    };
  }
}

export const mlsScraperService = new MLSScraperService();