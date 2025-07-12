import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Phone, 
  Mail,
  MapPin,
  Building,
  Clock,
  Target,
  BarChart3,
  Search,
  Plus,
  Shield,
  Home,
  Eye,
  Edit,
  Trash2,
  Activity,
  ArrowUpRight,
  CheckCircle
} from 'lucide-react';

export default function AgentPortalPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data with better error handling
  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/agents'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
    staleTime: 2 * 60 * 1000,
  });

  const { data: contracts = [], isLoading: contractsLoading } = useQuery({
    queryKey: ['/api/contracts'],
    staleTime: 5 * 60 * 1000,
  });

  const { data: commissions = [], isLoading: commissionsLoading } = useQuery({
    queryKey: ['/api/commissions'],
    staleTime: 5 * 60 * 1000,
  });

  // Create lead mutation
  const createLeadMutation = useMutation({
    mutationFn: (leadData: any) => apiRequest('/api/leads', 'POST', leadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setIsNewLeadOpen(false);
      toast({
        title: "Success",
        description: "New lead created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    },
  });

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'converted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'bg-red-100 text-red-800';
    if (priority >= 3) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  // Calculate metrics
  const totalCommissionAmount = commissions.reduce((sum, c) => sum + (c.netCommission || 0), 0);
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;
  
  // Filter leads based on search
  const filteredLeads = leads.filter(lead => 
    `${lead.firstName} ${lead.lastName} ${lead.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Agent Portal</h1>
              <p className="text-slate-300">Professional CRM for Hawaii luxury real estate</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{leads.length}</div>
                <div className="text-sm text-slate-400">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{conversionRate}%</div>
                <div className="text-sm text-slate-400">Conversion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(totalCommissionAmount)}</div>
                <div className="text-sm text-slate-400">Commissions</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList className="grid grid-cols-6 w-fit">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="leads" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Leads ({leads.length})
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="contracts" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Deals
                </TabsTrigger>
                <TabsTrigger value="commissions" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Money
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Team
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'leads' && (
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Lead</DialogTitle>
                      </DialogHeader>
                      <NewLeadForm onSubmit={createLeadMutation.mutate} />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            {/* Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Leads</p>
                        <p className="text-3xl font-bold">{leads.filter(l => l.status === 'active').length}</p>
                        <p className="text-xs text-gray-500 mt-1">+{leads.length - leads.filter(l => l.status === 'active').length} total</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-3xl font-bold">{conversionRate}%</p>
                        <p className="text-xs text-gray-500 mt-1">{convertedLeads} converted</p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Deals</p>
                        <p className="text-3xl font-bold">{activeContracts}</p>
                        <p className="text-xs text-gray-500 mt-1">{contracts.length} total</p>
                      </div>
                      <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalCommissionAmount)}</p>
                        <p className="text-xs text-gray-500 mt-1">This month</p>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Leads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leads.slice(0, 5).map((lead, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {lead.firstName?.[0]}{lead.lastName?.[0]}
                            </div>
                            <div>
                              <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                              <p className="text-sm text-gray-500">{lead.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                            {lead.budget && (
                              <p className="text-sm text-gray-500 mt-1">
                                {formatCurrency(lead.budget)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        onClick={() => setActiveTab('leads')}
                      >
                        <Plus className="h-6 w-6" />
                        <span>Add Lead</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        onClick={() => setActiveTab('appointments')}
                      >
                        <Calendar className="h-6 w-6" />
                        <span>Schedule</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        onClick={() => setActiveTab('contracts')}
                      >
                        <FileText className="h-6 w-6" />
                        <span>New Deal</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        onClick={() => setActiveTab('commissions')}
                      >
                        <BarChart3 className="h-6 w-6" />
                        <span>Analytics</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Leads */}
            <TabsContent value="leads" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                      <p className="text-gray-500">Get started by adding your first lead</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredLeads.map((lead, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {lead.firstName?.[0]}{lead.lastName?.[0]}
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold text-lg">{lead.firstName} {lead.lastName}</h3>
                                  <Badge className={getStatusColor(lead.status)}>
                                    {lead.status}
                                  </Badge>
                                  {lead.priority && (
                                    <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                                      Priority {lead.priority}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {lead.email}
                                  </span>
                                  {lead.phone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      {lead.phone}
                                    </span>
                                  )}
                                  {lead.budget && (
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="h-4 w-4" />
                                      {formatCurrency(lead.budget)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                              <Button size="sm">
                                <Mail className="h-4 w-4 mr-1" />
                                Email
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appointments */}
            <TabsContent value="appointments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Appointment Scheduling</h2>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No appointments scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{appointment.title}</h3>
                              <p className="text-muted-foreground">{appointment.type}</p>
                              <p className="text-sm">Date: {formatDate(appointment.scheduledAt)}</p>
                            </div>
                            <Badge variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}>
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contracts */}
            <TabsContent value="contracts" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Contract Management</h2>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  New Contract
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {contracts.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No contracts available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contracts.map((contract, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{contract.type} Contract</h3>
                              <p className="text-muted-foreground">Property ID: {contract.propertyId}</p>
                              <p className="text-sm">Amount: {formatCurrency(contract.contractAmount)}</p>
                            </div>
                            <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                              {contract.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commissions */}
            <TabsContent value="commissions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Commission Tracking</h2>
                <Button>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Add Commission
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {commissions.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No commission records</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {commissions.map((commission, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">Sale Price: {formatCurrency(commission.salePrice)}</h3>
                              <p className="text-muted-foreground">Agent ID: {commission.agentId}</p>
                              <p className="text-sm">Commission Rate: {commission.commissionRate}%</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">
                                {formatCurrency(commission.netCommission)}
                              </p>
                              <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                                {commission.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Agents */}
            <TabsContent value="agents" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Team Management</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Agent
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {agents.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No agents registered</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {agents.map((agent, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold">{agent.firstName} {agent.lastName}</h3>
                            <p className="text-muted-foreground">{agent.email}</p>
                            <p className="text-sm">Phone: {agent.phone || 'Not provided'}</p>
                            <p className="text-sm">Role: {agent.role}</p>
                            <Badge 
                              variant={agent.isActive ? 'default' : 'secondary'}
                              className="mt-2"
                            >
                              {agent.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

// New Lead Form Component
function NewLeadForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    budget: '',
    status: 'new',
    priority: 3,
    buyerType: 'buyer',
    timeframe: '3-6 months',
    source: 'website'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      budget: formData.budget ? parseInt(formData.budget) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          type="number"
          placeholder="e.g. 1500000"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buyerType">Type</Label>
          <Select value={formData.buyerType} onValueChange={(value) => setFormData({ ...formData, buyerType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority.toString()} onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Low (1)</SelectItem>
              <SelectItem value="2">Medium-Low (2)</SelectItem>
              <SelectItem value="3">Medium (3)</SelectItem>
              <SelectItem value="4">High (4)</SelectItem>
              <SelectItem value="5">Urgent (5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Create Lead</Button>
      </div>
    </form>
  );
}