
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Mail, MessageSquare, Camera, MapPin, Clock, TrendingUp } from 'lucide-react';

interface MarketingCampaign {
  name: string;
  type: string;
  targetAudience: string[];
  content: string;
  schedule: string;
  islands: string[];
  priceRanges: string[];
  propertyTypes: string[];
}

export default function HawaiiMarketingAutomation() {
  const [campaign, setCampaign] = useState<MarketingCampaign>({
    name: '',
    type: '',
    targetAudience: [],
    content: '',
    schedule: '',
    islands: [],
    priceRanges: [],
    propertyTypes: []
  });

  const campaignTypes = [
    { value: 'weekly-listings', label: 'Weekly New Listings', icon: Mail },
    { value: 'island-spotlight', label: 'Island Spotlight', icon: MapPin },
    { value: 'price-reduction', label: 'Price Reduction Alerts', icon: TrendingUp },
    { value: 'market-update', label: 'Market Updates', icon: Calendar },
    { value: 'lifestyle-content', label: 'Lifestyle Content', icon: Camera },
    { value: 'event-based', label: 'Event-Based Marketing', icon: Clock }
  ];

  const targetAudiences = [
    'Mainland Buyers', 'International Buyers', 'Military/VA Buyers', 
    'Local Hawaiians', 'Investors', 'Luxury Buyers', 'First-Time Buyers',
    'Snowbirds', 'Cash Buyers', 'VA Loan Qualified'
  ];

  const hawaiiEvents = [
    'Surf Competitions', 'Hula Festivals', 'Lei Day', 'King Kamehameha Day',
    'Aloha Festivals', 'Triple Crown Surfing', 'Merrie Monarch Festival',
    'Hawaii Food & Wine Festival', 'Ironman Triathlon', 'Sunset on the Beach'
  ];

  const emailTemplates = {
    'weekly-listings': {
      subject: 'New Hawaii Properties This Week - {{island}} Luxury Listings',
      content: `Aloha {{firstName}},

Discover this week's newest luxury properties on {{island}}:

🏝️ Featured Properties:
{{properties}}

🌺 Hawaii Market Insights:
- Average days on market: {{dom}}
- Price trends: {{trends}}
- Inventory levels: {{inventory}}

Ready to explore paradise? Let's schedule your virtual or in-person tour.

Mahalo,
{{agentName}}`
    },
    'island-spotlight': {
      subject: '{{island}} Living - Your Guide to Paradise',
      content: `Aloha {{firstName}},

This month we're spotlighting {{island}} - here's why it might be perfect for you:

🏖️ Lifestyle Highlights:
{{lifestyle}}

🏡 Current Market:
{{market_data}}

📸 Virtual Tours Available:
{{virtual_tours}}

Curious about {{island}} living? I'd love to share more insights.

With aloha,
{{agentName}}`
    }
  };

  const handleAudienceToggle = (audience: string) => {
    setCampaign(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience]
    }));
  };

  const handleIslandToggle = (island: string) => {
    setCampaign(prev => ({
      ...prev,
      islands: prev.islands.includes(island)
        ? prev.islands.filter(i => i !== island)
        : [...prev.islands, island]
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Hawaii Marketing Automation Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaign Setup */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Create New Campaign</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input
                        id="campaign-name"
                        placeholder="e.g., Oahu Luxury Weekly"
                        value={campaign.name}
                        onChange={(e) => setCampaign(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label>Campaign Type</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {campaignTypes.map((type) => {
                          const Icon = type.icon;
                          const isSelected = campaign.type === type.value;
                          
                          return (
                            <div
                              key={type.value}
                              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setCampaign(prev => ({ ...prev, type: type.value }))}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span className="text-sm font-medium">{type.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label>Target Islands</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['Oahu', 'Maui', 'Big Island', 'Kauai', 'Molokai', 'Lanai'].map((island) => (
                          <div key={island} className="flex items-center space-x-2">
                            <Checkbox
                              id={island}
                              checked={campaign.islands.includes(island)}
                              onCheckedChange={() => handleIslandToggle(island)}
                            />
                            <Label htmlFor={island} className="text-sm">{island}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Target Audience</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {targetAudiences.map((audience) => (
                          <div key={audience} className="flex items-center space-x-2">
                            <Checkbox
                              id={audience}
                              checked={campaign.targetAudience.includes(audience)}
                              onCheckedChange={() => handleAudienceToggle(audience)}
                            />
                            <Label htmlFor={audience} className="text-sm">{audience}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hawaii-Specific Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hawaii-Specific Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Quick Hawaii Templates</Label>
                      <div className="space-y-2 mt-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          🏖️ Beach Access Properties
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          🏔️ Mountain View Homes
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          🏌️ Golf Course Living
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          🏄 Surf Break Properties
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          💼 Investment Properties
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Hawaii Events Integration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Link to Hawaii events" />
                        </SelectTrigger>
                        <SelectContent>
                          {hawaiiEvents.map((event) => (
                            <SelectItem key={event} value={event}>{event}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Schedule</Label>
                      <Select value={campaign.schedule} onValueChange={(value) => setCampaign(prev => ({ ...prev, schedule: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly-friday">Weekly (Friday 3 PM HST)</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="event-triggered">Event Triggered</SelectItem>
                          <SelectItem value="price-change">Price Change Triggered</SelectItem>
                          <SelectItem value="new-listing">New Listing Triggered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                        Launch Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(emailTemplates).map(([key, template]) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">{key.replace('-', ' ')} Template</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Subject Line</Label>
                        <Input value={template.subject} readOnly className="bg-gray-50" />
                      </div>
                      <div>
                        <Label>Email Content</Label>
                        <Textarea 
                          value={template.content} 
                          readOnly 
                          className="bg-gray-50 min-h-[200px] text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit Template</Button>
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button variant="outline" size="sm">Test Send</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hawaii-Specific Automation Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🏝️ New Island Listings Alert</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Automatically send targeted listings when new properties match buyer preferences
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Active</Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🌺 Aloha Follow-up Sequence</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Cultural-sensitive follow-up sequence for local Hawaiian clients
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Active</Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🪖 VA Buyer Onboarding</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Specialized sequence for military buyers with VA loan information
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Inactive</Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🏄 Surf Report & Properties</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Weekly surf conditions with nearby beachfront properties
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Active</Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Open Rate</p>
                        <p className="text-2xl font-bold">34.2%</p>
                      </div>
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">+2.1% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Click Rate</p>
                        <p className="text-2xl font-bold">8.7%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">+1.3% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Leads Generated</p>
                        <p className="text-2xl font-bold">23</p>
                      </div>
                      <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This month</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance by Island</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { island: 'Oahu', opens: '42%', clicks: '12%', leads: 8 },
                      { island: 'Maui', opens: '38%', clicks: '9%', leads: 6 },
                      { island: 'Big Island', opens: '31%', clicks: '7%', leads: 4 },
                      { island: 'Kauai', opens: '35%', clicks: '8%', leads: 5 }
                    ].map((data) => (
                      <div key={data.island} className="flex items-center justify-between p-3 border rounded">
                        <span className="font-medium">{data.island}</span>
                        <div className="flex gap-4 text-sm">
                          <span>Opens: {data.opens}</span>
                          <span>Clicks: {data.clicks}</span>
                          <span>Leads: {data.leads}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
