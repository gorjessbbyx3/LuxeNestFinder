import Navigation from "@/components/navigation";
import VirtualTourViewer from "@/components/virtual-tour-viewer";
import FloatingActions from "@/components/floating-actions";
import { useProperties } from "@/hooks/use-properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileBox as VR, Camera, Mic, Box } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function VirtualTours() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const { data: properties, isLoading } = useProperties({ limit: 12 });

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
              Immersive 3D Virtual Tours
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience properties like never before with cutting-edge virtual reality tours, AR furniture placement, and AI-guided exploration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Tour */}
      {selectedPropertyId && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Featured Virtual Tour</h2>
              <VirtualTourViewer propertyId={selectedPropertyId} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Tour Features */}
      <section className="py-12 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Advanced Tour Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge technology provides an unparalleled virtual property experience.
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
                  <VR className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">3D Walkthrough</h3>
                  <p className="text-muted-foreground text-sm">
                    Navigate through properties in immersive 3D with full 360-degree views
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
                  <Mic className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Voice Guided</h3>
                  <p className="text-muted-foreground text-sm">
                    AI-powered narration adapts to your interests and preferences
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
                  <Box className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">AR Placement</h3>
                  <p className="text-muted-foreground text-sm">
                    Visualize furniture and renovations using augmented reality
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
                  <Camera className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">4K Quality</h3>
                  <p className="text-muted-foreground text-sm">
                    Ultra-high definition imagery with professional photography
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Available Tours */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Available Virtual Tours</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of immersive property tours from the comfort of your home.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
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
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img 
                        src={property.images?.[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button 
                          size="lg"
                          onClick={() => setSelectedPropertyId(property.id)}
                          className="bg-primary text-primary-foreground"
                        >
                          <VR className="w-5 h-5 mr-2" />
                          Start Tour
                        </Button>
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary">
                          3D Tour Available
                        </Badge>
                      </div>
                      
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          <Mic className="w-3 h-3 mr-1" />
                          AI Guide
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {property.city}, {property.state}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-primary">
                          ${Number(property.price).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {property.bedrooms} bed • {property.bathrooms} bath
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          <VR className="w-3 h-3 mr-1" />
                          VR Ready
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Box className="w-3 h-3 mr-1" />
                          AR Compatible
                        </Badge>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedPropertyId(property.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <VR className="w-4 h-4 mr-2" />
                        Launch Virtual Tour
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
              Ready to Experience the Future of Real Estate?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule a personalized virtual tour or visit our properties in person to see the difference technology makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground">
                Schedule Personal Tour
              </Button>
              <Button size="lg" variant="outline">
                Contact Our Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <FloatingActions />
    </div>
  );
}
