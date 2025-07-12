import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { useProperties } from "@/hooks/use-properties";
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
  Navigation
} from "lucide-react";

import { useProperties } from "@/hooks/use-properties";
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"
  },
];

const hawaiiOverlays = [
  { id: "beaches", label: "Beaches", icon: Sun, color: "bg-blue-400" },
  { id: "schools", label: "Schools", icon: GraduationCap, color: "bg-blue-500" },
  { id: "safety", label: "Safety", icon: Shield, color: "bg-green-500" },
  { id: "volcano", label: "Volcano Views", icon: Home, color: "bg-red-500" },
];

declare global {
  interface Window {
    google: any;
  }
}

export default function RealLocationMap() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(1);
  const [activeOverlays, setActiveOverlays] = useState<string[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const toggleOverlay = (overlayId: string) => {
    setActiveOverlays(prev => 
      prev.includes(overlayId) 
        ? prev.filter(id => id !== overlayId)
        : [...prev, overlayId]
    );
  };

  const selectedPropertyData = realHawaiiProperties.find(p => p.id === selectedProperty);

  // Google Maps initialization
  useEffect(() => {
    const initGoogleMap = async () => {
      if (!mapRef.current || !useGoogleMaps) return;

      try {
        // Load Google Maps API
        const script = document.createElement('script');
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dkeOFMf0g';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          // Initialize map centered on Hawaiian islands
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 21.0943, lng: -157.4983 }, // Hawaii center
            zoom: 8,
            mapTypeId: 'hybrid', // Satellite view with roads
            styles: [
              {
                featureType: 'poi.business',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          googleMapRef.current = map;

          // Add property markers with real coordinates
          realHawaiiProperties.forEach((property) => {
            const marker = new window.google.maps.Marker({
              position: { lat: property.lat, lng: property.lng },
              map: map,
              title: `${property.title} - ${property.price}`,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: selectedProperty === property.id ? 15 : 12,
                fillColor: selectedProperty === property.id ? '#3b82f6' : '#1e40af',
                fillOpacity: 0.9,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            });

            // Add info window
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 200px;">
                  <h4 style="margin: 0 0 8px 0; font-weight: bold;">${property.title}</h4>
                  <p style="margin: 0 0 4px 0; color: #666;">${property.address}</p>
                  <p style="margin: 0 0 4px 0;">${property.beds} bed • ${property.baths} bath</p>
                  <p style="margin: 0; font-weight: bold; color: #3b82f6;">${property.price}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              setSelectedProperty(property.id);
              map.panTo({ lat: property.lat, lng: property.lng });
              map.setZoom(12);
              infoWindow.open(map, marker);
            });

            markersRef.current.push(marker);
          });

          setMapLoaded(true);
        };

        script.onerror = () => {
          console.log('Google Maps failed to load, switching to alternative');
          setUseGoogleMaps(false);
        };

        document.head.appendChild(script);

      } catch (error) {
        console.log('Google Maps not available:', error);
        setUseGoogleMaps(false);
      }
    };

    initGoogleMap();

    return () => {
      markersRef.current.forEach(marker => marker?.setMap?.(null));
      markersRef.current = [];
    };
  }, [useGoogleMaps]);

  // Update marker styles when selection changes
  useEffect(() => {
    if (window.google && markersRef.current.length > 0) {
      markersRef.current.forEach((marker, index) => {
        const property = realHawaiiProperties[index];
        if (marker) {
          marker.setIcon({
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: selectedProperty === property.id ? 15 : 12,
            fillColor: selectedProperty === property.id ? '#3b82f6' : '#1e40af',
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2
          });
        }
      });
    }
  }, [selectedProperty]);

  // Fallback to OpenStreetMap if Google Maps fails
  useEffect(() => {
    if (!useGoogleMaps && mapRef.current) {
      // Create a simple interactive map with OpenStreetMap
      mapRef.current.innerHTML = `
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-160.5,-19.0,-154.5,22.5&layer=mapnik&marker=21.0943,-157.4983"
          style="border: 0;"
        ></iframe>
      `;
      setMapLoaded(true);
    }
  }, [useGoogleMaps]);

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
            {/* Island Filter */}
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Island" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Islands</SelectItem>
                <SelectItem value="oahu">Oahu</SelectItem>
                <SelectItem value="maui">Maui</SelectItem>
                <SelectItem value="big-island">Big Island</SelectItem>
                <SelectItem value="kauai">Kauai</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-5m">$2M - $5M</SelectItem>
                <SelectItem value="5-8m">$5M - $8M</SelectItem>
                <SelectItem value="8m+">$8M+</SelectItem>
              </SelectContent>
            </Select>

            {/* Neighborhood Type */}
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Neighborhood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oceanfront">Oceanfront</SelectItem>
                <SelectItem value="resort">Resort Community</SelectItem>
                <SelectItem value="mountain">Mountain View</SelectItem>
                <SelectItem value="historic">Historic District</SelectItem>
              </SelectContent>
            </Select>

            {/* Overlay Controls */}
            <div className="flex gap-2 ml-auto">
              {hawaiiOverlays.map((overlay) => (
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

        {/* Interactive Map Container */}
        <div className="relative h-96 lg:h-[600px]">
          {/* Google Maps Container */}
          <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ display: mapLoaded ? 'block' : 'none' }}
          />
          
          {/* Loading State */}
          {!mapLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading real Hawaiian locations...</p>
              </div>
            </div>
          )}

          {/* Property Details Card */}
          {selectedPropertyData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 max-w-sm z-20"
            >
              <Card className="shadow-xl backdrop-blur-sm bg-background/95">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{selectedPropertyData.title}</h4>
                      <p className="text-sm text-muted-foreground">{selectedPropertyData.neighborhood}, {selectedPropertyData.island}</p>
                    </div>
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
                    className="w-full h-24 object-cover rounded-lg mb-3"
                  />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{selectedPropertyData.beds} bed • {selectedPropertyData.baths} bath</span>
                      <span className="font-semibold">{selectedPropertyData.sqft} sq ft</span>
                    </div>
                    <div className="text-xl font-bold text-primary">{selectedPropertyData.price}</div>
                    <div className="text-xs text-muted-foreground">{selectedPropertyData.address}</div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Navigation className="h-3 w-3 mr-1" />
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
            <Button size="icon" variant="secondary" className="shadow-md hover:shadow-lg">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="shadow-md hover:shadow-lg">
              <Minus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="shadow-md hover:shadow-lg">
              <Layers className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Area Tool */}
          <div className="absolute bottom-4 left-4 z-10">
            <Button className="shadow-md hover:shadow-lg">
              <MapPin className="h-4 w-4 mr-2" />
              Draw Search Area
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="p-6 bg-muted">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-primary">{realHawaiiProperties.length} luxury properties</span> with real GPS coordinates
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