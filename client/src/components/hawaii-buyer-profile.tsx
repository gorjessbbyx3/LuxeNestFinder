
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Plane, Shield, Heart, Camera, Clock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface BuyerProfile {
  clientType: string;
  timeZone: string;
  preferredCommunication: string[];
  interests: string[];
  timeline: string;
  budget: string;
  financingType: string;
  culturalConsiderations: string;
  communicationNotes: string;
}

export default function HawaiiBuyerProfile() {
  const [profile, setProfile] = useState<BuyerProfile>({
    clientType: '',
    timeZone: '',
    preferredCommunication: [],
    interests: [],
    timeline: '',
    budget: '',
    financingType: '',
    culturalConsiderations: '',
    communicationNotes: ''
  });

  const { toast } = useToast();

  // Create buyer profile mutation
  const saveBuyerProfileMutation = useMutation({
    mutationFn: async (profileData: BuyerProfile) => {
      return await apiRequest('/api/buyer-profiles', {
        method: 'POST',
        body: JSON.stringify({ ...profileData, leadId: 1 }), // Default to lead ID 1 for demo
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Buyer profile saved successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save buyer profile.",
        variant: "destructive",
      });
    },
  });

  const generateHawaiiGuide = () => {
    // Generate a personalized Hawaii guide based on profile
    const guideContent = `
# Personalized Hawaii Living Guide

## Client Profile: ${profile.clientType.replace('-', ' ').toUpperCase()}
**Timeline:** ${profile.timeline}
**Budget:** $${profile.budget}
**Communication Preference:** ${profile.preferredCommunication.join(', ')}

## Recommended Areas:
${profile.interests.includes('Ocean Activities') ? '🌊 **Lanikai Beach** - Perfect for ocean lovers' : ''}
${profile.interests.includes('Golf') ? '🏌️ **Kapalua Resort** - World-class golf courses' : ''}
${profile.interests.includes('Cultural Experiences') ? '🏛️ **Downtown Honolulu** - Rich cultural heritage' : ''}

## Hawaii-Specific Considerations:
- **Time Zone:** Living in ${profile.timeZone}
- **Cultural Notes:** ${profile.culturalConsiderations || 'Standard Hawaii cultural orientation recommended'}
- **Financing:** ${profile.financingType} options available

## Next Steps:
1. Schedule property tours in recommended areas
2. Connect with local Hawaii specialists
3. Begin pre-approval process
4. Plan exploratory visit to Hawaii

*Generated on ${new Date().toLocaleDateString()} for personalized Hawaii real estate journey.*
    `;

    // Create and download the guide
    const blob = new Blob([guideContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Hawaii-Living-Guide-${profile.clientType}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Hawaii Guide Generated!",
      description: "Your personalized Hawaii living guide has been downloaded.",
    });
  };

  const handleSaveProfile = () => {
    if (!profile.clientType || !profile.timeZone) {
      toast({
        title: "Missing Information",
        description: "Please fill in client type and time zone.",
        variant: "destructive",
      });
      return;
    }
    saveBuyerProfileMutation.mutate(profile);
  };

  const clientTypes = [
    { value: 'mainland-buyer', label: 'Mainland Buyer', icon: Plane },
    { value: 'international', label: 'International Buyer', icon: MapPin },
    { value: 'military-va', label: 'Military/VA Buyer', icon: Shield },
    { value: 'local-hawaiian', label: 'Local/Native Hawaiian', icon: Heart },
    { value: 'investor', label: 'Investment Buyer', icon: Camera },
    { value: 'snowbird', label: 'Seasonal Resident', icon: Clock }
  ];

  const timeZones = [
    'HST (Hawaii)', 'PST (West Coast)', 'MST (Mountain)', 'CST (Central)', 
    'EST (East Coast)', 'JST (Japan)', 'AEST (Australia)', 'GMT (UK)', 'CET (Europe)'
  ];

  const communicationPrefs = [
    'Email', 'Text/SMS', 'Phone Calls', 'Video Calls', 'WhatsApp', 'WeChat', 'In-Person Only'
  ];

  const hawaiiInterests = [
    'Surfing/Beach Access', 'Golf Courses', 'Hiking Trails', 'Schools/Education',
    'Shopping Centers', 'Restaurants', 'Cultural Sites', 'Fishing/Boating',
    'Vacation Rental Income', 'Privacy/Seclusion', 'Community/Neighbors', 'Investment Potential'
  ];

  const handleCommunicationToggle = (method: string) => {
    setProfile(prev => ({
      ...prev,
      preferredCommunication: prev.preferredCommunication.includes(method)
        ? prev.preferredCommunication.filter(m => m !== method)
        : [...prev.preferredCommunication, method]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const getClientTypeDetails = (type: string) => {
    const details = {
      'mainland-buyer': {
        color: 'bg-blue-100 text-blue-800',
        tips: 'Remote coordination, virtual tours, tax implications for non-residents'
      },
      'international': {
        color: 'bg-purple-100 text-purple-800',
        tips: 'FIRPTA requirements, currency exchange, visa/residency status'
      },
      'military-va': {
        color: 'bg-green-100 text-green-800',
        tips: 'VA loan benefits, PCS timeline assistance, base proximity'
      },
      'local-hawaiian': {
        color: 'bg-orange-100 text-orange-800',
        tips: 'Cultural sensitivity, family referrals, local housing programs (DHHL, HHFDC)'
      },
      'investor': {
        color: 'bg-yellow-100 text-yellow-800',
        tips: 'ROI calculations, vacation rental regulations, property management'
      },
      'snowbird': {
        color: 'bg-teal-100 text-teal-800',
        tips: 'Seasonal availability, remote management, dual residency considerations'
      }
    };
    return details[type as keyof typeof details] || { color: 'bg-gray-100 text-gray-800', tips: '' };
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Hawaii Buyer Profile Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client Type Selection */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Client Type</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {clientTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = profile.clientType === type.value;
              const details = getClientTypeDetails(type.value);
              
              return (
                <div
                  key={type.value}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setProfile(prev => ({ ...prev, clientType: type.value }))}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                  {isSelected && (
                    <div className="mt-2">
                      <Badge className={`text-xs ${details.color}`}>
                        Key Focus
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">{details.tips}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Zone & Communication */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timezone">Client Time Zone</Label>
            <Select value={profile.timeZone} onValueChange={(value) => setProfile(prev => ({ ...prev, timeZone: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((tz) => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timeline">Purchase Timeline</Label>
            <Select value={profile.timeline} onValueChange={(value) => setProfile(prev => ({ ...prev, timeline: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
                <SelectItem value="short-term">Short-term (3-6 months)</SelectItem>
                <SelectItem value="medium-term">Medium-term (6-12 months)</SelectItem>
                <SelectItem value="long-term">Long-term (1+ years)</SelectItem>
                <SelectItem value="seasonal">Seasonal/Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preferred Communication Methods */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Preferred Communication Methods</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {communicationPrefs.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                  id={method}
                  checked={profile.preferredCommunication.includes(method)}
                  onCheckedChange={() => handleCommunicationToggle(method)}
                />
                <Label htmlFor={method} className="text-sm">{method}</Label>
              </div>
            ))}
          </div>
          {profile.preferredCommunication.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {profile.preferredCommunication.map((method) => (
                <Badge key={method} variant="secondary" className="text-xs">{method}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Hawaii-Specific Interests */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Hawaii Lifestyle Interests</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {hawaiiInterests.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={profile.interests.includes(interest)}
                  onCheckedChange={() => handleInterestToggle(interest)}
                />
                <Label htmlFor={interest} className="text-sm">{interest}</Label>
              </div>
            ))}
          </div>
          {profile.interests.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Financing & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="financing">Financing Type</Label>
            <Select value={profile.financingType} onValueChange={(value) => setProfile(prev => ({ ...prev, financingType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select financing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conventional">Conventional Loan</SelectItem>
                <SelectItem value="va-loan">VA Loan</SelectItem>
                <SelectItem value="cash">Cash Purchase</SelectItem>
                <SelectItem value="jumbo">Jumbo Loan</SelectItem>
                <SelectItem value="foreign-national">Foreign National Loan</SelectItem>
                <SelectItem value="investment">Investment Property Loan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <Select value={profile.budget} onValueChange={(value) => setProfile(prev => ({ ...prev, budget: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-500k">Under $500K</SelectItem>
                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                <SelectItem value="2m-5m">$2M - $5M</SelectItem>
                <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                <SelectItem value="over-10m">$10M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cultural Considerations & Notes */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="cultural">Cultural Considerations</Label>
            <Textarea
              id="cultural"
              placeholder="Any cultural, religious, or personal considerations to keep in mind..."
              value={profile.culturalConsiderations}
              onChange={(e) => setProfile(prev => ({ ...prev, culturalConsiderations: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="notes">Communication Notes</Label>
            <Textarea
              id="notes"
              placeholder="Special communication preferences, best times to contact, language preferences, etc."
              value={profile.communicationNotes}
              onChange={(e) => setProfile(prev => ({ ...prev, communicationNotes: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600"
            onClick={handleSaveProfile}
            disabled={saveBuyerProfileMutation.isPending}
          >
            {saveBuyerProfileMutation.isPending ? 'Saving...' : 'Save Buyer Profile'}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={generateHawaiiGuide}
          >
            Generate Hawaii Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
