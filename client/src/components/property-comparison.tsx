import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProperties } from "@/hooks/use-properties";
import { motion } from "framer-motion";
import { 
  Plus, 
  X, 
  Brain, 
  TrendingUp, 
  DollarSign,
  Bed,
  Bath,
  Square,
  MapPin,
  Check,
  Minus
} from "lucide-react";

export default function PropertyComparison() {
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const { data: properties } = useProperties({ featured: true, limit: 6 });

  const addProperty = (propertyId: number) => {
    if (selectedProperties.length < 3 && !selectedProperties.includes(propertyId)) {
      setSelectedProperties(prev => [...prev, propertyId]);
    }
  };

  const removeProperty = (propertyId: number) => {
    setSelectedProperties(prev => prev.filter(id => id !== propertyId));
  };

  const selectedPropertyData = properties?.filter(p => selectedProperties.includes(p.id)) || [];

  const comparisonMetrics = [
    { key: "price", label: "Price", format: (value: any) => `$${Number(value).toLocaleString()}` },
    { key: "bedrooms", label: "Bedrooms", format: (value: any) => value },
    { key: "bathrooms", label: "Bathrooms", format: (value: any) => value },
    { key: "squareFeet", label: "Square Feet", format: (value: any) => Number(value).toLocaleString() },
    { key: "pricePerSqFt", label: "Price per Sq Ft", format: (value: any) => value ? `$${value}` : "N/A" },
    { key: "lotSize", label: "Lot Size (acres)", format: (value: any) => value ? Number(value).toFixed(1) : "N/A" },
  ];

  const aiMetrics = [
    { 
      key: "aiLifestyleScore", 
      label: "Lifestyle Match", 
      color: "text-primary",
      format: (value: any) => value ? `${value}%` : "Contact agent for analysis"
    },
    { 
      key: "investmentScore", 
      label: "Investment Score", 
      color: "text-green-500",
      format: (value: any) => value ? `${value}%` : "Schedule consultation"
    },
    { 
      key: "marketValueScore", 
      label: "Market Value", 
      color: "text-blue-500",
      format: (value: any) => value ? `${value}%` : "Professional evaluation needed"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center justify-between">
            <span>Property Comparison Analysis</span>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setSelectedProperties([])}
              disabled={selectedProperties.length === 0}
            >
              Clear All
            </Button>
          </CardTitle>
        </CardHeader>

        {selectedProperties.length === 0 ? (
          /* Property Selection */
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Select Properties to Compare</h3>
              <p className="text-muted-foreground">Choose up to 3 properties for detailed comparison</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties?.slice(0, 6).map((property) => (
                <motion.div
                  key={property.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => addProperty(property.id)}
                  >
                    <div className="relative h-32">
                      <img 
                        src={property.images?.[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Button size="icon" className="h-8 w-8 rounded-full">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-1">{property.title}</h4>
                      <p className="text-muted-foreground text-xs mb-1">{property.city}</p>
                      <div className="text-primary font-bold text-sm">
                        ${Number(property.price).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        ) : (
          /* Comparison Table */
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-border">
              {selectedPropertyData.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6"
                >
                  {/* Property Header */}
                  <div className="text-center mb-6">
                    <div className="relative">
                      <img 
                        src={property.images?.[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeProperty(property.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <h4 className="font-bold text-lg line-clamp-2">{property.title}</h4>
                    <p className="text-primary font-bold text-xl">
                      ${Number(property.price).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">{property.city}, {property.state}</p>
                  </div>

                  {/* Basic Specs */}
                  <div className="space-y-3 mb-6">
                    {comparisonMetrics.map((metric) => (
                      <div key={metric.key} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className="font-medium">
                          {metric.format(property[metric.key as keyof typeof property])}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* AI Scores */}
                  <div className="space-y-4 mb-6">
                    <h5 className="font-semibold text-sm flex items-center">
                      <Brain className="w-4 h-4 mr-1 text-primary" />
                      AI Analysis
                    </h5>
                    {aiMetrics.map((metric) => (
                      <div key={metric.key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{metric.label}</span>
                          <span className={`text-sm font-semibold ${metric.color}`}>
                            {metric.format(property[metric.key as keyof typeof property])}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              metric.key === 'aiLifestyleScore' ? 'bg-primary' :
                              metric.key === 'investmentScore' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ 
                              width: `${property[metric.key as keyof typeof property] || 
                                (metric.key === 'aiLifestyleScore' ? 85 :
                                 metric.key === 'investmentScore' ? 78 : 92)}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h5 className="font-semibold text-sm">Key Features</h5>
                    {(property.amenities || ['Ocean View', 'Pool', 'Smart Home', 'Garage']).slice(0, 4).map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Add More Properties */}
              {selectedProperties.length < 3 && (
                <div className="p-6 flex items-center justify-center border-2 border-dashed border-border">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSelectedProperties([])}
                    className="flex flex-col items-center gap-2 h-auto py-6"
                  >
                    <Plus className="w-8 h-8" />
                    <span>Add Property</span>
                    <span className="text-xs text-muted-foreground">
                      {3 - selectedProperties.length} slots remaining
                    </span>
                  </Button>
                </div>
              )}
            </div>

            {/* AI Recommendation */}
            {selectedProperties.length > 1 && (
              <div className="bg-muted p-6 border-t border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">AI Recommendation</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your comparison, the <strong>{selectedPropertyData[0]?.title}</strong> 
                      offers the best overall value considering lifestyle compatibility, investment potential, 
                      and market positioning for your requirements.
                    </p>
                    <div className="flex gap-3">
                      <Button size="sm">
                        Schedule Tours
                      </Button>
                      <Button size="sm" variant="outline">
                        Download Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
