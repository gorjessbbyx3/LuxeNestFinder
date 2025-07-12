import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Star,
  CheckCircle,
  Calculator,
  Users,
  Phone,
  Mail,
  Building
} from 'lucide-react';

const homeValuationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().min(5, 'Please enter a complete address'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().optional(),
  propertyType: z.string().min(1, 'Property type is required'),
  squareFeet: z.string().min(1, 'Square footage is required'),
  bedrooms: z.string().min(1, 'Number of bedrooms is required'),
  bathrooms: z.string().min(1, 'Number of bathrooms is required'),
  yearBuilt: z.string().optional(),
  lotSize: z.string().optional(),
  condition: z.string().min(1, 'Property condition is required'),
  amenities: z.array(z.string()).default([]),
  upgrades: z.array(z.string()).default([])
});

type HomeValuationForm = z.infer<typeof homeValuationSchema>;

interface MarketValuation {
  estimatedValue: number;
  valueRange: {
    low: number;
    high: number;
  };
  pricePerSqFt: number;
  confidenceScore: number;
  comparables: Array<{
    mlsNumber: string;
    address: string;
    price: number;
    squareFeet: number;
    pricePerSqFt: number;
    distance: number;
    similarity: number;
  }>;
  marketAnalysis: {
    marketConditions: string;
    recommendedListPrice: number;
    timeToSell: string;
    priceAppreciation: number;
    demandIndex: number;
  };
  predictions: {
    sixMonths: number;
    oneYear: number;
    threeYears: number;
    fiveYears: number;
  };
}

const amenityOptions = [
  'Ocean View', 'Pool & Spa', 'Private Beach Access', 'Tennis Court',
  'Guest House', 'Home Theater', 'Wine Cellar', 'Elevator',
  'Solar Panels', 'Smart Home Technology', 'Gourmet Kitchen', 'Master Suite'
];

const upgradeOptions = [
  'Kitchen Renovation', 'Bathroom Renovation', 'New Flooring', 'Fresh Paint',
  'New Roof', 'HVAC System', 'Windows & Doors', 'Landscaping',
  'Pool Installation', 'Solar Installation', 'Security System', 'Appliances'
];

export default function SellYourHomePage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [valuation, setValuation] = useState<MarketValuation | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<HomeValuationForm>({
    resolver: zodResolver(homeValuationSchema),
    defaultValues: {
      amenities: [],
      upgrades: []
    }
  });

  const onSubmit = async (data: HomeValuationForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/api/home-valuation', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          amenities: selectedAmenities,
          upgrades: selectedUpgrades
        })
      });

      if (response.success) {
        setValuation(response.valuation);
        setStep(3);
        toast({
          title: "Valuation Complete!",
          description: "Your home valuation has been calculated using authentic Hawaii MLS data."
        });
      }
    } catch (error) {
      console.error('Valuation error:', error);
      toast({
        title: "Valuation Failed",
        description: "We couldn't complete your home valuation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <Navigation />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 pt-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sell Your Hawaii Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Get an instant market valuation using authentic Hawaii MLS data
            </p>
            <div className="flex items-center justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <span>Real MLS Data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <span>Instant Valuation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <span>CRM Integration</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full p-2 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                <Home className="h-4 w-4" />
              </div>
              <span className="font-medium">Property Details</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full p-2 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                <Users className="h-4 w-4" />
              </div>
              <span className="font-medium">Contact Info</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full p-2 ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                <Calculator className="h-4 w-4" />
              </div>
              <span className="font-medium">Market Valuation</span>
            </div>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-6 w-6" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Property Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Ocean View Dr"
                      {...form.register('address')}
                    />
                    {form.formState.errors.address && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select onValueChange={(value) => form.setValue('city', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Honolulu">Honolulu</SelectItem>
                        <SelectItem value="Kailua">Kailua</SelectItem>
                        <SelectItem value="Waialua">Waialua</SelectItem>
                        <SelectItem value="Waimanalo">Waimanalo</SelectItem>
                        <SelectItem value="Kaneohe">Kaneohe</SelectItem>
                        <SelectItem value="Pearl City">Pearl City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select onValueChange={(value) => form.setValue('propertyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">Single Family Home</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="estate">Luxury Estate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="squareFeet">Square Feet *</Label>
                    <Input
                      id="squareFeet"
                      type="number"
                      placeholder="2500"
                      {...form.register('squareFeet')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      placeholder="2010"
                      {...form.register('yearBuilt')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Select onValueChange={(value) => form.setValue('bedrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Select onValueChange={(value) => form.setValue('bathrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="2.5">2.5</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="3.5">3.5</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="condition">Property Condition *</Label>
                    <Select onValueChange={(value) => form.setValue('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Needs Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="lotSize">Lot Size (sq ft)</Label>
                  <Input
                    id="lotSize"
                    type="number"
                    placeholder="8000"
                    {...form.register('lotSize')}
                  />
                </div>

                {/* Amenities */}
                <div>
                  <Label className="text-base font-semibold">Premium Amenities</Label>
                  <p className="text-sm text-gray-600 mb-3">Select all that apply to your property</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenityOptions.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAmenities([...selectedAmenities, amenity]);
                            } else {
                              setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                            }
                          }}
                        />
                        <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                      </div>
                    ))}
                  </div>
                  {selectedAmenities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedAmenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Upgrades */}
                <div>
                  <Label className="text-base font-semibold">Recent Upgrades</Label>
                  <p className="text-sm text-gray-600 mb-3">Select upgrades completed in the last 5 years</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {upgradeOptions.map((upgrade) => (
                      <div key={upgrade} className="flex items-center space-x-2">
                        <Checkbox
                          id={upgrade}
                          checked={selectedUpgrades.includes(upgrade)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUpgrades([...selectedUpgrades, upgrade]);
                            } else {
                              setSelectedUpgrades(selectedUpgrades.filter(u => u !== upgrade));
                            }
                          }}
                        />
                        <Label htmlFor={upgrade} className="text-sm">{upgrade}</Label>
                      </div>
                    ))}
                  </div>
                  {selectedUpgrades.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedUpgrades.map((upgrade) => (
                        <Badge key={upgrade} variant="outline">{upgrade}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => setStep(2)} 
                  className="w-full"
                  size="lg"
                >
                  Continue to Contact Information
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Contact Information
                </CardTitle>
                <p className="text-gray-600">We'll send your valuation report and market insights to your email.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...form.register('firstName')}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      {...form.register('lastName')}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="(808) 555-0123"
                    {...form.register('phone')}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">Your Information is Secure</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        We use your contact information only to provide your valuation report and follow up with market insights. 
                        Your details will be added to our CRM system for personalized service.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    className="flex-1"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Calculating Value...
                      </>
                    ) : (
                      'Get My Home Valuation'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && valuation && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-6"
          >
            {/* Main Valuation Result */}
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <CardContent className="p-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">Your Home's Estimated Value</h2>
                  <div className="text-6xl font-bold mb-4">{formatCurrency(valuation.estimatedValue)}</div>
                  <div className="text-xl opacity-90">
                    Range: {formatCurrency(valuation.valueRange.low)} - {formatCurrency(valuation.valueRange.high)}
                  </div>
                  <div className="text-lg mt-2 opacity-80">
                    {formatCurrency(valuation.pricePerSqFt)} per sq ft
                  </div>
                  <Badge className="mt-4 bg-white/20 text-white border-white/30">
                    {Math.round(valuation.confidenceScore * 100)}% Confidence Score
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-semibold">Market Conditions</Label>
                    <p className="text-sm text-gray-600">{valuation.marketAnalysis.marketConditions}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Recommended List Price</Label>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(valuation.marketAnalysis.recommendedListPrice)}
                      </p>
                    </div>
                    <div>
                      <Label className="font-semibold">Time to Sell</Label>
                      <p className="text-lg font-bold">{valuation.marketAnalysis.timeToSell}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Annual Appreciation</Label>
                      <p className="text-lg font-bold text-blue-600">
                        {valuation.marketAnalysis.priceAppreciation}%
                      </p>
                    </div>
                    <div>
                      <Label className="font-semibold">Demand Index</Label>
                      <p className="text-lg font-bold">
                        {valuation.marketAnalysis.demandIndex}/10
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Future Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Value Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>6 Months</span>
                      <span className="font-bold">{formatCurrency(valuation.predictions.sixMonths)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>1 Year</span>
                      <span className="font-bold">{formatCurrency(valuation.predictions.oneYear)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>3 Years</span>
                      <span className="font-bold">{formatCurrency(valuation.predictions.threeYears)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>5 Years</span>
                      <span className="font-bold text-green-600">{formatCurrency(valuation.predictions.fiveYears)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparable Properties */}
            {valuation.comparables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Comparable Properties from Hawaii MLS
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Based on {valuation.comparables.length} similar properties in your area
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {valuation.comparables.slice(0, 3).map((comp, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{comp.address}</h4>
                            <p className="text-sm text-gray-600">MLS# {comp.mlsNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency(comp.price)}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(comp.pricePerSqFt)}/sq ft</p>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{formatNumber(comp.squareFeet)} sq ft</span>
                          <span>{comp.distance} miles away</span>
                          <Badge variant="outline">
                            {Math.round(comp.similarity * 100)}% similar
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Sell Your Home?</h3>
                <p className="text-gray-600 mb-6">
                  Our expert real estate agents are ready to help you sell your home for the best possible price.
                  Get a detailed market analysis and personalized selling strategy.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Schedule Consultation
                  </Button>
                  <Button variant="outline" size="lg" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Get Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}