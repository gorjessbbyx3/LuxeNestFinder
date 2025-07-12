import React, { useState, useEffect, useMemo } from 'react';
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
  Settings,
  Inbox,
  UserPlus,
  User,
  Video,
  AlertCircle,
  ChevronLeft,
  Reply,
  Archive,
  MoreVertical,
  MessageSquare,
  StarOff,
  Forward,
  Inbox as InboxIcon
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
            <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-blue-100 to-purple-100 p-1 rounded-xl">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all">
                <Users className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all">
                <Target className="h-4 w-4 mr-2" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="inbox" className="data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all">
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
              </TabsTrigger>
              <TabsTrigger value="appointments" className="data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all">
                <Calendar className="h-4 w-4 mr-2" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="contracts" className="data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all">
                <FileText className="h-4 w-4 mr-2" />
                Contracts
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all">
                <BarChart3 className="h-4 w-4 mr-2" />
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
                          onClick={() => setActiveTab('add-lead')}
                        >
                          <div className="flex items-center gap-3">
                            <UserPlus className="h-5 w-5" />
                            <span>Add New Lead</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full h-14 flex items-center justify-between hover:bg-blue-50"
                          onClick={() => setActiveTab('calendar')}
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5" />
                            <span>Calendar</span>
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
                        <Button 
                          variant="outline"
                          className="w-full h-14 flex items-center justify-between hover:bg-purple-50"
                          onClick={() => setActiveTab('inbox')}
                        >
                          <div className="flex items-center gap-3">
                            <Inbox className="h-5 w-5" />
                            <span>Inbox</span>
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

            {/* Appointments Section */}
            <TabsContent value="appointments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Appointment Scheduling</h2>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Appointment
                </Button>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No appointments scheduled</h3>
                      <p className="text-gray-500 mb-6">Start scheduling meetings with your leads and clients</p>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule First Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{appointment.title}</h3>
                              <p className="text-gray-600">{appointment.type}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatDate(appointment.scheduledAt)}
                                </span>
                                {appointment.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {appointment.location}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
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

            {/* Contracts Section */}
            <TabsContent value="contracts" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Deal Management</h2>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600">
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Contract
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Deals</p>
                        <p className="text-3xl font-bold text-green-600">{metrics.activeContracts}</p>
                      </div>
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatCurrency(contracts.reduce((sum, c) => sum + c.contractAmount, 0))}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                        <p className="text-3xl font-bold text-purple-600">{formatCurrency(metrics.avgDealSize)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Contract Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contractsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : contracts.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No contracts yet</h3>
                      <p className="text-gray-500 mb-6">Start converting your leads into deals</p>
                      <Button className="bg-gradient-to-r from-green-600 to-blue-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Contract
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contracts.map((contract, index) => (
                        <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-green-50/30">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-xl">{contract.type} Contract</h3>
                                <Badge className={getStatusColor(contract.status) + ' border'}>
                                  {contract.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <span className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-blue-500" />
                                  Property #{contract.propertyId}
                                </span>
                                <span className="flex items-center gap-2 font-semibold text-green-600">
                                  <DollarSign className="h-4 w-4" />
                                  {formatCurrency(contract.contractAmount)}
                                </span>
                                <span className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-purple-500" />
                                  Agent #{contract.agentId}
                                </span>
                                <span className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  {formatDate(contract.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="hover:bg-green-50">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-green-500 to-blue-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Update
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

            {/* Commissions Section */}
            <TabsContent value="commissions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Revenue & Commission Tracking</h2>
                <Button className="bg-gradient-to-r from-yellow-600 to-orange-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Add Commission
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Earned</p>
                        <p className="text-3xl font-bold text-green-600">{formatCurrency(metrics.totalCommissionAmount)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Commissions</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatCurrency(commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + (c.netCommission || 0), 0))}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Commission</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {formatCurrency(commissions.length > 0 ? metrics.totalCommissionAmount / commissions.length : 0)}
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                        <p className="text-3xl font-bold text-orange-600">
                          {commissions.length > 0 ? Math.round(commissions.reduce((sum, c) => sum + c.commissionRate, 0) / commissions.length * 10) / 10 : 0}%
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Commission History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {commissionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : commissions.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No commissions yet</h3>
                      <p className="text-gray-500 mb-6">Close your first deal to start earning commissions</p>
                      <Button className="bg-gradient-to-r from-yellow-600 to-orange-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Record Commission
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {commissions.map((commission, index) => (
                        <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-yellow-50/30">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-xl">Sale Commission</h3>
                                <Badge className={getStatusColor(commission.status) + ' border'}>
                                  {commission.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <span className="flex items-center gap-2 font-semibold text-green-600">
                                  <DollarSign className="h-4 w-4" />
                                  Sale: {formatCurrency(commission.salePrice)}
                                </span>
                                <span className="flex items-center gap-2">
                                  <Target className="h-4 w-4 text-blue-500" />
                                  Rate: {commission.commissionRate}%
                                </span>
                                <span className="flex items-center gap-2 font-bold text-green-600">
                                  <Award className="h-4 w-4" />
                                  Net: {formatCurrency(commission.netCommission)}
                                </span>
                                <span className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  {formatDate(commission.createdAt)}
                                </span>
                              </div>
                              {commission.brokerageSplit && (
                                <div className="mt-2 text-sm text-gray-600">
                                  Brokerage Split: {commission.brokerageSplit}%
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-600">
                                <Download className="h-4 w-4 mr-1" />
                                Invoice
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

            {/* Analytics Section */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Lead Conversion</p>
                        <p className="text-3xl font-bold text-blue-600">{metrics.conversionRate}%</p>
                        <p className="text-xs text-green-600 mt-1">Industry avg: 2-5%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Pipeline</p>
                        <p className="text-3xl font-bold text-green-600">{metrics.activeLeads}</p>
                        <p className="text-xs text-gray-500 mt-1">Hot prospects</p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenue Per Lead</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {formatCurrency(metrics.totalLeads > 0 ? metrics.totalCommissionAmount / metrics.totalLeads : 0)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Average value</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Weekly Growth</p>
                        <p className="text-3xl font-bold text-orange-600">+{metrics.newLeadsThisWeek}</p>
                        <p className="text-xs text-green-600 mt-1">New leads</p>
                      </div>
                      <ArrowUpRight className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Lead Status Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['new', 'active', 'converted', 'closed'].map((status) => {
                        const count = leads.filter(l => l.status === status).length;
                        const percentage = metrics.totalLeads > 0 ? Math.round((count / metrics.totalLeads) * 100) : 0;
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(status)}>{status}</Badge>
                              <span className="text-sm text-gray-600">{count} leads</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Lead Response Rate</span>
                        <span className="font-semibold">95%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Deal Cycle</span>
                        <span className="font-semibold">45 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Client Satisfaction</span>
                        <span className="font-semibold">4.9/5.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Referral Rate</span>
                        <span className="font-semibold">32%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Market Share</span>
                        <span className="font-semibold">8.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Calendar Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmbeddedCalendar />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inbox Tab */}
            <TabsContent value="inbox" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Inbox className="h-5 w-5 text-purple-600" />
                    Customer Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmbeddedInbox />
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

// Full-Featured Calendar Component for Agent Portal
function EmbeddedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const APPOINTMENT_TYPES = [
    { value: 'property_showing', label: 'Property Showing', icon: Home, color: 'bg-blue-500' },
    { value: 'client_meeting', label: 'Client Meeting', icon: Users, color: 'bg-green-500' },
    { value: 'listing_appointment', label: 'Listing Appointment', icon: Building, color: 'bg-purple-500' },
    { value: 'consultation', label: 'Consultation', icon: User, color: 'bg-orange-500' },
    { value: 'virtual_tour', label: 'Virtual Tour', icon: Video, color: 'bg-pink-500' },
    { value: 'closing', label: 'Closing', icon: CheckCircle, color: 'bg-emerald-500' }
  ];

  // Fetch appointments and related data
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['/api/leads'],
    staleTime: 5 * 60 * 1000,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['/api/properties'],
    staleTime: 5 * 60 * 1000,
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await apiRequest('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setIsNewAppointmentOpen(false);
      toast({
        title: "Success!",
        description: "Appointment created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create appointment",
        variant: "destructive",
      });
    },
  });

  // Calendar calculations
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.scheduledDate);
      return appointmentDate.toDateString() === date.toDateString();
    }).filter(appointment => {
      if (filterType === 'all') return true;
      return appointment.type === filterType;
    }).filter(appointment => {
      if (!searchTerm) return true;
      return appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             appointment.type?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const getAppointmentTypeConfig = (type: string) => {
    return APPOINTMENT_TYPES.find(t => t.value === type) || APPOINTMENT_TYPES[0];
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-xl font-bold">
            {viewMode === 'month' ? (
              `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            ) : viewMode === 'week' ? (
              `Week of ${weekDays[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            ) : (
              selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {['month', 'week', 'day'].map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={viewMode === mode ? 'default' : 'outline'}
                onClick={() => setViewMode(mode as 'month' | 'week' | 'day')}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
          
          <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
                <p className="text-sm text-gray-600">Schedule a new appointment with leads and properties</p>
              </DialogHeader>
              <AppointmentForm
                onSubmit={createAppointmentMutation.mutate}
                leads={leads}
                properties={properties}
                selectedDate={selectedDate}
                appointmentTypes={APPOINTMENT_TYPES}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border rounded-lg px-3 py-1"
          >
            <option value="all">All Types</option>
            {APPOINTMENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => (
            <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50 rounded-t-lg">
              {day}
            </div>
          ))}
          {weekDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <div
                key={index}
                className={`p-3 border rounded-lg min-h-[150px] cursor-pointer transition-colors ${
                  isToday 
                    ? 'bg-blue-50 border-blue-200' 
                    : isCurrentMonth 
                      ? 'bg-white hover:bg-gray-50' 
                      : 'bg-gray-50 text-gray-400'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment, idx) => {
                    const typeConfig = getAppointmentTypeConfig(appointment.type);
                    return (
                      <div
                        key={idx}
                        className={`text-xs p-1 rounded truncate text-white ${typeConfig.color}`}
                        title={appointment.title}
                      >
                        {new Date(appointment.scheduledDate).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })} {appointment.type}
                      </div>
                    );
                  })}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayAppointments.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
          {monthDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <div
                key={index}
                className={`p-2 border min-h-[100px] cursor-pointer transition-colors ${
                  isToday 
                    ? 'bg-blue-50 border-blue-200' 
                    : isCurrentMonth 
                      ? 'bg-white hover:bg-gray-50' 
                      : 'bg-gray-50 text-gray-400'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment, idx) => {
                    const typeConfig = getAppointmentTypeConfig(appointment.type);
                    return (
                      <div
                        key={idx}
                        className={`text-xs p-1 rounded truncate text-white ${typeConfig.color}`}
                        title={appointment.title}
                      >
                        {appointment.type}
                      </div>
                    );
                  })}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayAppointments.length - 2}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          <div className="text-center bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
          </div>
          <div className="space-y-2">
            {getAppointmentsForDay(selectedDate).map((appointment, idx) => {
              const typeConfig = getAppointmentTypeConfig(appointment.type);
              const IconComponent = typeConfig.icon;
              
              return (
                <div
                  key={idx}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{appointment.type}</h4>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(appointment.scheduledDate).toLocaleTimeString()}
                        </span>
                        {appointment.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {appointment.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {getAppointmentsForDay(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for this day
              </div>
            )}
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">
          {viewMode === 'day' ? 'Today\'s Appointments' : 'Upcoming Appointments'}
        </h3>
        
        {appointmentsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 10).map((appointment) => {
              const typeConfig = getAppointmentTypeConfig(appointment.type);
              const IconComponent = typeConfig.icon;
              
              return (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{appointment.type}</h4>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(appointment.scheduledDate).toLocaleString()}
                          </span>
                          {appointment.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {appointment.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {appointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Full-Featured Inbox Component for Agent Portal
function EmbeddedInbox() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const INQUIRY_TYPES = {
    contact: { label: 'Contact Form', icon: Mail, color: 'bg-blue-500' },
    property: { label: 'Property Inquiry', icon: Building, color: 'bg-green-500' },
    booking: { label: 'Tour Booking', icon: Calendar, color: 'bg-purple-500' },
    valuation: { label: 'Home Valuation', icon: DollarSign, color: 'bg-orange-500' },
    consultation: { label: 'Consultation', icon: Users, color: 'bg-pink-500' }
  };

  const PRIORITY_COLORS = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
    urgent: 'bg-red-500 text-white'
  };

  // Fetch all inquiries and requests
  const { data: propertyInquiries = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ['/api/property-inquiries'],
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  const { data: homeValuations = [] } = useQuery({
    queryKey: ['/api/home-valuations'],
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  // Process and combine all requests
  const allRequests = useMemo(() => {
    const requests = [];
    
    propertyInquiries.forEach(inquiry => {
      requests.push({
        id: inquiry.id,
        type: 'property',
        category: 'property',
        title: `Property Inquiry - ${inquiry.propertyTitle || 'Unknown Property'}`,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
        timestamp: inquiry.createdAt,
        status: inquiry.status || 'new',
        priority: inquiry.priority || 'medium',
        propertyId: inquiry.propertyId,
        leadId: inquiry.leadId
      });
    });

    homeValuations.forEach(valuation => {
      requests.push({
        id: valuation.id,
        type: 'valuation',
        category: 'valuation',
        title: `Home Valuation - ${valuation.address}`,
        name: valuation.contactName,
        email: valuation.email,
        phone: valuation.phone,
        message: `Property valuation request for ${valuation.address}. Property details: ${valuation.propertyDetails}`,
        timestamp: valuation.createdAt,
        status: valuation.status || 'pending',
        priority: 'high',
        address: valuation.address,
        estimatedValue: valuation.estimatedValue,
        propertyDetails: valuation.propertyDetails
      });
    });

    return requests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [propertyInquiries, homeValuations]);

  // Filter requests based on selected tab and search term
  const filteredRequests = useMemo(() => {
    let filtered = allRequests;

    if (selectedTab !== 'all') {
      filtered = filtered.filter(request => request.category === selectedTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allRequests, selectedTab, searchTerm]);

  // Get request counts for tabs
  const getRequestCount = (category: string) => {
    if (category === 'all') return allRequests.length;
    return allRequests.filter(r => r.category === category).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
  };

  const getTypeConfig = (type: string) => {
    return INQUIRY_TYPES[type] || INQUIRY_TYPES.contact;
  };

  // Update inquiry status
  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, type, updates }: { id: number; type: string; updates: any }) => {
      const endpoint = type === 'property' ? '/api/property-inquiries' : '/api/home-valuations';
      const response = await apiRequest(`${endpoint}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/property-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/home-valuations'] });
      toast({
        title: "Success!",
        description: "Request updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update request",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Customer Requests</h3>
          <p className="text-gray-600 mt-1">Manage all customer inquiries and requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredRequests.length} requests
          </Badge>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search requests by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <InboxIcon className="h-4 w-4" />
            All ({getRequestCount('all')})
          </TabsTrigger>
          <TabsTrigger value="property" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Property ({getRequestCount('property')})
          </TabsTrigger>
          <TabsTrigger value="valuation" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Valuations ({getRequestCount('valuation')})
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bookings ({getRequestCount('booking')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {inquiriesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const typeConfig = getTypeConfig(request.category);
                const IconComponent = typeConfig.icon;
                
                return (
                  <motion.div
                    key={`${request.type}-${request.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{request.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {request.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {request.email}
                            </span>
                            {request.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {request.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-700 line-clamp-2">{request.message}</p>
                      {request.type === 'valuation' && request.estimatedValue && (
                        <p className="text-sm text-green-600 mt-1">
                          Estimated Value: ${request.estimatedValue.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(request.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedInquiry(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsReplyOpen(true)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateInquiryMutation.mutate({
                            id: request.id,
                            type: request.type,
                            updates: { status: 'completed' }
                          })}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Done
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <InboxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchTerm ? 'No matching requests' : 'No requests found'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms' : 'New customer requests will appear here'}
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Request</DialogTitle>
            <p className="text-sm text-gray-600">Send a response to the customer request</p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reply-message">Message</Label>
              <Textarea
                id="reply-message"
                placeholder="Type your reply..."
                className="mt-1"
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Appointment Form Component
function AppointmentForm({ onSubmit, leads, properties, selectedDate, appointmentTypes }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'client_meeting',
    scheduledDate: selectedDate ? selectedDate.toISOString().slice(0, 16) : '',
    location: '',
    leadId: '',
    propertyId: '',
    status: 'scheduled'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      scheduledDate: new Date(formData.scheduledDate).toISOString(),
      leadId: formData.leadId && formData.leadId !== 'none' ? parseInt(formData.leadId) : null,
      propertyId: formData.propertyId && formData.propertyId !== 'none' ? parseInt(formData.propertyId) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Appointment title"
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Appointment details"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scheduledDate">Date & Time</Label>
          <Input
            id="scheduledDate"
            type="datetime-local"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Meeting location"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="leadId">Lead (Optional)</Label>
          <Select value={formData.leadId} onValueChange={(value) => setFormData({ ...formData, leadId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select lead" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No lead</SelectItem>
              {leads.map(lead => (
                <SelectItem key={lead.id} value={lead.id.toString()}>
                  {lead.firstName} {lead.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="propertyId">Property (Optional)</Label>
          <Select value={formData.propertyId} onValueChange={(value) => setFormData({ ...formData, propertyId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No property</SelectItem>
              {properties.map(property => (
                <SelectItem key={property.id} value={property.id.toString()}>
                  {property.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Appointment
        </Button>
      </div>
    </form>
  );
}