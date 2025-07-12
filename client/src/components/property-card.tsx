import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, FileBox as VR, Bed, Bath, Square, MapPin, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const image = property.images?.[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400";
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
        <div className="relative h-64">
          <img 
            src={image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {property.mlsNumber && (
              <Badge className="bg-green-600 text-white font-semibold">
                MLS #{property.mlsNumber}
              </Badge>
            )}
            {property.featured && (
              <Badge className="bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4">
            <Button size="icon" variant="secondary" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Virtual Tour Button */}
          <div className="absolute bottom-4 left-4">
            <Button 
              size="sm" 
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <VR className="h-4 w-4 mr-2" />
              3D Tour
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          {/* Property Info */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 line-clamp-1">{property.title}</h3>
              <p className="text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {property.city}, {property.state}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ${Number(property.price).toLocaleString()}
              </div>
              {property.pricePerSqFt && (
                <div className="text-sm text-muted-foreground">
                  ${property.pricePerSqFt}/sq ft
                </div>
              )}
            </div>
          </div>
          
          {/* Property Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
            <div className="text-center">
              <Bed className="h-4 w-4 mx-auto mb-1 text-primary" />
              <div className="font-semibold text-foreground">{property.bedrooms}</div>
              <div>Bedrooms</div>
            </div>
            <div className="text-center">
              <Bath className="h-4 w-4 mx-auto mb-1 text-primary" />
              <div className="font-semibold text-foreground">{property.bathrooms}</div>
              <div>Bathrooms</div>
            </div>
            <div className="text-center">
              <Square className="h-4 w-4 mx-auto mb-1 text-primary" />
              <div className="font-semibold text-foreground">{property.squareFeet?.toLocaleString()}</div>
              <div>Sq Ft</div>
            </div>
          </div>
          
          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(property.amenities || ['Ocean View', 'Pool', 'Smart Home']).slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <Link href={`/properties/${property.id}`} className="flex-1">
              <Button className="w-full">
                View Details
              </Button>
            </Link>
            <Button size="icon" variant="outline">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          
          {/* AI Lifestyle Match Score */}
          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center">
                <Brain className="h-4 w-4 mr-1" />
                AI Lifestyle Match
              </span>
              <div className="flex items-center">
                <div className="text-primary font-semibold">
                  {property.aiLifestyleScore || 96}%
                </div>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500" 
                style={{ width: `${property.aiLifestyleScore || 96}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
