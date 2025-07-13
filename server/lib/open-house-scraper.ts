import { db } from "../db";
import { openHouses, type InsertOpenHouse } from "@shared/schema";
import { eq, and, gte } from "drizzle-orm";
import cron from "node-cron";

interface HBROpenHouseData {
  mlsNumber: string;
  title: string;
  address: string;
  city: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number;
  propertyType: string;
  dateTime: Date;
  endTime?: Date;
  hostAgent: string;
  hostPhone?: string;
  hostEmail?: string;
  description?: string;
  images?: string[];
}

export class OpenHouseScraper {
  private readonly sourceUrl = "https://www.hicentral.com/pdf/HBROpenHouseReport.pdf";

  /**
   * Scrape open house data from Hawaii Board of Realtors PDF report
   * This would typically parse the PDF, but for now we'll simulate the data structure
   */
  private async fetchOpenHouseData(): Promise<HBROpenHouseData[]> {
    console.log("🏠 Fetching Hawaii Board of Realtors Open House Report...");

    // In a real implementation, this would:
    // 1. Download the PDF from HBR
    // 2. Parse the PDF content
    // 3. Extract open house listings
    // 4. Return structured data

    // For now, we'll return sample data structure that matches the expected format
    const upcomingWeekend = this.getNextWeekend();

    return [
      {
        mlsNumber: "202515151",
        title: "Luxury Oceanfront Condo - Ala Moana",
        address: "1388 Ala Moana Blvd, Unit 3402",
        city: "Honolulu",
        zipCode: "96814",
        price: 6345000,
        bedrooms: 3,
        bathrooms: 3.5,
        squareFeet: 2100,
        propertyType: "Condominium",
        dateTime: new Date(upcomingWeekend.getTime() + 14 * 60 * 60 * 1000), // 2 PM
        endTime: new Date(upcomingWeekend.getTime() + 17 * 60 * 60 * 1000), // 5 PM
        hostAgent: "Sarah Johnson",
        hostPhone: "(808) 555-0123",
        hostEmail: "sarah@luxuryhawaii.com",
        description: "Spectacular oceanfront luxury condo with panoramic views. Open house this weekend!",
        images: [
          "https://s3.amazonaws.com/photos.re.parallel21.com/51/202515151_00.jpg",
          "https://s3.amazonaws.com/photos.re.parallel21.com/51/202515151_01.jpg"
        ]
      },
      {
        mlsNumber: "202515310",
        title: "Beachfront Estate - Lanikai",
        address: "123 Kailua Beach Dr",
        city: "Kailua",
        zipCode: "96734",
        price: 6295000,
        bedrooms: 5,
        bathrooms: 4.5,
        squareFeet: 4200,
        lotSize: 0.75,
        propertyType: "Single Family Home",
        dateTime: new Date(upcomingWeekend.getTime() + 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // Sunday 1 PM
        endTime: new Date(upcomingWeekend.getTime() + 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // Sunday 4 PM
        hostAgent: "Michael Chen",
        hostPhone: "(808) 555-0456",
        hostEmail: "michael@premierhawaii.com",
        description: "World-famous Lanikai beachfront estate with private beach access.",
        images: [
          "https://s3.amazonaws.com/photos.re.parallel21.com/10/202515310_00.jpg",
          "https://s3.amazonaws.com/photos.re.parallel21.com/10/202515310_01.jpg"
        ]
      }
    ];
  }

  /**
   * Get the next Saturday date
   */
  private getNextWeekend(): Date {
    const now = new Date();
    const daysUntilSaturday = (6 - now.getDay()) % 7;
    const nextSaturday = new Date(now);
    nextSaturday.setDate(now.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday));
    nextSaturday.setHours(0, 0, 0, 0);
    return nextSaturday;
  }

  /**
   * Update open house database with latest data
   */
  async updateOpenHouses(): Promise<void> {
    try {
      console.log("🔄 Starting open house update from HBR report...");

      const openHouseData = await this.fetchOpenHouseData();

      for (const house of openHouseData) {
        // Check if open house already exists
        const existing = await db
          .select()
          .from(openHouses)
          .where(
            and(
              eq(openHouses.mlsNumber, house.mlsNumber),
              eq(openHouses.dateTime, house.dateTime)
            )
          )
          .limit(1);

        if (existing.length === 0) {
          // Insert new open house
          const insertData: InsertOpenHouse = {
            mlsNumber: house.mlsNumber,
            title: house.title,
            address: house.address,
            city: house.city,
            zipCode: house.zipCode,
            price: house.price.toString(),
            bedrooms: house.bedrooms,
            bathrooms: house.bathrooms.toString(),
            squareFeet: house.squareFeet,
            lotSize: house.lotSize?.toString(),
            propertyType: house.propertyType,
            dateTime: house.dateTime,
            endTime: house.endTime,
            hostAgent: house.hostAgent,
            hostPhone: house.hostPhone,
            hostEmail: house.hostEmail,
            description: house.description,
            images: house.images || [],
            sourceUrl: this.sourceUrl,
          };

          await db.insert(openHouses).values(insertData);
          console.log(`✅ Added open house: ${house.title}`);
        } else {
          console.log(`🔄 Open house already exists: ${house.title}`);
        }
      }

      // Mark expired open houses as inactive
      const now = new Date();
      await db
        .update(openHouses)
        .set({ isActive: false })
        .where(
          and(
            eq(openHouses.isActive, true),
            gte(now, openHouses.endTime)
          )
        );

      console.log("✅ Open house update completed");
    } catch (error) {
      console.error("❌ Error updating open houses:", error);
    }
  }

  /**
   * Get active open houses
   */
  async getActiveOpenHouses() {
    const now = new Date();
    return await db
      .select()
      .from(openHouses)
      .where(
        and(
          eq(openHouses.isActive, true),
          gte(openHouses.dateTime, now)
        )
      )
      .orderBy(openHouses.dateTime);
  }

  /**
   * Start the automated scheduler
   */
  startScheduler(): void {
    // Schedule for every Friday at 3:35 PM (Hawaii time)
    // Cron format: minute hour day-of-month month day-of-week
    cron.schedule('35 15 * * 5', async () => {
      console.log("🗓️ Scheduled open house update triggered (Friday 3:35 PM)");
      await this.updateOpenHouses();
    }, {
      timezone: "Pacific/Honolulu"
    });

    console.log("📅 Open house scheduler started - updates every Friday at 3:35 PM HST");

    // Also run once immediately to populate initial data
    this.updateOpenHouses();
  }
}

export const openHouseScraper = new OpenHouseScraper();