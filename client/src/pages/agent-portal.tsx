import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle,
  Star,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Crown,
  Award,
  Briefcase,
  ChevronRight,
  Bell,
  Settings
} from 'lucide-react';

export default function AgentPortalPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeadStatus, setSelectedLeadStatus] = useState('all');
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Advanced queries with proper error handling
  const { data: agents = [], isLoading: agentsLoading, error: agentsError } = useQuery({
    queryKey: ['/api/agents'],
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  const { data: leads = [], isLoading: leadsLoading, error: leadsError } = useQuery({
    queryKey: ['/api/leads'],
    staleTime: 30 * 1000, // 30 seconds for real-time feel
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
    staleTime: 60 * 1000,
  });

  const { data: contracts = [], isLoading: contractsLoading } = useQuery({
    queryKey: ['/api/contracts'],
    staleTime: 2 * 60 * 1000,
  });

  const { data: commissions = [], isLoading: commissionsLoading } = useQuery({
    queryKey: ['/api/commissions'],
    staleTime: 5 * 60 * 1000,
  });

  // Mutations for real-time updates
  const createLeadMutation = useMutation({
    mutationFn: (leadData: any) => apiRequest('/api/leads', 'POST', leadData),
    onSuccess: (newLead) => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setIsNewLeadOpen(false);
      toast({
        title: "🎉 New Lead Created",
        description: `${newLead.firstName} ${newLead.lastName} has been added to your pipeline`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Lead",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiRequest(`/api/leads/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Lead Updated",
        description: "Changes saved successfully",
      });
    },
  });

  // Advanced calculations
  const metrics = React.useMemo(() => {
    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => l.status === 'active').length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    const newLeadsThisWeek = leads.filter(l => {
      const leadDate = new Date(l.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return leadDate > weekAgo;
    }).length;
    
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
    const totalCommissionAmount = commissions.reduce((sum, c) => sum + (c.netCommission || 0), 0);
    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const avgDealSize = contracts.length > 0 ? contracts.reduce((sum, c) => sum + c.contractAmount, 0) / contracts.length : 0;
    
    const highPriorityLeads = leads.filter(l => l.priority >= 4).length;
    const upcomingAppointments = appointments.filter(a => {
      const appointmentDate = new Date(a.scheduledAt);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return appointmentDate <= tomorrow;
    }).length;

    return {
      totalLeads,
      activeLeads,
      convertedLeads,
      newLeadsThisWeek,
      conversionRate,
      totalCommissionAmount,
      activeContracts,
      avgDealSize,
      highPriorityLeads,
      upcomingAppointments
    };
  }, [leads, commissions, contracts, appointments]);

  // Advanced filtering
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = `${lead.firstName} ${lead.lastName} ${lead.email} ${lead.phone || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedLeadStatus === 'all' || lead.status === selectedLeadStatus;
    return matchesSearch && matchesStatus;
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800 border-blue-200',
      'active': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'converted': 'bg-purple-100 text-purple-800 border-purple-200',
      'closed': 'bg-gray-100 text-gray-800 border-gray-200',
      'lost': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status?.toLowerCase()] || colors.closed;
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 5) return 'bg-red-500 text-white';
    if (priority >= 4) return 'bg-orange-500 text-white';
    if (priority >= 3) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  const refreshData = () => {
    queryClient.invalidateQueries();
    toast({
      title: "Data Refreshed",
      description: "All data has been updated from the server",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white pt-20 pb-8">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Elite Agent Portal</h1>
                <p className="text-slate-300">Hawaii Luxury Real Estate Command Center</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.totalLeads}</div>
                <div className="text-xs text-slate-400">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{metrics.conversionRate}%</div>
                <div className="text-xs text-slate-400">Conversion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{formatCurrency(metrics.totalCommissionAmount)}</div>
                <div className="text-xs text-slate-400">Commissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{metrics.activeContracts}</div>
                <div className="text-xs text-slate-400">Active Deals</div>
              </div>
              
              <Button onClick={refreshData} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Alert Bar for High Priority Items */}
      {(metrics.highPriorityLeads > 0 || metrics.upcomingAppointments > 0) && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3">
          <div className="container mx-auto px-6 flex items-center justify-center gap-6">
            {metrics.highPriorityLeads > 0 && (
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="font-medium">{metrics.highPriorityLeads} high-priority leads need attention</span>
              </div>
            )}
            {metrics.upcomingAppointments > 0 && (
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span className="font-medium">{metrics.upcomingAppointments} appointments coming up</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList className="grid grid-cols-6 w-fit bg-white shadow-lg">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <BarChart3 className="h-4 w-4" />
                  Command Center
                </TabsTrigger>
                <TabsTrigger value="leads" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Users className="h-4 w-4" />
                  Pipeline ({metrics.totalLeads})
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="contracts" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <FileText className="h-4 w-4" />
                  Deals
                </TabsTrigger>
                <TabsTrigger value="commissions" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <DollarSign className="h-4 w-4" />
                  Revenue
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Award className="h-4 w-4" />
                  Analytics
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
                      className="pl-10 w-64 shadow-lg"
                    />
                  </div>
                  <Select value={selectedLeadStatus} onValueChange={setSelectedLeadStatus}>
                    <SelectTrigger className="w-40 shadow-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                        <Plus className="h-4 w-4" />
                        Add Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Lead</DialogTitle>
                      </DialogHeader>
                      <NewLeadForm onSubmit={createLeadMutation.mutate} />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            {/* Command Center Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {formatCurrency(leads.reduce((sum, l) => sum + (l.budget || 0), 0))}
                          </p>
                          <p className="text-xs text-green-600 mt-1">+{metrics.newLeadsThisWeek} new this week</p>
                        </div>
                        <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                          <TrendingUp className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                          <p className="text-3xl font-bold text-green-600">{metrics.conversionRate}%</p>
                          <p className="text-xs text-gray-500 mt-1">{metrics.convertedLeads} of {metrics.totalLeads} leads</p>
                        </div>
                        <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                          <p className="text-3xl font-bold text-purple-600">{formatCurrency(metrics.avgDealSize)}</p>
                          <p className="text-xs text-gray-500 mt-1">{metrics.activeContracts} active deals</p>
                        </div>
                        <div className="h-16 w-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Commission</p>
                          <p className="text-3xl font-bold text-yellow-600">{formatCurrency(metrics.totalCommissionAmount)}</p>
                          <p className="text-xs text-gray-500 mt-1">This period</p>
                        </div>
                        <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center">
                          <DollarSign className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Activity Feed & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Hot Leads Pipeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leads.slice(0, 8).map((lead, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {lead.firstName?.[0]}{lead.lastName?.[0]}
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                    {lead.firstName} {lead.lastName}
                                  </h3>
                                  <Badge className={getStatusColor(lead.status)}>
                                    {lead.status}
                                  </Badge>
                                  {lead.priority >= 4 && (
                                    <Badge className={getPriorityColor(lead.priority)}>
                                      <Star className="h-3 w-3 mr-1" />
                                      HOT
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {lead.email}
                                  </span>
                                  {lead.budget && (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                      <DollarSign className="h-4 w-4" />
                                      {formatCurrency(lead.budget)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="hover:bg-green-50">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button 
                          className="w-full h-14 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => setActiveTab('leads')}
                        >
                          <div className="flex items-center gap-3">
                            <Plus className="h-5 w-5" />
                            <span>Add New Lead</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full h-14 flex items-center justify-between hover:bg-blue-50"
                          onClick={() => setActiveTab('appointments')}
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5" />
                            <span>Schedule Meeting</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full h-14 flex items-center justify-between hover:bg-green-50"
                          onClick={() => setActiveTab('contracts')}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5" />
                            <span>Create Contract</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-orange-500" />
                        Today's Priorities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm">{metrics.highPriorityLeads} high-priority leads</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">{metrics.upcomingAppointments} upcoming meetings</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{metrics.newLeadsThisWeek} new leads this week</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Enhanced Leads Section */}
            <TabsContent value="leads" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Lead Pipeline Management
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-16">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No leads found</h3>
                      <p className="text-gray-500 mb-6">Start building your pipeline by adding your first lead</p>
                      <Button 
                        onClick={() => setIsNewLeadOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Lead
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredLeads.map((lead, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-white to-blue-50/30 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                                {lead.firstName?.[0]}{lead.lastName?.[0]}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors">
                                    {lead.firstName} {lead.lastName}
                                  </h3>
                                  <Badge className={getStatusColor(lead.status) + ' border'}>
                                    {lead.status}
                                  </Badge>
                                  {lead.priority >= 4 && (
                                    <Badge className={getPriorityColor(lead.priority)}>
                                      <Star className="h-3 w-3 mr-1" />
                                      Priority {lead.priority}
                                    </Badge>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                    {lead.email}
                                  </span>
                                  {lead.phone && (
                                    <span className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-green-500" />
                                      {lead.phone}
                                    </span>
                                  )}
                                  {lead.budget && (
                                    <span className="flex items-center gap-2 font-semibold text-green-600">
                                      <DollarSign className="h-4 w-4" />
                                      {formatCurrency(lead.budget)}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    {formatDate(lead.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="hover:bg-green-50">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                                <Mail className="h-4 w-4 mr-1" />
                                Email
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Placeholder tabs for completeness */}
            <TabsContent value="appointments">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Calendar & Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Advanced calendar integration coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Deal Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Contract management system being built</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commissions">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue & Commission Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Revenue analytics dashboard in development</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Advanced analytics suite coming soon</p>
                  </div>
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

// Enhanced Lead Form
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
    source: 'website',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      budget: formData.budget ? parseInt(formData.budget) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-semibold">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-sm font-semibold">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="mt-1"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-semibold">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1"
            placeholder="(808) 555-0123"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="budget" className="text-sm font-semibold">Budget</Label>
        <Input
          id="budget"
          type="number"
          placeholder="e.g. 2500000"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          className="mt-1"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="buyerType" className="text-sm font-semibold">Client Type</Label>
          <Select value={formData.buyerType} onValueChange={(value) => setFormData({ ...formData, buyerType: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="both">Buyer & Seller</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority" className="text-sm font-semibold">Priority Level</Label>
          <Select value={formData.priority.toString()} onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Low</SelectItem>
              <SelectItem value="2">2 - Medium-Low</SelectItem>
              <SelectItem value="3">3 - Medium</SelectItem>
              <SelectItem value="4">4 - High</SelectItem>
              <SelectItem value="5">5 - Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="source" className="text-sm font-semibold">Lead Source</Label>
          <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="cold_call">Cold Call</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes" className="text-sm font-semibold">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1"
          rows={3}
          placeholder="Any additional information about this lead..."
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Lead
        </Button>
      </div>
    </form>
  );
}