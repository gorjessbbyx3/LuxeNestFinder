
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Home, AlertTriangle } from 'lucide-react';

interface RentalCalculation {
  propertyValue: number;
  bedrooms: number;
  bathrooms: number;
  island: string;
  location: string;
  amenities: string[];
  seasonalRates: {
    peak: number;
    high: number;
    regular: number;
    low: number;
  };
  occupancyRates: {
    peak: number;
    high: number;
    regular: number;
    low: number;
  };
  expenses: {
    management: number;
    cleaning: number;
    maintenance: number;
    insurance: number;
    taxes: number;
    utilities: number;
  };
}

export default function VacationRentalCalculator() {
  const [calculation, setCalculation] = useState<Partial<RentalCalculation>>({
    propertyValue: 0,
    bedrooms: 0,
    bathrooms: 0,
    island: '',
    location: '',
    amenities: []
  });

  const [results, setResults] = useState<any>(null);

  const hawaiiLocations = {
    'oahu': ['Waikiki', 'Kailua', 'Lanikai', 'Hawaii Kai', 'Diamond Head', 'Kahala', 'North Shore'],
    'maui': ['Wailea', 'Kaanapali', 'Lahaina', 'Kihei', 'Hana', 'Upcountry'],
    'big-island': ['Kona', 'Kohala Coast', 'Hilo', 'Volcano', 'Waimea'],
    'kauai': ['Poipu', 'Princeville', 'Hanalei', 'Lihue', 'Waimea']
  };

  const amenityOptions = [
    'Ocean View', 'Beachfront', 'Pool', 'Hot Tub', 'Air Conditioning',
    'Parking', 'Wifi', 'Kitchen', 'Washer/Dryer', 'Beach Gear',
    'Snorkel Equipment', 'Surfboards', 'BBQ Grill', 'Lanai/Deck'
  ];

  const baseRates = {
    'oahu': { waikiki: 250, kailua: 300, 'north-shore': 200, other: 180 },
    'maui': { wailea: 400, kaanapali: 350, lahaina: 280, other: 220 },
    'big-island': { 'kohala-coast': 350, kona: 250, hilo: 150, other: 180 },
    'kauai': { poipu: 300, princeville: 350, hanalei: 280, other: 200 }
  };

  const calculateRentalIncome = () => {
    if (!calculation.propertyValue || !calculation.island || !calculation.location) return;

    const island = calculation.island;
    const location = calculation.location?.toLowerCase().replace(/\s+/g, '-');
    const bedrooms = calculation.bedrooms || 1;
    const bathrooms = calculation.bathrooms || 1;

    // Base rate calculation
    let baseRate = baseRates[island as keyof typeof baseRates]?.[location as keyof any] || 
                   baseRates[island as keyof typeof baseRates]?.other || 200;

    // Adjust for bedrooms
    baseRate = baseRate * Math.min(bedrooms, 5);

    // Amenity multipliers
    const amenityBonus = (calculation.amenities || []).reduce((bonus, amenity) => {
      const multipliers: { [key: string]: number } = {
        'Ocean View': 1.2,
        'Beachfront': 1.5,
        'Pool': 1.15,
        'Hot Tub': 1.1,
        'Air Conditioning': 1.05
      };
      return bonus * (multipliers[amenity] || 1.02);
    }, 1);

    baseRate = baseRate * amenityBonus;

    // Seasonal rates (Hawaii-specific)
    const seasonalRates = {
      peak: baseRate * 1.5,    // Christmas/New Year, Spring Break
      high: baseRate * 1.2,    // Summer months
      regular: baseRate,       // Fall/Winter
      low: baseRate * 0.8      // Rainy season
    };

    // Hawaii-specific occupancy rates
    const occupancyRates = {
      peak: 0.95,    // 95% during peak season
      high: 0.85,    // 85% during high season
      regular: 0.70, // 70% during regular season
      low: 0.50      // 50% during low season
    };

    // Calculate seasonal revenue (days per season in Hawaii)
    const seasonDays = { peak: 45, high: 120, regular: 150, low: 50 };
    
    const seasonalRevenue = Object.entries(seasonDays).reduce((total, [season, days]) => {
      const rate = seasonalRates[season as keyof typeof seasonalRates];
      const occupancy = occupancyRates[season as keyof typeof occupancyRates];
      return total + (rate * days * occupancy);
    }, 0);

    // Expenses (Hawaii-specific)
    const expenses = {
      management: seasonalRevenue * 0.25, // 25% management fee
      cleaning: seasonalRevenue * 0.08,   // Higher cleaning costs in Hawaii
      maintenance: seasonalRevenue * 0.12, // Higher maintenance due to salt air
      insurance: calculation.propertyValue! * 0.008, // Higher insurance rates
      taxes: calculation.propertyValue! * 0.003, // Property taxes
      utilities: 3600 // $300/month average
    };

    const totalExpenses = Object.values(expenses).reduce((sum, exp) => sum + exp, 0);
    const netIncome = seasonalRevenue - totalExpenses;
    const roi = (netIncome / calculation.propertyValue!) * 100;

    setResults({
      grossIncome: seasonalRevenue,
      expenses: expenses,
      totalExpenses: totalExpenses,
      netIncome: netIncome,
      roi: roi,
      seasonalRates: seasonalRates,
      occupancyRates: occupancyRates,
      monthlyAverage: netIncome / 12
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    setCalculation(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            Hawaii Vacation Rental Income Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="property-value">Property Value</Label>
                  <Input
                    id="property-value"
                    type="number"
                    placeholder="$1,500,000"
                    value={calculation.propertyValue || ''}
                    onChange={(e) => setCalculation(prev => ({ ...prev, propertyValue: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select 
                    value={calculation.bedrooms?.toString() || ''} 
                    onValueChange={(value) => setCalculation(prev => ({ ...prev, bedrooms: Number(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="island">Island</Label>
                  <Select 
                    value={calculation.island || ''} 
                    onValueChange={(value) => setCalculation(prev => ({ ...prev, island: value, location: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select island" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oahu">Oahu</SelectItem>
                      <SelectItem value="maui">Maui</SelectItem>
                      <SelectItem value="big-island">Big Island</SelectItem>
                      <SelectItem value="kauai">Kauai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select 
                    value={calculation.location || ''} 
                    onValueChange={(value) => setCalculation(prev => ({ ...prev, location: value }))}
                    disabled={!calculation.island}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {calculation.island && hawaiiLocations[calculation.island as keyof typeof hawaiiLocations]?.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Property Amenities</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {amenityOptions.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={amenity}
                        checked={(calculation.amenities || []).includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded"
                      />
                      <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                    </div>
                  ))}
                </div>
                {calculation.amenities && calculation.amenities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {calculation.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">{amenity}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={calculateRentalIncome}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600"
                disabled={!calculation.propertyValue || !calculation.island || !calculation.location}
              >
                Calculate Rental Income
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {results ? (
                <>
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Annual Net Income</p>
                        <p className="text-3xl font-bold text-green-600">
                          ${results.netIncome.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${Math.round(results.monthlyAverage).toLocaleString()}/month average
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">ROI</p>
                            <p className="text-xl font-bold">{results.roi.toFixed(1)}%</p>
                          </div>
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Gross Income</p>
                            <p className="text-xl font-bold">${Math.round(results.grossIncome / 1000)}K</p>
                          </div>
                          <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Seasonal Rate Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(results.seasonalRates).map(([season, rate]) => (
                          <div key={season} className="flex justify-between items-center">
                            <span className="capitalize">{season} Season:</span>
                            <span className="font-medium">${Math.round(rate as number)}/night</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Annual Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(results.expenses).map(([expense, amount]) => (
                          <div key={expense} className="flex justify-between items-center">
                            <span className="capitalize">{expense.replace(/([A-Z])/g, ' $1')}:</span>
                            <span>${Math.round(amount as number).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between items-center font-semibold">
                          <span>Total Expenses:</span>
                          <span>${Math.round(results.totalExpenses).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Hawaii Vacation Rental Considerations</p>
                        <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                          <li>• Check local zoning and vacation rental permits</li>
                          <li>• Consider Hawaii's transient accommodation tax (TAT)</li>
                          <li>• Factor in seasonal demand and competition</li>
                          <li>• Maintenance costs are higher due to salt air exposure</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter property details to calculate rental income potential</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
