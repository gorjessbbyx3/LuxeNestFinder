import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: any;
let db: any;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. Database features will be unavailable.");
  // For migration compatibility, we'll create a mock pool
  pool = {
    query: () => Promise.reject(new Error("Database not configured")),
    connect: () => Promise.reject(new Error("Database not configured")),
  };
  db = null;
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };