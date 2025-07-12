import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Bed, 
  Bath, 
  Square,
  DollarSign,
  Home as HomeIcon,
  Users
} from "lucide-react";
import type { OpenHouse } from "@shared/schema";

export default function OpenHouseComponent() {
  const { data: openHouses, isLoading } = useQuery<OpenHouse[]>({
    queryKey: ["/api/open-houses"],
  });

  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const formatEndTime = (endTime: string | Date) => {
    const date = new Date(endTime);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!openHouses || openHouses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 max-w-md mx-auto">
          <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
            No Open Houses Scheduled
          </h3>
          <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">
            New open houses are automatically added every Friday at 3:35 PM from the Hawaii Board of Realtors report.
          </p>
          <a 
            href="https://www.hicentral.com/pdf/HBROpenHouseReport.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
          >
            View Latest HBR Report
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {openHouses.map((openHouse, index) => {
        const { date, time } = formatDateTime(openHouse.dateTime);
        const endTime = openHouse.endTime ? formatEndTime(openHouse.endTime) : null;
        const image = openHouse.images?.[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400";
        
        return (
          <motion.div
            key={openHouse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
              <div className="relative h-48">
                <img 
                  src={image}
                  alt={openHouse.title}
                  className="w-full h-full object-cover"
                />
                
                {/* MLS Badge */}
                <div className="absolute top-4 left-4">
                  {openHouse.mlsNumber && (
                    <Badge className="bg-green-600 text-white font-semibold">
                      MLS #{openHouse.mlsNumber}
                    </Badge>
                  )}
                </div>
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1">
                    ${Number(openHouse.price).toLocaleString()}
                  </Badge>
                </div>
                
                {/* Open House Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-blue-600 text-white px-3 py-2">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Open House
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* Property Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{openHouse.title}</h3>
                  <p className="text-muted-foreground flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {openHouse.address}, {openHouse.city}
                  </p>
                </div>
                
                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <Bed className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <div className="font-semibold">{openHouse.bedrooms}</div>
                    <div className="text-xs text-muted-foreground">Bedrooms</div>
                  </div>
                  <div>
                    <Bath className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <div className="font-semibold">{openHouse.bathrooms}</div>
                    <div className="text-xs text-muted-foreground">Bathrooms</div>
                  </div>
                  <div>
                    <Square className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <div className="font-semibold">{openHouse.squareFeet?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Sq Ft</div>
                  </div>
                </div>
                
                {/* Date & Time */}
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <div className="font-semibold">{date}</div>
                        <div className="text-sm text-muted-foreground">
                          {time} {endTime && `- ${endTime}`}
                        </div>
                      </div>
                    </div>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                {/* Host Information */}
                {openHouse.hostAgent && (
                  <div className="border-t pt-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold flex items-center">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          {openHouse.hostAgent}
                        </div>
                        <div className="text-sm text-muted-foreground">Host Agent</div>
                      </div>
                      <div className="flex gap-2">
                        {openHouse.hostPhone && (
                          <Button size="icon" variant="outline" className="h-8 w-8">
                            <Phone className="h-3 w-3" />
                          </Button>
                        )}
                        {openHouse.hostEmail && (
                          <Button size="icon" variant="outline" className="h-8 w-8">
                            <Mail className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Description */}
                {openHouse.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {openHouse.description}
                  </p>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
                
                {/* HBR Source */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Source: Hawaii Board of Realtors</span>
                    <span>Updated: Every Friday 3:35 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}