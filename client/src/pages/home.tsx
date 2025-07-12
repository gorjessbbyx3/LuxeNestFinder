import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import PropertySearch from "@/components/property-search";
import PropertyCard from "@/components/property-card";
import RealEstateMap from "@/components/real-estate-map";
import VirtualTourViewer from "@/components/virtual-tour-viewer";
import AIChat from "@/components/ai-chat";
import PropertyComparison from "@/components/property-comparison";
import OpenHouseComponent from "@/components/open-house-component";
import FloatingActions from "@/components/floating-actions";
import Footer from "@/components/footer";
import { useProperties } from "@/hooks/use-properties";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: featuredProperties, isLoading: propertiesLoading } = useProperties({ 
    featured: true, 
    limit: 3 
  });
  
  const { data: neighborhoods, isLoading: neighborhoodsLoading } = useQuery({
    queryKey: ["/api/neighborhoods"],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      
      {/* AI-Powered Search Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-serif font-bold mb-6 text-primary">
              AI-Powered Property Discovery
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Let our intelligent algorithms find your perfect home based on lifestyle, not just specifications.
            </p>
          </motion.div>
          
          <PropertySearch />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-semibold">
                <Shield className="h-4 w-4 mr-2" />
                Authentic Hawaii MLS Properties
              </Badge>
            </div>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 text-primary">
              Real Luxury Collection
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Authentic Hawaii luxury listings from $2.9M to $6.3M, sourced directly from HiCentral MLS database.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {propertiesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              featuredProperties?.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))
            )}
          </div>
          
          <div className="text-center">
            <Link href="/properties">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                View All MLS Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Map Search */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 text-primary">
              Elite Property Intelligence Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced analytics, investment metrics, and lifestyle scoring for Hawaii's most exclusive properties. Real data, real locations, real insights.
            </p>
          </motion.div>
          
          <RealEstateMap />
        </div>
      </section>

      {/* 3D Virtual Tours */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 text-primary">
              Immersive 3D Experiences
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Step inside your future home with cutting-edge virtual reality tours and AI-guided exploration.
            </p>
          </motion.div>
          
          <VirtualTourViewer />
        </div>
      </section>

      {/* Open House Listings */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-4">
              <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold">
                <Shield className="h-4 w-4 mr-2" />
                Updated Every Friday 3:35 PM
              </Badge>
            </div>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 text-primary">
              Hawaii Open Houses
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Authentic open house listings from Hawaii Board of Realtors. Automatically updated weekly from official HBR reports.
            </p>
          </motion.div>
          
          <OpenHouseComponent />
        </div>
      </section>

      {/* Property Comparison */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 text-primary">
              Smart Property Comparison
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Compare properties with AI-powered insights that go beyond basic specs to analyze lifestyle fit and investment potential.
            </p>
          </motion.div>
          
          <PropertyComparison />
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  );
}
