import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Plus, 
  Minus, 
  Layers, 
  Shield, 
  GraduationCap, 
  Sun,
  Home,
  Heart,
  X,
  Navigation,
  TrendingUp,
  DollarSign,
  Eye,
  Waves,
  Mountain,
  Building,
  Camera,
  Zap,
  Filter,
  Search
} from "lucide-react";

// Elite Hawaiian properties with comprehensive data
const eliteHawaiiProperties = [
  {
    id: 1,
    price: 12800000,
    priceFormatted: "$12.8M",
    title: "Diamond Head Oceanfront Masterpiece",
    beds: 7,
    baths: 8,
    sqft: 8500,
    lat: 21.2619,
    lng: -157.8063,
    address: "240 Portlock Road, Honolulu, HI 96825",
    neighborhood: "Diamond Head",
    island: "Oahu",
    propertyType: "Estate",
    yearBuilt: 2021,
    lotSize: 1.2,
    oceanfront: true,
    poolType: "Infinity",
    views: ["Ocean", "Diamond Head", "Sunrise"],
    amenities: ["Private Beach", "Wine Cellar", "Home Theater", "Gym", "Chef's Kitchen"],
    lifestyle: {
      privacy: 10,
      luxury: 10,
      beachAccess: 10,
      nightlife: 8,
      shopping: 9,
      schools: 9
    },
    investment: {
      appreciation: 8.5,
      rental: 180000,
      capRate: 1.4
    },
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    virtualTour: true,
    status: "Active"
  },
  {
    id: 2,
    price: 15200000,
    priceFormatted: "$15.2M",
    title: "Wailea Resort Estate",
    beds: 8,
    baths: 10,
    sqft: 12000,
    lat: 20.6888,
    lng: -156.4419,
    address: "3550 Wailea Alanui Drive, Wailea, HI 96753",
    neighborhood: "Wailea",
    island: "Maui",
    propertyType: "Resort Villa",
    yearBuilt: 2020,
    lotSize: 2.1,
    oceanfront: true,
    poolType: "Resort Style",
    views: ["Ocean", "Haleakala", "Sunset"],
    amenities: ["Guest Casita", "Tennis Court", "Spa", "Art Studio", "Meditation Garden"],
    lifestyle: {
      privacy: 9,
      luxury: 10,
      beachAccess: 10,
      nightlife: 6,
      shopping: 8,
      schools: 7
    },
    investment: {
      appreciation: 9.2,
      rental: 220000,
      capRate: 1.4
    },
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    virtualTour: true,
    status: "Active"
  },
  {
    id: 3,
    price: 22500000,
    priceFormatted: "$22.5M",
    title: "Kona Coffee & Volcano Estate",
    beds: 9,
    baths: 12,
    sqft: 15000,
    lat: 19.6394,
    lng: -155.9969,
    address: "75-5919 Alii Drive, Kailua-Kona, HI 96740",
    neighborhood: "Kona",
    island: "Big Island",
    propertyType: "Agricultural Estate",
    yearBuilt: 2019,
    lotSize: 50.5,
    oceanfront: true,
    poolType: "Natural Rock",
    views: ["Ocean", "Volcano", "Coffee Plantation"],
    amenities: ["Coffee Farm", "Helipad", "Observatory", "Organic Gardens", "Staff Quarters"],
    lifestyle: {
      privacy: 10,
      luxury: 10,
      beachAccess: 8,
      nightlife: 4,
      shopping: 6,
      schools: 6
    },
    investment: {
      appreciation: 11.8,
      rental: 350000,
      capRate: 1.6
    },
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    virtualTour: true,
    status: "Active"
  },
  {
    id: 4,
    price: 18900000,
    priceFormatted: "$18.9M",
    title: "Princeville Resort Sanctuary",
    beds: 6,
    baths: 7,
    sqft: 9200,
    lat: 22.2160,
    lng: -159.4845,
    address: "5300 Ka Haku Road, Princeville, HI 96722",
    neighborhood: "Princeville",
    island: "Kauai",
    propertyType: "Resort Estate",
    yearBuilt: 2022,
    lotSize: 3.8,
    oceanfront: true,
    poolType: "Infinity with Spa",
    views: ["Ocean", "Napali Coast", "Mountains"],
    amenities: ["Private Golf Access", "Waterfall", "Japanese Garden", "Art Gallery", "Wine Cave"],
    lifestyle: {
      privacy: 10,
      luxury: 10,
      beachAccess: 9,
      nightlife: 3,
      shopping: 5,
      schools: 7
    },
    investment: {
      appreciation: 10.1,
      rental: 280000,
      capRate: 1.5
    },
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    virtualTour: true,
    status: "Coming Soon"
  }
];

const mapOverlays = [
  { id: "lifestyle", label: "Lifestyle Score", icon: Heart, color: "bg-pink-500" },
  { id: "investment", label: "Investment ROI", icon: TrendingUp, color: "bg-green-500" },
  { id: "beaches", label: "Beach Access", icon: Waves, color: "bg-blue-400" },
  { id: "schools", label: "Schools", icon: GraduationCap, color: "bg-purple-500" },
  { id: "privacy", label: "Privacy Index", icon: Shield, color: "bg-gray-500" },
  { id: "views", label: "Premium Views", icon: Eye, color: "bg-orange-500" }
];

export default function AdvancedPropertyMap() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(1);
  const [activeOverlays, setActiveOverlays] = useState<string[]>(["lifestyle"]);
  const [priceRange, setPriceRange] = useState([10000000, 25000000]);
  const [selectedIsland, setSelectedIsland] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [showInvestmentData, setShowInvestmentData] = useState(true);
  const [showLifestyleScores, setShowLifestyleScores] = useState(true);
  const [mapView, setMapView] = useState<"satellite" | "terrain" | "luxury">("luxury");
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const filteredProperties = eliteHawaiiProperties.filter(property => {
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesIsland = selectedIsland === "all" || property.island.toLowerCase().replace(" ", "-") === selectedIsland;
    const matchesType = propertyType === "all" || property.propertyType.toLowerCase().includes(propertyType);
    return matchesPrice && matchesIsland && matchesType;
  });

  const selectedPropertyData = filteredProperties.find(p => p.id === selectedProperty);

  const toggleOverlay = (overlayId: string) => {
    setActiveOverlays(prev => 
      prev.includes(overlayId) 
        ? prev.filter(id => id !== overlayId)
        : [...prev, overlayId]
    );
  };

  const getPropertyMarkerStyle = (property: typeof eliteHawaiiProperties[0], isSelected: boolean) => {
    let color = "bg-blue-600";
    if (activeOverlays.includes("investment")) {
      color = property.investment.appreciation > 10 ? "bg-green-600" : "bg-yellow-600";
    } else if (activeOverlays.includes("lifestyle")) {
      const avgScore = Object.values(property.lifestyle).reduce((a, b) => a + b, 0) / Object.values(property.lifestyle).length;
      color = avgScore > 8 ? "bg-purple-600" : "bg-blue-600";
    }
    
    return `${color} ${isSelected ? "ring-4 ring-white scale-125" : "hover:scale-110"} transition-all duration-300`;
  };

  const calculateOverallScore = (property: typeof eliteHawaiiProperties[0]) => {
    const lifestyle = Object.values(property.lifestyle).reduce((a, b) => a + b, 0) / Object.values(property.lifestyle).length;
    const investment = (property.investment.appreciation + property.investment.capRate * 10) / 2;
    return Math.round((lifestyle + investment) / 2 * 10) / 10;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Advanced Controls */}
      <Card className="shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Price Range</Label>
              <div className="px-3">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={30000000}
                  min={5000000}
                  step={1000000}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${(priceRange[0] / 1000000).toFixed(1)}M</span>
                <span>${(priceRange[1] / 1000000).toFixed(1)}M</span>
              </div>
            </div>

            {/* Island Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Island</Label>
              <Select value={selectedIsland} onValueChange={setSelectedIsland}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Islands</SelectItem>
                  <SelectItem value="oahu">Oahu</SelectItem>
                  <SelectItem value="maui">Maui</SelectItem>
                  <SelectItem value="big-island">Big Island</SelectItem>
                  <SelectItem value="kauai">Kauai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="estate">Estate</SelectItem>
                  <SelectItem value="resort">Resort Villa</SelectItem>
                  <SelectItem value="agricultural">Agricultural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Map View */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Map Style</Label>
              <Select value={mapView} onValueChange={(v) => setMapView(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury">Luxury View</SelectItem>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Overlay Controls */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Label className="text-sm font-semibold">Data Overlays:</Label>
              {mapOverlays.map((overlay) => (
                <Button
                  key={overlay.id}
                  size="sm"
                  variant={activeOverlays.includes(overlay.id) ? "default" : "outline"}
                  onClick={() => toggleOverlay(overlay.id)}
                  className={`text-xs ${
                    activeOverlays.includes(overlay.id) ? overlay.color : ""
                  }`}
                >
                  <overlay.icon className="w-3 h-3 mr-1" />
                  {overlay.label}
                </Button>
              ))}
            </div>

            {/* Feature Toggles */}
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="investment" 
                  checked={showInvestmentData}
                  onCheckedChange={setShowInvestmentData}
                />
                <Label htmlFor="investment" className="text-sm">Investment Analytics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="lifestyle" 
                  checked={showLifestyleScores}
                  onCheckedChange={setShowLifestyleScores}
                />
                <Label htmlFor="lifestyle" className="text-sm">Lifestyle Scores</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Map Interface */}
      <Card className="overflow-hidden shadow-2xl">
        <div 
          ref={mapContainerRef}
          className="relative h-[700px] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/20 dark:via-blue-800/30 dark:to-blue-700/40"
          style={{
            backgroundImage: mapView === "satellite" 
              ? "url('https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=700')"
              : mapView === "terrain"
              ? "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=700')"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Luxury Map Overlay */}
          {mapView === "luxury" && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-teal-900/40" />
          )}

          {/* Property Markers */}
          <AnimatePresence>
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{
                  left: `${25 + (property.lng + 160) * 1.8}%`,
                  top: `${20 + (22.5 - property.lat) * 15}%`
                }}
                onClick={() => setSelectedProperty(property.id)}
              >
                <div className="relative group">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                      getPropertyMarkerStyle(property, selectedProperty === property.id)
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                  </div>
                  
                  {/* Quick Preview on Hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-black/90 text-white text-xs p-2 rounded-lg whitespace-nowrap">
                      <div className="font-semibold">{property.priceFormatted}</div>
                      <div>{property.beds}bd • {property.baths}ba</div>
                    </div>
                  </div>

                  {/* Overlay Indicators */}
                  {activeOverlays.includes("investment") && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-2 h-2 text-white" />
                    </div>
                  )}
                  
                  {activeOverlays.includes("lifestyle") && property.lifestyle.luxury >= 9 && (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
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
                        src={selectedPropertyData.image}
                        alt={selectedPropertyData.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge 
                          variant={selectedPropertyData.status === "Active" ? "default" : "secondary"}
                          className="bg-black/50 text-white"
                        >
                          {selectedPropertyData.status}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => setSelectedProperty(null)}
                          className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {selectedPropertyData.virtualTour && (
                        <div className="absolute bottom-4 right-4">
                          <Badge className="bg-blue-600 text-white">
                            <Camera className="w-3 h-3 mr-1" />
                            360° Tour
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Property Details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{selectedPropertyData.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedPropertyData.neighborhood}, {selectedPropertyData.island}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedPropertyData.address}
                        </p>
                      </div>

                      <div className="text-3xl font-bold text-primary">
                        {selectedPropertyData.priceFormatted}
                      </div>

                      {/* Property Stats */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">{selectedPropertyData.beds}</div>
                          <div className="text-muted-foreground">Bedrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{selectedPropertyData.baths}</div>
                          <div className="text-muted-foreground">Bathrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{selectedPropertyData.sqft.toLocaleString()}</div>
                          <div className="text-muted-foreground">Sq Ft</div>
                        </div>
                      </div>

                      {/* Lifestyle Scores */}
                      {showLifestyleScores && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Lifestyle Scores</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(selectedPropertyData.lifestyle).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key}:</span>
                                <span className="font-semibold">{value}/10</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Investment Data */}
                      {showInvestmentData && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Investment Metrics</h4>
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span>Appreciation:</span>
                              <span className="font-semibold text-green-600">
                                {selectedPropertyData.investment.appreciation}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Est. Annual Rental:</span>
                              <span className="font-semibold">
                                ${selectedPropertyData.investment.rental.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Cap Rate:</span>
                              <span className="font-semibold">
                                {selectedPropertyData.investment.capRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Overall Score */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-3 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {calculateOverallScore(selectedPropertyData)}
                          </div>
                          <div className="text-xs text-muted-foreground">Overall Elite Score</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button size="sm" className="w-full">
                          <Navigation className="w-3 h-3 mr-1" />
                          Virtual Tour
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Heart className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Legend */}
          <div className="absolute bottom-6 left-6 z-10">
            <Card className="bg-black/50 backdrop-blur-sm text-white border-0">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-sm">Map Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <span>Standard Luxury</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full" />
                    <span>Ultra Luxury</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full" />
                    <span>High ROI</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Summary */}
          <div className="absolute bottom-6 right-6 z-10">
            <Card className="bg-black/50 backdrop-blur-sm text-white border-0">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{filteredProperties.length}</div>
                  <div className="text-xs">Elite Properties</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}