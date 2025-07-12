import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Heart,
  DollarSign,
  Home,
  Users,
  Briefcase
} from "lucide-react";

interface LeadCaptureFormProps {
  propertyId?: number;
}

export default function LeadCaptureForm({ propertyId }: LeadCaptureFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    budget: "",
    propertyType: "",
    familySize: "",
    lifestyle: {
      remoteWork: false,
      oceanActivities: false,
      nightlife: false,
      nature: false,
      golf: false,
      privacy: false,
    },
    inquiryType: "info_request",
    message: "",
    interests: [] as string[],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLifestyleChange = (lifestyle: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [lifestyle]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create lead
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          propertyType: formData.propertyType,
          lifestyle: formData.lifestyle,
          interests: formData.interests,
        }),
      });

      if (!leadResponse.ok) throw new Error("Failed to create lead");
      
      const lead = await leadResponse.json();

      // Create property inquiry if propertyId provided
      if (propertyId) {
        await fetch("/api/property-inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId,
            leadId: lead.id,
            inquiryType: formData.inquiryType,
            message: formData.message,
          }),
        });
      }

      toast({
        title: "Thank you for your interest!",
        description: "We'll be in touch within 24 hours to discuss your requirements.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        budget: "",
        propertyType: "",
        familySize: "",
        lifestyle: {
          remoteWork: false,
          oceanActivities: false,
          nightlife: false,
          nature: false,
          golf: false,
          privacy: false,
        },
        inquiryType: "info_request",
        message: "",
        interests: [],
      });

    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const lifestyleOptions = [
    { key: "remoteWork", label: "Remote Work", icon: Briefcase },
    { key: "oceanActivities", label: "Ocean Activities", icon: Heart },
    { key: "nightlife", label: "Nightlife", icon: Calendar },
    { key: "nature", label: "Nature/Hiking", icon: Calendar },
    { key: "golf", label: "Golf", icon: Calendar },
    { key: "privacy", label: "Privacy", icon: Home },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Get More Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select onValueChange={(value) => handleInputChange("budget", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000000">Under $1M</SelectItem>
                    <SelectItem value="2000000">$1M - $2M</SelectItem>
                    <SelectItem value="5000000">$2M - $5M</SelectItem>
                    <SelectItem value="10000000">$5M - $10M</SelectItem>
                    <SelectItem value="20000000">$10M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="familySize">Family Size</Label>
                <Select onValueChange={(value) => handleInputChange("familySize", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 people</SelectItem>
                    <SelectItem value="3-4">3-4 people</SelectItem>
                    <SelectItem value="5-6">5-6 people</SelectItem>
                    <SelectItem value="7+">7+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="propertyType">Property Type Interest</Label>
              <Select onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estate">Estate</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lifestyle Preferences */}
            <div>
              <Label>Lifestyle Preferences</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {lifestyleOptions.map((option) => (
                  <div key={option.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.key}
                      checked={formData.lifestyle[option.key as keyof typeof formData.lifestyle]}
                      onCheckedChange={(checked) => 
                        handleLifestyleChange(option.key, checked as boolean)
                      }
                    />
                    <Label htmlFor={option.key} className="text-sm flex items-center gap-1">
                      <option.icon className="w-3 h-3" />
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry Type */}
            <div>
              <Label htmlFor="inquiryType">How can we help?</Label>
              <Select 
                value={formData.inquiryType}
                onValueChange={(value) => handleInputChange("inquiryType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info_request">Property Information</SelectItem>
                  <SelectItem value="viewing">Schedule Viewing</SelectItem>
                  <SelectItem value="virtual_tour">Virtual Tour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Additional Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Tell us more about what you're looking for..."
                className="mt-1"
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full ai-glow" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Get In Touch
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
