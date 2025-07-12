import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Plus, 
  Minus, 
  Layers, 
  Shield, 
  GraduationCap, 
  Car, 
  Sun,
  Home,
  Heart,
  X
} from "lucide-react";

export default function MapSearch() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(1);
  const [activeOverlays, setActiveOverlays] = useState<string[]>([]);

  const overlayTypes = [
    { id: "safety", label: "Safety", icon: Shield, color: "bg-red-500" },
    { id: "schools", label: "Schools", icon: GraduationCap, color: "bg-blue-500" },
    { id: "commute", label: "Commute", icon: Car, color: "bg-green-500" },
    { id: "sunlight", label: "Sunlight", icon: Sun, color: "bg-orange-500" },
  ];

  const mockProperties = [
    { 
      id: 1, 
      price: "$4.8M", 
      title: "Oceanfront Villa Maui",
      beds: 5, 
      baths: 4, 
      sqft: "4,500",
      position: { top: "25%", left: "33%" },
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"
    },
    { 
      id: 2, 
      price: "$3.2M", 
      title: "Kailua Modern Estate",
      beds: 4, 
      baths: 3, 
      sqft: "3,100",
      position: { top: "50%", left: "25%" },
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"
    },
    { 
      id: 3, 
      price: "$6.1M", 
      title: "Big Island Volcano View",
      beds: 6, 
      baths: 5, 
      sqft: "5,800",
      position: { top: "75%", left: "66%" },
      image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"
    },
  ];

  const toggleOverlay = (overlayId: string) => {
    setActiveOverlays(prev => 
      prev.includes(overlayId) 
        ? prev.filter(id => id !== overlayId)
        : [...prev, overlayId]
    );
  };

  const selectedPropertyData = mockProperties.find(p => p.id === selectedProperty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden">
        {/* Map Controls */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-wrap items-center gap-4">
            {/* Location Filter */}
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Islands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Islands</SelectItem>
                <SelectItem value="oahu">Oahu</SelectItem>
                <SelectItem value="maui">Maui</SelectItem>
                <SelectItem value="big-island">Big Island</SelectItem>
                <SelectItem value="kauai">Kauai</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2m">$1M - $2M</SelectItem>
                <SelectItem value="2-5m">$2M - $5M</SelectItem>
                <SelectItem value="5m+">$5M+</SelectItem>
              </SelectContent>
            </Select>

            {/* Property Type Filter */}
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estate">Estate</SelectItem>
                <SelectItem value="oceanfront">Oceanfront</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>

            {/* Map Overlay Controls */}
            <div className="flex gap-2 ml-auto">
              {overlayTypes.map((overlay) => (
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
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-96 lg:h-[600px] bg-gradient-to-br from-muted to-background">
          {/* Map Background */}
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
            alt="Interactive map of Hawaiian islands"
            className="w-full h-full object-cover"
          />
          
          {/* Property Markers */}
          {mockProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: property.id * 0.1 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={property.position}
              onClick={() => setSelectedProperty(property.id)}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all hover:scale-110 ${
                  selectedProperty === property.id 
                    ? "bg-primary text-primary-foreground scale-110" 
                    : "bg-primary/80 text-primary-foreground hover:bg-primary"
                }`}
              >
                {property.id}
              </div>
            </motion.div>
          ))}

          {/* Property Info Popup */}
          {selectedPropertyData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/4 left-1/2 transform translate-x-4 -translate-y-1/2 max-w-xs"
            >
              <Card className="map-overlay">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{selectedPropertyData.title}</h4>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setSelectedProperty(null)}
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <img
                    src={selectedPropertyData.image}
                    alt={selectedPropertyData.title}
                    className="w-full h-20 object-cover rounded-lg mb-2"
                  />
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span>{selectedPropertyData.beds} bed • {selectedPropertyData.baths} bath</span>
                    <span className="font-semibold text-primary">{selectedPropertyData.price}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="glass-morphism">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="glass-morphism">
              <Minus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="glass-morphism">
              <Layers className="h-4 w-4" />
            </Button>
          </div>

          {/* Draw Search Area Tool */}
          <div className="absolute bottom-4 left-4">
            <Button className="glass-morphism">
              <MapPin className="h-4 w-4 mr-2" />
              Draw Search Area
            </Button>
          </div>
        </div>

        {/* Map Results Summary */}
        <div className="p-6 bg-muted">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-primary">247 properties</span> in current view
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Save Search
              </Button>
              <Button variant="ghost" size="sm">
                Set Alert
              </Button>
              <Button size="sm">
                View List
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
