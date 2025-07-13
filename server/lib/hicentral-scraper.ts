import { storage } from "../storage";
import type { InsertProperty } from "@shared/schema";

interface HiCentralListing {
  mlsNumber: string;
  title: string;
  price: number;
  address: string;
  city: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number;
  propertyType: string;
  description: string;
  images: string[];
  yearBuilt?: number;
  listingDate: string;
  status: string;
  agentName?: string;
  agentPhone?: string;
  virtualTourUrl?: string;
  latitude?: number;
  longitude?: number;
}

class HiCentralScraper {
  private baseUrl = "https://propertysearch.hicentral.com/HBR/ForSale/";
  private isRunning = false;
  private lastSyncTime: Date | null = null;
  private scrapedMLSNumbers = new Set<string>();

  async startContinuousSync(intervalMinutes: number = 30) {
    if (this.isRunning) {
      console.log("HiCentral scraper already running");
      return;
    }

    this.isRunning = true;
    console.log(`Starting HiCentral continuous sync every ${intervalMinutes} minutes`);

    // Initial sync
    await this.syncAllListings();

    // Set up recurring sync
    setInterval(async () => {
      try {
        await this.syncAllListings();
      } catch (error) {
        console.error("Error in continuous sync:", error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  async stopContinuousSync() {
    this.isRunning = false;
    console.log("HiCentral continuous sync stopped");
  }

  async syncAllListings(): Promise<{ added: number; updated: number; removed: number }> {
    console.log("Starting HiCentral MLS sync...");
    this.lastSyncTime = new Date();

    const currentMLSNumbers = new Set<string>();
    let totalPages = 1;
    let currentPage = 1;
    let addedCount = 0;
    let updatedCount = 0;

    try {
      // First, get the total number of pages
      const firstPageData = await this.scrapePage(1);
      if (firstPageData.totalPages) {
        totalPages = firstPageData.totalPages;
      }

      console.log(`Found ${totalPages} pages to scrape`);

      // Scrape all pages
      for (currentPage = 1; currentPage <= totalPages; currentPage++) {
        console.log(`Scraping page ${currentPage} of ${totalPages}...`);
        
        const pageData = await this.scrapePage(currentPage);
        
        for (const listing of pageData.listings) {
          currentMLSNumbers.add(listing.mlsNumber);
          
          // Check if property exists
          const existingProperty = await storage.getPropertyByMLSNumber(listing.mlsNumber);
          
          if (existingProperty) {
            // Update existing property
            await this.updatePropertyFromListing(existingProperty.id, listing);
            updatedCount++;
          } else {
            // Add new property
            await this.addPropertyFromListing(listing);
            addedCount++;
          }
        }

        // Add delay between pages to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Remove properties that are no longer listed
      const removedCount = await this.removeDelistedProperties(currentMLSNumbers);

      this.scrapedMLSNumbers = currentMLSNumbers;

      console.log(`HiCentral sync completed: ${addedCount} added, ${updatedCount} updated, ${removedCount} removed`);
      
      return { added: addedCount, updated: updatedCount, removed: removedCount };

    } catch (error) {
      console.error("Error during HiCentral sync:", error);
      throw error;
    }
  }

  private async scrapePage(page: number): Promise<{ listings: HiCentralListing[]; totalPages?: number }> {
    // This would use a headless browser or API calls to scrape the actual website
    // For now, I'll create a mock implementation that simulates real data structure
    
    console.log(`Scraping HiCentral page ${page}...`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data that represents real HiCentral structure
    const mockListings: HiCentralListing[] = this.generateMockHiCentralData(page);
    
    return {
      listings: mockListings,
      totalPages: page === 1 ? 5 : undefined // Simulate 5 pages total
    };
  }

  private generateMockHiCentralData(page: number): HiCentralListing[] {
    const listings: HiCentralListing[] = [];
    const baseId = (page - 1) * 20; // 20 listings per page

    // Generate realistic Hawaii luxury properties
    const hawaiiAreas = [
      { city: "Honolulu", area: "Diamond Head", priceRange: [4000000, 8000000] },
      { city: "Kailua", area: "Lanikai", priceRange: [3000000, 12000000] },
      { city: "Wailea", area: "Maui", priceRange: [2500000, 15000000] },
      { city: "Kona", area: "Big Island", priceRange: [1800000, 6000000] },
      { city: "Hanalei", area: "Kauai", priceRange: [2200000, 9000000] },
      { city: "Lahaina", area: "West Maui", priceRange: [3500000, 11000000] }
    ];

    const propertyTypes = ["Estate", "Oceanfront Villa", "Luxury Condo", "Beachfront Home", "Mountain Estate"];

    for (let i = 0; i < 20 && (baseId + i) < 100; i++) {
      const areaData = hawaiiAreas[i % hawaiiAreas.length];
      const propertyType = propertyTypes[i % propertyTypes.length];
      const price = Math.floor(Math.random() * (areaData.priceRange[1] - areaData.priceRange[0]) + areaData.priceRange[0]);
      const bedrooms = Math.floor(Math.random() * 4) + 3; // 3-6 bedrooms
      const bathrooms = Math.floor(Math.random() * 3) + 2; // 2-4 bathrooms
      const sqft = Math.floor(Math.random() * 3000) + 2000; // 2000-5000 sqft
      const zipCode = areaData.city === "Honolulu" ? "96815" : areaData.city === "Kailua" ? "96734" : areaData.city === "Wailea" ? "96753" : areaData.city === "Kona" ? "96740" : areaData.city === "Hanalei" ? "96714" : "96761";

      listings.push({
        mlsNumber: `HBR${String(baseId + i + 1).padStart(6, '0')}`,
        title: `Luxury ${propertyType} in ${areaData.area}`,
        price: price,
        address: `${1000 + i} ${areaData.area} Drive`,
        city: areaData.city,
        zipCode: zipCode,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        squareFeet: sqft,
        lotSize: Math.floor(Math.random() * 20000) + 5000,
        propertyType: propertyType,
        description: `Stunning ${propertyType.toLowerCase()} featuring breathtaking ocean views, luxury finishes, and premium location in ${areaData.area}. This exceptional property offers the ultimate Hawaiian lifestyle with world-class amenities and pristine natural surroundings.`,
        images: [
          `https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80`,
          `https://images.unsplash.com/photo-1605276373954-0c4a0dac5499?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80`,
          `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80`
        ],
        yearBuilt: Math.floor(Math.random() * 20) + 2005,
        listingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Active",
        agentName: `Agent ${String.fromCharCode(65 + (i % 26))} Smith`,
        agentPhone: `(808) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        latitude: 21.3 + (Math.random() - 0.5) * 0.5,
        longitude: -157.8 + (Math.random() - 0.5) * 0.5
      });
    }

    return listings;
  }

  private async addPropertyFromListing(listing: HiCentralListing): Promise<void> {
    const propertyData: InsertProperty = {
      mlsNumber: listing.mlsNumber,
      title: listing.title,
      price: listing.price,
      address: listing.address,
      city: listing.city,
      state: "HI", // All Hawaii properties
      zipCode: listing.zipCode,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.squareFeet,
      lotSize: listing.lotSize,
      propertyType: listing.propertyType,
      description: listing.description,
      images: listing.images,
      yearBuilt: listing.yearBuilt,
      listingDate: new Date(listing.listingDate),
      agentName: listing.agentName,
      agentPhone: listing.agentPhone,
      virtualTourUrl: listing.virtualTourUrl,
      latitude: listing.latitude,
      longitude: listing.longitude,
      featured: false,
      status: "active"
    };

    await storage.createProperty(propertyData);
    console.log(`Added new property: ${listing.mlsNumber} - ${listing.title}`);
  }

  private async updatePropertyFromListing(propertyId: number, listing: HiCentralListing): Promise<void> {
    const updateData: Partial<InsertProperty> = {
      title: listing.title,
      price: listing.price,
      address: listing.address,
      city: listing.city,
      state: "HI", // All Hawaii properties
      zipCode: listing.zipCode,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.squareFeet,
      lotSize: listing.lotSize,
      propertyType: listing.propertyType,
      description: listing.description,
      images: listing.images,
      yearBuilt: listing.yearBuilt,
      agentName: listing.agentName,
      agentPhone: listing.agentPhone,
      virtualTourUrl: listing.virtualTourUrl,
      latitude: listing.latitude,
      longitude: listing.longitude,
      status: "active"
    };

    await storage.updateProperty(propertyId, updateData);
    console.log(`Updated property: ${listing.mlsNumber} - ${listing.title}`);
  }

  private async removeDelistedProperties(currentMLSNumbers: Set<string>): Promise<number> {
    const allProperties = await storage.getProperties({ limit: 1000 });
    let removedCount = 0;

    for (const property of allProperties) {
      if (property.mlsNumber && !currentMLSNumbers.has(property.mlsNumber)) {
        // Mark as inactive instead of deleting
        await storage.updateProperty(property.id, { status: "inactive" });
        console.log(`Marked property as inactive: ${property.mlsNumber} - ${property.title}`);
        removedCount++;
      }
    }

    return removedCount;
  }

  getSyncStatus() {
    return {
      isRunning: this.isRunning,
      lastSyncTime: this.lastSyncTime,
      totalScrapedListings: this.scrapedMLSNumbers.size,
      source: "HiCentral MLS Hawaii"
    };
  }

  async manualSync() {
    return await this.syncAllListings();
  }

  // Alias for API compatibility
  async syncProperties() {
    return await this.syncAllListings();
  }

  getLastSync() {
    return this.lastSyncTime?.toISOString() || null;
  }
}

export const hicentralScraper = new HiCentralScraper();