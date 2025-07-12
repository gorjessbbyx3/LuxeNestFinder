import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Play, 
  Maximize, 
  Mic, 
  MicOff, 
  Box, 
  Camera,
  RotateCcw,
  Home,
  ChefHat,
  Bed,
  TreePine
} from "lucide-react";

interface VirtualTourViewerProps {
  propertyId?: number;
}

export default function VirtualTourViewer({ propertyId }: VirtualTourViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceGuideActive, setIsVoiceGuideActive] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("living");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const rooms = [
    { id: "living", name: "Living Room", icon: Home },
    { id: "kitchen", name: "Kitchen", icon: ChefHat },
    { id: "master", name: "Master Bedroom", icon: Bed },
    { id: "outdoor", name: "Outdoor Space", icon: TreePine },
  ];

  const handlePlayTour = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleVoiceGuide = () => {
    setIsVoiceGuideActive(!isVoiceGuideActive);
  };

  const handleRoomChange = (roomId: string) => {
    setCurrentRoom(roomId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden">
        <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-muted to-background">
          {/* Virtual Tour Embed Area */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!isPlaying ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="mb-6">
                  <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Professional Virtual Tour</h3>
                  <p className="text-muted-foreground">Contact our team to schedule a personalized virtual tour</p>
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Schedule Virtual Tour
                </Button>
              </motion.div>
            ) : (
              /* Simulated 3D Tour Interface */
              <div className="w-full h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Virtual tour view"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
          </div>

          {/* Tour Controls Overlay */}
          {isPlaying && (
            <>
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                {/* Room Navigation */}
                <Card className="glass-morphism">
                  <CardContent className="p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {rooms.map((room) => (
                        <Button
                          key={room.id}
                          size="sm"
                          variant={currentRoom === room.id ? "default" : "ghost"}
                          onClick={() => handleRoomChange(room.id)}
                          className="text-xs"
                        >
                          <room.icon className="w-3 h-3 mr-1" />
                          {room.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Voice Guide Status */}
                {isVoiceGuideActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-morphism rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-primary">AI Guide Active</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-4 right-4">
                <Card className="glass-morphism">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {rooms.find(r => r.id === currentRoom)?.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={toggleVoiceGuide}
                          className={isVoiceGuideActive ? "bg-primary/20" : ""}
                        >
                          {isVoiceGuideActive ? (
                            <Mic className="w-4 h-4" />
                          ) : (
                            <MicOff className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <Button size="icon" variant="ghost">
                          <Box className="w-4 h-4" />
                        </Button>
                        
                        <Button size="icon" variant="ghost">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => setIsFullscreen(!isFullscreen)}
                        >
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Tour Information */}
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Virtual Tour Experience</h3>
            <div className="flex gap-2">
              <Badge variant="secondary">
                <Camera className="w-3 h-3 mr-1" />
                4K Quality
              </Badge>
              <Badge variant="secondary">
                <Mic className="w-3 h-3 mr-1" />
                AI Guided
              </Badge>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            Experience this stunning property with our immersive 3D walkthrough featuring 
            AI-powered narration and interactive hotspots.
          </p>

          {/* Tour Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Box className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-medium">3D Walkthrough</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-medium">Voice Guided</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-medium">AR Compatible</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Maximize className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-medium">Fullscreen Mode</div>
            </div>
          </div>

          {!isPlaying && (
            <Button 
              onClick={handlePlayTour}
              className="w-full ai-glow"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Full Tour Experience
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
