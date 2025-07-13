import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, Brain, Home, Laptop, Waves, TrendingUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function PropertySearch() {
  const [query, setQuery] = useState("");
  const [isAIMode, setIsAIMode] = useState(false);
  const [island, setIsland] = useState<string>("");
  const [oceanProximity, setOceanProximity] = useState<string>("");
  const [viewType, setViewType] = useState<string>("");
  const [microNeighborhood, setMicroNeighborhood] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [propertyType, setPropertyType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [bathrooms, setBathrooms] = useState<string>("");


  const quickFilters = [
    { icon: Home, label: "Family-Friendly", description: "Great schools & parks" },
    { icon: Laptop, label: "Remote Work", description: "Home office ready" },
    { icon: Waves, label: "Waterfront", description: "Ocean & beach access" },
    { icon: TrendingUp, label: "Investment", description: "High ROI potential" },
  ];

  const handleSearch = () => {
    if (query.trim()) {
      // Implement search logic
      console.log("Searching for:", query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-morphism max-w-4xl mx-auto">
        <CardContent className="p-8">
          {/* Professional Search Notice */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Brain className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">AI-Powered Search Available</h3>
              <p className="text-sm text-blue-600">Contact our agents for personalized AI property matching</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={
                  isAIMode 
                    ? "Describe your ideal lifestyle... (e.g., 'Modern home for remote work with ocean views')"
                    : "Search by location, property type, or features..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 text-lg bg-background/50 border-border"
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className={isAIMode ? "ai-glow" : ""}
            >
              {isAIMode ? (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  AI Search
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="island">Island</Label>
              <Select value={island} onValueChange={setIsland}>
                <SelectTrigger>
                  <SelectValue placeholder="All Islands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Islands</SelectItem>
                  <SelectItem value="oahu">Oahu</SelectItem>
                  <SelectItem value="maui">Maui</SelectItem>
                  <SelectItem value="big-island">Big Island (Hawaii)</SelectItem>
                  <SelectItem value="kauai">Kauai</SelectItem>
                  <SelectItem value="molokai">Molokai</SelectItem>
                  <SelectItem value="lanai">Lanai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="property-type">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Type</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="ohana">Ohana Unit</SelectItem>
                  <SelectItem value="ranch">Ranch</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="vacation-rental">Vacation Rental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ocean-proximity">Ocean Proximity</Label>
              <Select value={oceanProximity} onValueChange={setOceanProximity}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Distance</SelectItem>
                  <SelectItem value="oceanfront">Oceanfront</SelectItem>
                  <SelectItem value="ocean-view">Ocean View</SelectItem>
                  <SelectItem value="5-min-walk">5 min walk to beach</SelectItem>
                  <SelectItem value="10-min-walk">10 min walk to beach</SelectItem>
                  <SelectItem value="5-min-drive">5 min drive to beach</SelectItem>
                  <SelectItem value="10-min-drive">10 min drive to beach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="view-type">View Type</Label>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any View</SelectItem>
                  <SelectItem value="ocean">Ocean View</SelectItem>
                  <SelectItem value="mountain">Mountain View</SelectItem>
                  <SelectItem value="diamond-head">Diamond Head View</SelectItem>
                  <SelectItem value="golf-course">Golf Course View</SelectItem>
                  <SelectItem value="sunset">Sunset View</SelectItem>
                  <SelectItem value="city">City View</SelectItem>
                  <SelectItem value="garden">Garden View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <Label htmlFor="micro-neighborhood">Micro-Neighborhood</Label>
              <Select value={microNeighborhood} onValueChange={setMicroNeighborhood}>
                <SelectTrigger>
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="waikiki">Waikiki</SelectItem>
                  <SelectItem value="kailua">Kailua</SelectItem>
                  <SelectItem value="lanikai">Lanikai</SelectItem>
                  <SelectItem value="hawaii-kai">Hawaii Kai</SelectItem>
                  <SelectItem value="diamond-head">Diamond Head</SelectItem>
                  <SelectItem value="kahala">Kahala</SelectItem>
                  <SelectItem value="wailea">Wailea</SelectItem>
                  <SelectItem value="lahaina">Lahaina</SelectItem>
                  <SelectItem value="kona">Kona</SelectItem>
                  <SelectItem value="hilo">Hilo</SelectItem>
                  <SelectItem value="poipu">Poipu</SelectItem>
                  <SelectItem value="princeville">Princeville</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Filter Suggestions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {quickFilters.map((filter, index) => (
              <motion.div
                key={filter.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start text-left w-full glass-morphism hover:bg-primary/10 transition-colors"
                  onClick={() => setQuery(filter.label)}
                >
                  <filter.icon className="w-6 h-6 text-primary mb-2" />
                  <div className="font-semibold text-sm">{filter.label}</div>
                  <div className="text-xs text-muted-foreground">{filter.description}</div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* AI Features Badge */}
          {isAIMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center"
            >
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered Lifestyle Matching Enabled
              </Badge>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}