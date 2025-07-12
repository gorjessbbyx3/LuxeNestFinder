import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Inbox as InboxIcon,
  Mail,
  Home,
  Calendar,
  User,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Reply,
  Forward,
  Archive,
  Star,
  StarOff,
  Filter,
  Search,
  MoreVertical,
  Building,
  DollarSign,
  Eye,
  MessageSquare,
  Users
} from 'lucide-react';

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

export default function InboxPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all inquiries and requests
  const { data: propertyInquiries = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ['/api/property-inquiries'],
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  const { data: homeValuations = [] } = useQuery({
    queryKey: ['/api/home-valuations'],
    staleTime: 60 * 1000,
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments'],
    staleTime: 60 * 1000,
  });

  // Combine all requests into unified inbox
  const allRequests = useMemo(() => {
    const requests = [];

    // Property inquiries
    propertyInquiries.forEach(inquiry => {
      requests.push({
        id: `inquiry-${inquiry.id}`,
        type: 'property',
        title: `Property Inquiry - ${inquiry.propertyTitle || 'Unknown Property'}`,
        message: inquiry.message,
        email: inquiry.email,
        phone: inquiry.phone,
        name: inquiry.name,
        timestamp: inquiry.createdAt,
        status: inquiry.status || 'new',
        priority: inquiry.priority || 'medium',
        propertyId: inquiry.propertyId,
        isStarred: inquiry.isStarred || false,
        originalData: inquiry
      });
    });

    // Home valuations
    homeValuations.forEach(valuation => {
      requests.push({
        id: `valuation-${valuation.id}`,
        type: 'valuation',
        title: `Home Valuation Request - ${valuation.address}`,
        message: `Property details: ${valuation.bedrooms} bed, ${valuation.bathrooms} bath, ${valuation.squareFootage} sq ft`,
        email: valuation.email,
        phone: valuation.phone,
        name: valuation.contactName,
        timestamp: valuation.createdAt,
        status: valuation.status || 'pending',
        priority: 'high',
        address: valuation.address,
        estimatedValue: valuation.estimatedValue,
        isStarred: false,
        originalData: valuation
      });
    });

    // Appointment bookings
    appointments.forEach(appointment => {
      requests.push({
        id: `booking-${appointment.id}`,
        type: 'booking',
        title: `${appointment.type.replace('_', ' ')} Booking - ${appointment.title}`,
        message: appointment.notes || 'No additional notes provided',
        email: appointment.leadEmail || 'No email provided',
        phone: appointment.leadPhone || 'No phone provided',
        name: appointment.leadName || 'Anonymous',
        timestamp: appointment.createdAt,
        status: appointment.status,
        priority: appointment.status === 'scheduled' ? 'high' : 'medium',
        scheduledAt: appointment.scheduledAt,
        location: appointment.location,
        isStarred: false,
        originalData: appointment
      });
    });

    return requests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [propertyInquiries, homeValuations, appointments]);

  // Filter requests based on tab and search
  const filteredRequests = useMemo(() => {
    let filtered = allRequests;

    if (selectedTab !== 'all') {
      filtered = filtered.filter(request => request.type === selectedTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allRequests, selectedTab, searchTerm]);

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ type, id, status }: { type: string, id: string, status: string }) => {
      const endpoint = type === 'property' ? '/api/property-inquiries' : 
                     type === 'valuation' ? '/api/home-valuations' : '/api/appointments';
      return apiRequest(`${endpoint}/${id.split('-')[1]}`, 'PATCH', { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/property-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/home-valuations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Status Updated",
        description: "Request status has been updated successfully",
      });
    },
  });

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeConfig = (type: string) => {
    return INQUIRY_TYPES[type] || INQUIRY_TYPES.contact;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUnreadCount = (type: string) => {
    const filtered = type === 'all' ? allRequests : allRequests.filter(r => r.type === type);
    return filtered.filter(r => r.status === 'new').length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white pt-20 pb-8">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <InboxIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Inbox & Requests</h1>
                <p className="text-blue-200">Manage all customer inquiries and requests</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{allRequests.length}</div>
                <div className="text-xs text-blue-200">Total Requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {allRequests.filter(r => r.status === 'new').length}
                </div>
                <div className="text-xs text-blue-200">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {allRequests.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-xs text-blue-200">Resolved</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Inbox Navigation */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <InboxIcon className="h-5 w-5 text-blue-600" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedTab === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-between"
                  onClick={() => setSelectedTab('all')}
                >
                  <span>All Requests</span>
                  <Badge variant="secondary">{allRequests.length}</Badge>
                </Button>
                
                {Object.entries(INQUIRY_TYPES).map(([type, config]) => {
                  const Icon = config.icon;
                  const count = allRequests.filter(r => r.type === type).length;
                  const unread = getUnreadCount(type);
                  
                  return (
                    <Button
                      key={type}
                      variant={selectedTab === type ? 'default' : 'ghost'}
                      className="w-full justify-between"
                      onClick={() => setSelectedTab(type)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{config.label}</span>
                      </div>
                      <div className="flex gap-1">
                        {unread > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {unread}
                          </Badge>
                        )}
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Request List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {selectedTab === 'all' ? 'All Requests' : INQUIRY_TYPES[selectedTab]?.label}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <InboxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No requests found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms' : 'All caught up! No pending requests.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-auto">
                    {filteredRequests.map((request, index) => {
                      const typeConfig = getTypeConfig(request.type);
                      const Icon = typeConfig.icon;
                      
                      return (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`
                            border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                            ${selectedInquiry?.id === request.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
                            ${request.status === 'new' ? 'border-l-4 border-l-blue-500' : ''}
                          `}
                          onClick={() => setSelectedInquiry(request)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig.color}`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm truncate">{request.title}</h4>
                                  {request.status === 'new' && (
                                    <Badge variant="destructive" className="text-xs">New</Badge>
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-600 truncate mb-2">
                                  From: {request.name} • {request.email}
                                </p>
                                
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {request.message}
                                </p>
                                
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(request.timestamp)}
                                  </span>
                                  <Badge className={getStatusColor(request.status)}>
                                    {request.status.replace('_', ' ')}
                                  </Badge>
                                  <Badge className={PRIORITY_COLORS[request.priority]}>
                                    {request.priority}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Toggle starred status
                                }}
                              >
                                {request.isStarred ? (
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                ) : (
                                  <StarOff className="h-3 w-3 text-gray-400" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Request Details */}
          <div className="lg:col-span-1">
            {selectedInquiry ? (
              <Card className="shadow-lg sticky top-8">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex-1">Request Details</CardTitle>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{selectedInquiry.title}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{selectedInquiry.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedInquiry.email}</span>
                      </div>
                      {selectedInquiry.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedInquiry.phone}</span>
                        </div>
                      )}
                      {selectedInquiry.scheduledAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(selectedInquiry.scheduledAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedInquiry.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{selectedInquiry.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Message</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedInquiry.message}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Status</h4>
                    <div className="space-y-2">
                      <Badge className={getStatusColor(selectedInquiry.status)}>
                        {selectedInquiry.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={PRIORITY_COLORS[selectedInquiry.priority]}>
                        {selectedInquiry.priority} priority
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => setIsReplyOpen(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        updateStatusMutation.mutate({
                          type: selectedInquiry.type,
                          id: selectedInquiry.id,
                          status: selectedInquiry.status === 'new' ? 'in_progress' : 'completed'
                        });
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as {selectedInquiry.status === 'new' ? 'In Progress' : 'Completed'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="text-center py-12">
                  <InboxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Request</h3>
                  <p className="text-gray-500">Choose a request from the list to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedInquiry?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                defaultValue={`Re: ${selectedInquiry?.title}`}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your reply here..."
                rows={6}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
                Cancel
              </Button>
              <Button>
                <Reply className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}