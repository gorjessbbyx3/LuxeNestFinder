import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

// Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

// Real Hawaiian property coordinates
const hawaiiProperties = [
  { 
    id: 1, 
    price: "$4.8M", 
    title: "Oceanfront Villa Maui",
    beds: 5, 
    baths: 4, 
    sqft: "4,500",
    lat: 20.7984, // Wailea, Maui
    lng: -156.4319,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"
  },
  { 
    id: 2, 
    price: "$3.2M", 
    title: "Kailua Beach Estate",
    beds: 4, 
    baths: 3, 
    sqft: "3,100",
    lat: 21.3894, // Kailua, Oahu
    lng: -157.7398,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"
  },
  { 
    id: 3, 
    price: "$6.1M", 
    title: "Big Island Volcano View",
    beds: 6, 
    baths: 5, 
    sqft: "5,800",
    lat: 19.5429, // Kona, Big Island
    lng: -155.6659,
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"
  },
  { 
    id: 4, 
    price: "$5.3M", 
    title: "Kauai Garden Isle Retreat",
    beds: 4, 
    baths: 4, 
    sqft: "4,200",
    lat: 22.0964, // Princeville, Kauai
    lng: -159.4694,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"
  },
];

const overlayTypes = [
  { id: "beaches", label: "Beaches", icon: Sun, color: "bg-blue-400" },
  { id: "schools", label: "Schools", icon: GraduationCap, color: "bg-blue-500" },
  { id: "safety", label: "Safety", icon: Shield, color: "bg-green-500" },
  { id: "volcano", label: "Volcano Views", icon: Home, color: "bg-red-500" },
];

export default function InteractiveMap() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(1);
  const [activeOverlays, setActiveOverlays] = useState<string[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const toggleOverlay = (overlayId: string) => {
    setActiveOverlays(prev => 
      prev.includes(overlayId) 
        ? prev.filter(id => id !== overlayId)
        : [...prev, overlayId]
    );
  };

  const selectedPropertyData = hawaiiProperties.find(p => p.id === selectedProperty);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        // Try to load Google Maps
        const { Loader } = await import('@googlemaps/js-api-loader');
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        
        // Initialize Google Map centered on Hawaiian Islands
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 21.0943, lng: -157.4983 }, // Hawaii center
          zoom: 7,
          mapTypeId: 'hybrid', // Satellite view with labels
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        googleMapRef.current = map;

        // Add property markers
        hawaiiProperties.forEach((property) => {
          const marker = new google.maps.Marker({
            position: { lat: property.lat, lng: property.lng },
            map: map,
            title: property.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: selectedProperty === property.id ? '#3b82f6' : '#1e40af',
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });

          marker.addListener('click', () => {
            setSelectedProperty(property.id);
            map.panTo({ lat: property.lat, lng: property.lng });
          });

          markersRef.current.push(marker);
        });

        setMapLoaded(true);

      } catch (error) {
        console.log('Google Maps not available, using fallback static map');
        setMapLoaded(true);
      }
    };

    initMap();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // Update marker styles when selection changes
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const property = hawaiiProperties[index];
      if (marker && googleMapRef.current) {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: selectedProperty === property.id ? 15 : 12,
          fillColor: selectedProperty === property.id ? '#3b82f6' : '#1e40af',
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2
        });
      }
    });
  }, [selectedProperty]);

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
        <div className="relative h-96 lg:h-[600px]">
          {/* Google Map */}
          <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ display: mapLoaded ? 'block' : 'none' }}
          />
          
          {/* Loading State */}
          {!mapLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-muted to-background flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading interactive map...</p>
              </div>
            </div>
          )}

          {/* Property Info Popup */}
          {selectedPropertyData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 max-w-xs z-10"
            >
              <Card className="shadow-lg">
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

          {/* Map Control Buttons */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <Button size="icon" variant="secondary" className="shadow-md">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="shadow-md">
              <Minus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="shadow-md">
              <Layers className="h-4 w-4" />
            </Button>
          </div>

          {/* Draw Search Area Tool */}
          <div className="absolute bottom-4 left-4 z-10">
            <Button className="shadow-md">
              <MapPin className="h-4 w-4 mr-2" />
              Draw Search Area
            </Button>
          </div>
        </div>

        {/* Map Results Summary */}
        <div className="p-6 bg-muted">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-primary">{hawaiiProperties.length} luxury properties</span> across Hawaiian islands
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