import Navigation from "@/components/navigation";
import FloatingActions from "@/components/floating-actions";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star, Shield, GraduationCap, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Neighborhoods() {
  const { data: neighborhoods, isLoading } = useQuery({
    queryKey: ["/api/neighborhoods"],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-muted to-background">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-6 text-primary">
              Neighborhood Spotlight
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover what makes each Hawaiian neighborhood special with AI-powered insights, local expertise, and comprehensive data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="py-12 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">AI-Powered Neighborhood Analysis</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our advanced analytics provide deep insights into every neighborhood's lifestyle, investment potential, and community features.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Market Trends</h3>
                  <p className="text-muted-foreground text-sm">
                    Real-time property value changes and investment forecasts
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Safety Scores</h3>
                  <p className="text-muted-foreground text-sm">
                    Comprehensive crime data and neighborhood safety ratings
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">School Quality</h3>
                  <p className="text-muted-foreground text-sm">
                    Educational ratings and achievement data for families
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Lifestyle Score</h3>
                  <p className="text-muted-foreground text-sm">
                    Recreation, dining, shopping, and community amenities
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Neighborhoods Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              neighborhoods?.map((neighborhood: any, index: number) => (
                <motion.div
                  key={neighborhood.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative h-48">
                      <img 
                        src={neighborhood.image || `https://images.unsplash.com/photo-${1544551763 + index}46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300`}
                        alt={neighborhood.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{neighborhood.name}</h3>
                        <p className="text-sm opacity-90 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {neighborhood.city}
                        </p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      {/* Neighborhood Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary flex items-center justify-center">
                            <Star className="w-4 h-4 mr-1" />
                            {neighborhood.safetyScore || '9.2'}
                          </div>
                          <div className="text-xs text-muted-foreground">Safety</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 mr-1" />
                            {neighborhood.schoolRating || '8.7'}
                          </div>
                          <div className="text-xs text-muted-foreground">Schools</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">
                            ${neighborhood.averagePrice ? `${(Number(neighborhood.averagePrice) / 1000000).toFixed(1)}M` : '2.1M'}
                          </div>
                          <div className="text-xs text-muted-foreground">Avg Price</div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {neighborhood.description || "Discover luxury living in this premier Hawaiian neighborhood with world-class amenities, stunning natural beauty, and exceptional community features."}
                      </p>
                      
                      {/* Key Features */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Waterfront Access</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Luxury Amenities</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Fine Dining</span>
                        </div>
                      </div>
                      
                      {/* Popular Spots */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Popular Spots</h4>
                        <div className="flex flex-wrap gap-1">
                          {(neighborhood.popularSpots || ['Beach Access', 'Resort Area', 'Golf Course']).slice(0, 3).map((spot: string) => (
                            <Badge key={spot} variant="secondary" className="text-xs">
                              {spot}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Investment Growth */}
                      {neighborhood.investmentGrowth && (
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">5-Year Growth</span>
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              <span className="font-bold">+{neighborhood.investmentGrowth}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <Button className="w-full">
                        Explore {neighborhood.name} Properties
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Need Help Choosing the Perfect Neighborhood?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our local experts and AI-powered insights can help you find the neighborhood that perfectly matches your lifestyle and investment goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground">
                <Users className="w-5 h-5 mr-2" />
                Speak with Local Expert
              </Button>
              <Button size="lg" variant="outline">
                <Star className="w-5 h-5 mr-2" />
                Get AI Recommendations
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <FloatingActions />
    </div>
  );
}
