import Navigation from "@/components/navigation";
import PropertyCard from "@/components/property-card";
import FloatingActions from "@/components/floating-actions";
import { useProperties } from "@/hooks/use-properties";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Shield, MapPin, Building2, DollarSign, Clock } from "lucide-react";

export default function MLSListings() {
  const { data: properties, isLoading } = useProperties();

  const totalValue = properties?.reduce((sum, property) => sum + Number(property.price), 0) || 0;
  const avgPrice = properties?.length ? totalValue / properties.length : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <Badge className="bg-green-600 text-white px-6 py-3 text-lg font-bold">
                <Shield className="h-5 w-5 mr-2" />
                100% Authentic Hawaii MLS Database
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-6 text-primary">
              Official MLS Listings
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Direct access to Hawaii's MLS database. All properties verified through HiCentral MLS with real pricing, photos, and details.
            </p>
            
            {/* MLS Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
                <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{properties?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">${avgPrice ? (avgPrice / 1000000).toFixed(1) : 0}M</div>
                <div className="text-sm text-muted-foreground">Average Price</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Premium Areas</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">Live</div>
                <div className="text-sm text-muted-foreground">Real-time Updates</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MLS Properties Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Current Hawaii MLS Inventory</h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                Diamond Head • Lanikai • Ala Moana • Hawaii Loa Ridge • Mokuleia • Waimanalo
              </p>
            </div>
            <div className="inline-block bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2">
              <p className="text-green-700 dark:text-green-300 font-semibold">
                Last Updated: Real-time via automated MLS scraper
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              properties?.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))
            )}
          </div>
          
          {!isLoading && properties?.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-yellow-700 dark:text-yellow-300 text-lg font-semibold mb-2">
                  No Active MLS Listings
                </p>
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                  The MLS scraper will automatically update when new luxury properties become available.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MLS Information */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Our MLS Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Verified Authentic Data</h3>
              <p className="text-muted-foreground">
                All listings are directly sourced from HiCentral MLS database with verified pricing, photos, and property details.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Our automated MLS scraper updates property data every hour to ensure you see the latest available luxury listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FloatingActions />
    </div>
  );
}