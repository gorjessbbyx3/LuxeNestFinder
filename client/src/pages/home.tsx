import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import PropertySearch from "@/components/property-search";
import PropertyCard from "@/components/property-card";
import RealEstateMap from "@/components/real-estate-map";
import VirtualTourViewer from "@/components/virtual-tour-viewer";
import AIChat from "@/components/ai-chat";
import PropertyComparison from "@/components/property-comparison";
import FloatingActions from "@/components/floating-actions";
import Footer from "@/components/footer";
import { useProperties } from "@/hooks/use-properties";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 text-primary">
              Curated Luxury Collection
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each property is handpicked for its exceptional quality, location, and investment potential.
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
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              View All Properties
            </Button>
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

      {/* Neighborhood Spotlight */}
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
              Neighborhood Spotlight
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover what makes each Hawaiian neighborhood special with AI-powered insights and local expertise.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {neighborhoodsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : (
              neighborhoods?.slice(0, 3).map((neighborhood: any) => (
                <motion.div
                  key={neighborhood.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="relative h-48">
                    <img 
                      src={neighborhood.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"} 
                      alt={neighborhood.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{neighborhood.name}</h3>
                      <p className="text-sm opacity-90">{neighborhood.city}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">{neighborhood.safetyScore || '9.2'}</div>
                        <div className="text-xs text-muted-foreground">Safety Score</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">{neighborhood.schoolRating || '8.7'}</div>
                        <div className="text-xs text-muted-foreground">Schools</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">
                          ${neighborhood.averagePrice ? `${(Number(neighborhood.averagePrice) / 1000000).toFixed(1)}M` : '2.1M'}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Price</div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {neighborhood.description || "Discover luxury living in this premier Hawaiian neighborhood."}
                    </p>
                    
                    <Button className="w-full">
                      Explore {neighborhood.name} Properties
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
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
