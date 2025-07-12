import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Heart, Home, Users, Briefcase, Waves, Car, Settings } from 'lucide-react';

interface LifestylePreferences {
  familySize: string;
  propertyType: string;
  oceanView: boolean;
  lifestyle: {
    remoteWork: boolean;
    oceanActivities: boolean;
    privacy: boolean;
    nightlife: boolean;
    shopping: boolean;
    schools: boolean;
  };
  workType: string;
  entertainmentStyle: string[];
  transportationNeeds: string[];
}

interface LifestylePreferencesModalProps {
  onPreferencesSaved: (preferences: LifestylePreferences) => void;
  children: React.ReactNode;
}

export default function LifestylePreferencesModal({ onPreferencesSaved, children }: LifestylePreferencesModalProps) {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<LifestylePreferences>({
    familySize: '',
    propertyType: '',
    oceanView: false,
    lifestyle: {
      remoteWork: false,
      oceanActivities: false,
      privacy: false,
      nightlife: false,
      shopping: false,
      schools: false,
    },
    workType: '',
    entertainmentStyle: [],
    transportationNeeds: []
  });

  const entertainmentOptions = [
    'Hosting Dinner Parties',
    'Pool & Spa Entertainment', 
    'Home Theater',
    'Wine Tasting',
    'Outdoor BBQ',
    'Beach Activities',
    'Tennis/Golf',
    'Quiet Reading'
  ];

  const transportationOptions = [
    'Two-Car Garage',
    'Three+ Car Garage',
    'Boat Dock/Marina Access',
    'Helicopter Pad',
    'Electric Vehicle Charging',
    'Walking Distance Amenities',
    'Private Driver Access'
  ];

  const handleLifestyleChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [key]: value
      }
    }));
  };

  const handleEntertainmentToggle = (option: string) => {
    setPreferences(prev => ({
      ...prev,
      entertainmentStyle: prev.entertainmentStyle.includes(option)
        ? prev.entertainmentStyle.filter(item => item !== option)
        : [...prev.entertainmentStyle, option]
    }));
  };

  const handleTransportationToggle = (option: string) => {
    setPreferences(prev => ({
      ...prev,
      transportationNeeds: prev.transportationNeeds.includes(option)
        ? prev.transportationNeeds.filter(item => item !== option)
        : [...prev.transportationNeeds, option]
    }));
  };

  const handleSave = () => {
    // Only save if user has provided meaningful preferences
    const hasPreferences = preferences.familySize || 
                          preferences.propertyType || 
                          preferences.oceanView ||
                          Object.values(preferences.lifestyle).some(Boolean) ||
                          preferences.workType ||
                          preferences.entertainmentStyle.length > 0 ||
                          preferences.transportationNeeds.length > 0;

    if (hasPreferences) {
      onPreferencesSaved(preferences);
    }
    setOpen(false);
  };

  const isFormValid = preferences.familySize && preferences.propertyType;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-red-500" />
            Define Your Hawaii Lifestyle
          </DialogTitle>
          <p className="text-gray-600">
            Help us find properties that match your authentic lifestyle preferences
          </p>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Basic Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Basic Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="familySize">Family Size</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, familySize: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select family size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">Single/Couple (1-2 people)</SelectItem>
                      <SelectItem value="3-4">Small Family (3-4 people)</SelectItem>
                      <SelectItem value="5-6">Large Family (5-6 people)</SelectItem>
                      <SelectItem value="7+">Extended Family (7+ people)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="propertyType">Preferred Property Type</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, propertyType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estate">Luxury Estate</SelectItem>
                      <SelectItem value="house">Single Family Home</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="oceanView" 
                  checked={preferences.oceanView}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, oceanView: !!checked }))}
                />
                <Label htmlFor="oceanView">Ocean view is essential</Label>
              </div>
            </CardContent>
          </Card>

          {/* Work & Lifestyle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work & Daily Life
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workType">Work Situation</Label>
                <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, workType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote Work</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Office + Remote)</SelectItem>
                    <SelectItem value="office">Traditional Office</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="entrepreneur">Business Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Lifestyle Priorities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'remoteWork', label: 'Home Office Space', icon: Briefcase },
                    { key: 'oceanActivities', label: 'Beach & Water Sports', icon: Waves },
                    { key: 'privacy', label: 'Privacy & Seclusion', icon: Home },
                    { key: 'nightlife', label: 'Dining & Nightlife', icon: Users },
                    { key: 'shopping', label: 'Shopping & Retail', icon: Car },
                    { key: 'schools', label: 'Top-Rated Schools', icon: Settings }
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={preferences.lifestyle[key as keyof typeof preferences.lifestyle]}
                        onCheckedChange={(checked) => handleLifestyleChange(key, !!checked)}
                      />
                      <Label htmlFor={key} className="text-sm flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entertainment Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Entertainment Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {entertainmentOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={preferences.entertainmentStyle.includes(option)}
                      onCheckedChange={() => handleEntertainmentToggle(option)}
                    />
                    <Label htmlFor={option} className="text-xs">{option}</Label>
                  </div>
                ))}
              </div>
              {preferences.entertainmentStyle.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {preferences.entertainmentStyle.map((style) => (
                    <Badge key={style} variant="secondary" className="text-xs">{style}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transportation & Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Transportation & Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {transportationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={preferences.transportationNeeds.includes(option)}
                      onCheckedChange={() => handleTransportationToggle(option)}
                    />
                    <Label htmlFor={option} className="text-xs">{option}</Label>
                  </div>
                ))}
              </div>
              {preferences.transportationNeeds.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {preferences.transportationNeeds.map((need) => (
                    <Badge key={need} variant="outline" className="text-xs">{need}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}