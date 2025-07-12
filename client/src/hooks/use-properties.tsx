import { useQuery } from "@tanstack/react-query";
import type { Property } from "@shared/schema";

interface UsePropertiesOptions {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
  city?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery<Property[]>({
    queryKey: ["/api/properties", queryParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/properties?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    },
  });
}

export function useProperty(id: number) {
  return useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
    enabled: !!id,
  });
}

export function usePropertySearch(query: string) {
  return useQuery<Property[]>({
    queryKey: [`/api/properties/search/${query}`],
    enabled: !!query && query.length > 2,
  });
}
