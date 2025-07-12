import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import VirtualTourViewer from "@/components/virtual-tour-viewer";
import LeadCaptureForm from "@/components/lead-capture-form";
import FloatingActions from "@/components/floating-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Bed, Bath, Square, Calendar, Heart, Share, Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyDetail() {
  const { id } = useParams();
  
  const { data: property, isLoading } = useQuery({
    queryKey: [`/api/properties/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-96 w-full rounded-2xl mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-60 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const images = property.images || [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Image Gallery */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden mb-8"
          >
            <img 
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Property Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex justify-between items-end">
                <div className="text-white">
                  <h1 className="text-3xl lg:text-5xl font-serif font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center text-lg mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    {property.address}, {property.city}, {property.state}
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    ${Number(property.price).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button size="icon" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                    <Share className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            {property.status === 'active' && (
              <Badge className="absolute top-6 left-6 bg-green-500 text-white">
                Available
              </Badge>
            )}
            {property.featured && (
              <Badge className="absolute top-6 right-6 bg-primary">
                Featured
              </Badge>
            )}
          </motion.div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center">
                        <Bed className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{property.bedrooms}</div>
                        <div className="text-sm text-muted-foreground">Bedrooms</div>
                      </div>
                      <div className="text-center">
                        <Bath className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{property.bathrooms}</div>
                        <div className="text-sm text-muted-foreground">Bathrooms</div>
                      </div>
                      <div className="text-center">
                        <Square className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{property.squareFeet?.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Sq Ft</div>
                      </div>
                      <div className="text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{Number(property.lotSize || 0).toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Acres</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {(property.amenities || ['Ocean View', 'Pool', 'Smart Home', 'Garage']).map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Virtual Tour */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4">Virtual Tour</h2>
                <VirtualTourViewer propertyId={property.id} />
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4">AI Property Insights</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Lifestyle Match Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${property.aiLifestyleScore || 85}%` }}
                            />
                          </div>
                          <span className="font-bold text-primary">{property.aiLifestyleScore || 85}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Investment Potential</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${property.investmentScore || 78}%` }}
                            />
                          </div>
                          <span className="font-bold text-green-500">{property.investmentScore || 78}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Market Value Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${property.marketValueScore || 92}%` }}
                            />
                          </div>
                          <span className="font-bold text-blue-500">{property.marketValueScore || 92}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <LeadCaptureForm propertyId={property.id} />
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button className="w-full" size="lg">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Viewing
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Camera className="w-4 h-4 mr-2" />
                        Virtual Tour
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share className="w-4 h-4 mr-2" />
                        Share Property
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Property Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Property Type</span>
                        <span className="capitalize">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year Built</span>
                        <span>{property.yearBuilt || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price per Sq Ft</span>
                        <span>${property.pricePerSqFt || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">HOA Fees</span>
                        <span>${property.hoaFees || 'N/A'}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Property Taxes</span>
                        <span>${property.propertyTaxes || 'N/A'}/year</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <FloatingActions />
    </div>
  );
}
