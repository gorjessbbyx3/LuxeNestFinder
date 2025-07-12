import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Home
} from 'lucide-react';

export default function AgentPortalPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch agent data
  const { data: agents = [] } = useQuery({
    queryKey: ['/api/agents'],
    queryFn: () => fetch('/api/agents').then(res => res.json())
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: () => fetch('/api/leads').then(res => res.json())
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments'],
    queryFn: () => fetch('/api/appointments').then(res => res.json())
  });

  const { data: contracts = [] } = useQuery({
    queryKey: ['/api/contracts'],
    queryFn: () => fetch('/api/contracts').then(res => res.json())
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ['/api/commissions'],
    queryFn: () => fetch('/api/commissions').then(res => res.json())
  });

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Agent Portal</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Enterprise-grade CRM for Hawaii's luxury real estate professionals
            </p>
            <div className="flex items-center justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <span>Team Management</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>Performance Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                <span>Commission Tracking</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="agents">Team</TabsTrigger>
            </TabsList>

            {/* Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                        <p className="text-3xl font-bold">{leads.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Contracts</p>
                        <p className="text-3xl font-bold">{contracts.filter(c => c.status === 'active').length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Commissions</p>
                        <p className="text-3xl font-bold">
                          {formatCurrency(commissions.reduce((sum, c) => sum + (c.netCommission || 0), 0))}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                        <p className="text-3xl font-bold">{agents.filter(a => a.isActive).length}</p>
                      </div>
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leads.slice(0, 5).map((lead, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                            <p className="text-sm text-muted-foreground">{lead.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={lead.status === 'active' ? 'default' : 'secondary'}>
                            {lead.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {lead.budget ? formatCurrency(lead.budget) : 'No budget set'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leads */}
            <TabsContent value="leads" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Lead Management</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Lead
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {leads.map((lead, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{lead.firstName} {lead.lastName}</h3>
                            <p className="text-muted-foreground">{lead.email}</p>
                            <p className="text-sm">Phone: {lead.phone || 'Not provided'}</p>
                            <p className="text-sm">Budget: {lead.budget ? formatCurrency(lead.budget) : 'Not specified'}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={lead.status === 'active' ? 'default' : 'secondary'}>
                              {lead.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">
                              Priority: {lead.priority || 'Medium'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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