import Navigation from "@/components/navigation";
import PropertyCard from "@/components/property-card";
import PropertySearch from "@/components/property-search";
import FloatingActions from "@/components/floating-actions";
import { useProperties } from "@/hooks/use-properties";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield, MapPin } from "lucide-react";

export default function Properties() {
  const [filters, setFilters] = useState({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    bedrooms: undefined as number | undefined,
    propertyType: undefined as string | undefined,
    city: undefined as string | undefined,
  });
  
  const { data: properties, isLoading } = useProperties(filters);

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
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-semibold">
                <Shield className="h-4 w-4 mr-2" />
                100% Authentic Hawaii MLS Listings
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-6 text-primary">
              Hawaii Luxury Properties
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Real Hawaii MLS listings from $2.9M to $6.3M. All properties verified through HiCentral MLS database.
            </p>
          </motion.div>
          
          <PropertySearch />
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-b bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center">
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estate">Estate</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: Number(value) }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => {
              const [min, max] = value.split('-').map(v => v === 'max' ? undefined : Number(v));
              setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1000000">Under $1M</SelectItem>
                <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                <SelectItem value="2000000-5000000">$2M - $5M</SelectItem>
                <SelectItem value="5000000-10000000">$5M - $10M</SelectItem>
                <SelectItem value="10000000-max">$10M+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Honolulu">Honolulu</SelectItem>
                <SelectItem value="Kailua">Kailua</SelectItem>
                <SelectItem value="Wailea">Wailea</SelectItem>
                <SelectItem value="Kona">Kona</SelectItem>
                <SelectItem value="Hana">Hana</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                minPrice: undefined,
                maxPrice: undefined,
                bedrooms: undefined,
                propertyType: undefined,
                city: undefined,
              })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-semibold">
                {properties?.length || 0} Authentic MLS Properties
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Diamond Head • Lanikai • Ala Moana • Hawaii Loa Ridge • Mokuleia • Waimanalo
                </p>
              </div>
            </div>
            <Select defaultValue="featured">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))
            )}
          </div>
          
          {!isLoading && properties?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No properties found matching your criteria.
              </p>
              <Button 
                className="mt-4"
                onClick={() => setFilters({
                  minPrice: undefined,
                  maxPrice: undefined,
                  bedrooms: undefined,
                  propertyType: undefined,
                  city: undefined,
                })}
              >
                View All Properties
              </Button>
            </div>
          )}
        </div>
      </section>

      <FloatingActions />
    </div>
  );
}
