import React, { useState } from 'react';
import aerialImage from "@assets/aerial-view2-768x537_1752329318459.jpg";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import LifestylePreferencesModal from './lifestyle-preferences-modal';
import { 
  MapPin, 
  DollarSign,
  Home,
  Heart,
  X,
  TrendingUp,
  Eye,
  Settings,
  Filter
} from 'lucide-react';

export default function RealEstateMap() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([3000000, 10000000]);
  const [selectedCity, setSelectedCity] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [userPreferences, setUserPreferences] = useState<any>(null);

  // Fetch authentic Hawaii MLS properties from database
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/properties", { 
      minPrice: priceRange[0], 
      maxPrice: priceRange[1],
      city: selectedCity !== "all" ? selectedCity : undefined,
      propertyType: propertyType !== "all" ? propertyType : undefined,
      limit: 20
    }],
  });

  const filteredProperties = properties || [];
  const selectedPropertyData = filteredProperties.find((p: any) => p.id === selectedProperty);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateLifestyleMatch = (property: any) => {
    if (!userPreferences) return null;
    
    let score = 0;
    let factors = 0;

    // Simple scoring based on preferences
    if (userPreferences.oceanView && property.amenities?.includes('Ocean View')) {
      score += 25;
      factors++;
    }
    
    if (userPreferences.propertyType && property.propertyType?.toLowerCase().includes(userPreferences.propertyType.toLowerCase())) {
      score += 20;
      factors++;
    }

    if (userPreferences.familySize && property.bedrooms) {
      const familySize = parseInt(userPreferences.familySize.split('-')[0]);
      if (property.bedrooms >= familySize) {
        score += 15;
        factors++;
      }
    }

    return factors > 0 ? Math.round(score / factors * 4) : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Controls */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Hawaii Luxury Properties Map
          </CardTitle>
          <p className="text-sm text-gray-600">
            Authentic Hawaii MLS properties with lifestyle matching
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lifestyle Preferences Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Lifestyle Preferences</h3>
              <p className="text-sm text-gray-600">
                {userPreferences 
                  ? "Preferences set - properties will show lifestyle match scores"
                  : "Set your preferences to see lifestyle match scores"
                }
              </p>
            </div>
            <LifestylePreferencesModal onPreferencesSaved={setUserPreferences}>
              <Button variant={userPreferences ? "outline" : "default"}>
                <Heart className="h-4 w-4 mr-2" />
                {userPreferences ? "Update Preferences" : "Set Preferences"}
              </Button>
            </LifestylePreferencesModal>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Price Range</Label>
              <div className="px-3">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000000}
                  min={1000000}
                  step={500000}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>${(priceRange[0] / 1000000).toFixed(1)}M</span>
                <span>${(priceRange[1] / 1000000).toFixed(1)}M</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Honolulu">Honolulu</SelectItem>
                  <SelectItem value="Kailua">Kailua</SelectItem>
                  <SelectItem value="Waialua">Waialua</SelectItem>
                  <SelectItem value="Waimanalo">Waimanalo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="estate">Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Interface */}
      <Card className="overflow-hidden shadow-2xl">
        <div 
          className="relative h-[600px] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/20 dark:via-blue-800/30 dark:to-blue-700/40"
          style={{
            backgroundImage: `url(${aerialImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-blue-700/20" />

          {/* Property Markers */}
          <AnimatePresence>
            {propertiesLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Card className="p-6 text-center bg-white/90 backdrop-blur">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading authentic Hawaii MLS properties...</p>
                </Card>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Card className="p-6 text-center bg-white/90 backdrop-blur">
                  <p className="text-gray-600 mb-4">No properties found matching your criteria</p>
                  <p className="text-sm text-gray-500">Try adjusting your filters or price range</p>
                </Card>
              </div>
            ) : (
              filteredProperties.map((property: any, index: number) => {
                const lifestyleMatch = calculateLifestyleMatch(property);
                return (
                  <motion.div
                    key={property.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                    style={{
                      left: `${20 + (index % 4) * 20}%`,
                      top: `${30 + Math.floor(index / 4) * 25}%`
                    }}
                    onClick={() => setSelectedProperty(property.id)}
                  >
                    <div className="relative group">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                          selectedProperty === property.id 
                            ? 'bg-blue-600 scale-110 ring-4 ring-white' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        } transition-all duration-200`}
                      >
                        <DollarSign className="w-5 h-5" />
                      </div>
                      
                      {/* Lifestyle Match Indicator */}
                      {lifestyleMatch && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{lifestyleMatch}%</span>
                        </div>
                      )}
                      
                      {/* Quick Preview on Hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-black/90 text-white text-xs p-3 rounded-lg whitespace-nowrap">
                          <div className="font-semibold">{formatPrice(property.price)}</div>
                          <div>{property.bedrooms}bd • {property.bathrooms}ba</div>
                          {lifestyleMatch && (
                            <div className="text-purple-300">{lifestyleMatch}% lifestyle match</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>

          {/* Property Details Panel */}
          <AnimatePresence>
            {selectedPropertyData && (
              <motion.div
                initial={{ opacity: 0, x: 400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 400 }}
                transition={{ duration: 0.3 }}
                className="absolute top-6 right-6 w-96 z-20"
              >
                <Card className="shadow-2xl backdrop-blur-lg bg-background/95 border-0">
                  <CardContent className="p-0">
                    {/* Property Image */}
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={selectedPropertyData.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'}
                        alt={selectedPropertyData.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-600 text-white">
                          {selectedPropertyData.status || 'Active'}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-4 right-4 bg-white/90"
                        onClick={() => setSelectedProperty(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Property Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{selectedPropertyData.title}</h3>
                      <p className="text-2xl font-bold text-green-600 mb-3">
                        {formatPrice(selectedPropertyData.price)}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="font-semibold">{selectedPropertyData.bedrooms}</div>
                          <div className="text-xs text-gray-500">Bedrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{selectedPropertyData.bathrooms}</div>
                          <div className="text-xs text-gray-500">Bathrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{selectedPropertyData.squareFeet?.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Sq Ft</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {selectedPropertyData.city} • MLS# {selectedPropertyData.mlsNumber}
                      </p>

                      {/* Lifestyle Match Score */}
                      {userPreferences && (
                        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Lifestyle Match</span>
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-purple-500" />
                              <span className="font-bold text-purple-600">
                                {calculateLifestyleMatch(selectedPropertyData) || 'N/A'}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Properties Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Properties Found</h3>
              <p className="text-sm text-gray-600">
                {propertiesLoading ? 'Loading...' : `${filteredProperties.length} authentic Hawaii MLS properties`}
              </p>
            </div>
            {userPreferences && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Lifestyle matching active
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}