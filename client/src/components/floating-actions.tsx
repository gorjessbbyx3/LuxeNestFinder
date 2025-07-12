import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Camera, 
  FileBox as VR, 
  Calendar,
  X,
  Brain
} from "lucide-react";
import AIChat from "./ai-chat";

export default function FloatingActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: Camera,
      label: "AR Scanner",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        // TODO: Implement AR scanner
        console.log("AR Scanner clicked");
      }
    },
    {
      icon: VR,
      label: "Quick Tour",
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => {
        // TODO: Implement quick tour
        console.log("Quick Tour clicked");
      }
    },
    {
      icon: Calendar,
      label: "Schedule",
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        // TODO: Implement calendar booking
        console.log("Schedule clicked");
      }
    },
  ];

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (isChatOpen) {
      setIsChatOpen(false);
    }
  };

  return (
    <>
      {/* Chat Interface */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <AIChat onClose={() => setIsChatOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* Secondary Actions */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <Button
                    size="icon"
                    className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${action.color}`}
                    onClick={action.action}
                    title={action.label}
                  >
                    <action.icon className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main AI Chat Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            size="icon"
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ai-glow bg-primary hover:bg-primary/90"
            onClick={toggleChat}
            title="AI Assistant"
          >
            {isChatOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Brain className="w-6 h-6" />
            )}
          </Button>
        </motion.div>

        {/* Expand/Collapse Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            variant="secondary"
            className="w-10 h-10 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            onClick={toggleExpanded}
            title={isExpanded ? "Collapse" : "More Actions"}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-4 h-4" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </>
  );
}
