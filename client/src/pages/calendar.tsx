import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Video,
  Home,
  Building,
  Users,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Download
} from 'lucide-react';

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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appointments and related data
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
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
    mutationFn: (appointmentData: any) => apiRequest('/api/appointments', 'POST', appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setIsNewAppointmentOpen(false);
      toast({
        title: "Appointment Scheduled",
        description: "Your appointment has been successfully scheduled",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Schedule",
        description: "Unable to schedule appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update appointment mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiRequest(`/api/appointments/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Appointment Updated",
        description: "Changes saved successfully",
      });
    },
  });

  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/appointments/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Appointment Deleted",
        description: "Appointment has been removed from your calendar",
      });
    },
  });

  // Calendar calculations
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (days.length < 42) { // 6 weeks
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return { days, firstDay, lastDay };
  }, [currentDate]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesType = filterType === 'all' || appointment.type === filterType;
      const matchesSearch = searchTerm === '' || 
        appointment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [appointments, filterType, searchTerm]);

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.scheduledAt);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  // Get appointments for selected date
  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  // Utility functions
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAppointmentTypeConfig = (type: string) => {
    return APPOINTMENT_TYPES.find(t => t.value === type) || APPOINTMENT_TYPES[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
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
                <CalendarIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Appointment Calendar</h1>
                <p className="text-blue-200">Manage your Hawaii real estate schedule</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{appointments.length}</div>
                <div className="text-xs text-blue-200">Total Appointments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {appointments.filter(a => new Date(a.scheduledAt) >= new Date()).length}
                </div>
                <div className="text-xs text-blue-200">Upcoming</div>
              </div>
              <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                  </DialogHeader>
                  <AppointmentForm 
                    onSubmit={createAppointmentMutation.mutate}
                    leads={leads}
                    properties={properties}
                    selectedDate={selectedDate}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-2xl font-bold">
                      {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-48"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {APPOINTMENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {DAYS.map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarData.days.map((day, index) => {
                    const dayAppointments = getAppointmentsForDate(day);
                    const isSelected = day.toDateString() === selectedDate.toDateString();
                    const isTodayDate = isToday(day);
                    const isCurrentMonthDay = isCurrentMonth(day);
                    
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className={`
                          min-h-[100px] p-2 border cursor-pointer transition-all
                          ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}
                          ${isTodayDate ? 'bg-blue-50 border-blue-300' : ''}
                          ${!isCurrentMonthDay ? 'text-gray-400 bg-gray-50' : ''}
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`
                          text-sm font-medium mb-1
                          ${isTodayDate ? 'text-blue-600' : ''}
                          ${isSelected ? 'text-blue-600 font-bold' : ''}
                        `}>
                          {day.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 3).map((appointment, idx) => {
                            const typeConfig = getAppointmentTypeConfig(appointment.type);
                            return (
                              <div
                                key={idx}
                                className={`
                                  text-xs p-1 rounded text-white truncate
                                  ${typeConfig.color}
                                `}
                                title={`${appointment.title} - ${formatTime(appointment.scheduledAt)}`}
                              >
                                {formatTime(appointment.scheduledAt)} {appointment.title}
                              </div>
                            );
                          })}
                          {dayAppointments.length > 3 && (
                            <div className="text-xs text-gray-500 font-medium">
                              +{dayAppointments.length - 3} more
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  {formatDate(selectedDate)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : selectedDateAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No appointments scheduled</p>
                    <Button
                      size="sm"
                      onClick={() => setIsNewAppointmentOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateAppointments.map((appointment, index) => {
                      const typeConfig = getAppointmentTypeConfig(appointment.type);
                      const Icon = typeConfig.icon;
                      
                      return (
                        <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeConfig.color}`}>
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm">{appointment.title}</h4>
                                <p className="text-xs text-gray-500">{typeConfig.label}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                onClick={() => deleteAppointmentMutation.mutate(appointment.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(appointment.scheduledAt)}
                            </div>
                            {appointment.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {appointment.location}
                              </div>
                            )}
                          </div>
                          
                          {appointment.notes && (
                            <p className="text-xs text-gray-500 mt-2 italic">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Today's Appointments</span>
                    <span className="font-semibold">
                      {getAppointmentsForDate(new Date()).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Week</span>
                    <span className="font-semibold">
                      {appointments.filter(a => {
                        const appointmentDate = new Date(a.scheduledAt);
                        const weekStart = new Date();
                        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                        const weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekStart.getDate() + 6);
                        return appointmentDate >= weekStart && appointmentDate <= weekEnd;
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Property Showings</span>
                    <span className="font-semibold">
                      {appointments.filter(a => a.type === 'property_showing').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Client Meetings</span>
                    <span className="font-semibold">
                      {appointments.filter(a => a.type === 'client_meeting').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Types Legend */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm">Appointment Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {APPOINTMENT_TYPES.map(type => {
                    const Icon = type.icon;
                    const count = appointments.filter(a => a.type === type.value).length;
                    return (
                      <div key={type.value} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${type.color}`}></div>
                          <span className="text-xs">{type.label}</span>
                        </div>
                        <span className="text-xs font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Appointment Form Component
function AppointmentForm({ 
  onSubmit, 
  leads, 
  properties, 
  selectedDate,
  appointment = null 
}: { 
  onSubmit: (data: any) => void;
  leads: any[];
  properties: any[];
  selectedDate: Date;
  appointment?: any;
}) {
  const [formData, setFormData] = useState({
    title: appointment?.title || '',
    type: appointment?.type || 'client_meeting',
    scheduledAt: appointment?.scheduledAt || selectedDate.toISOString().slice(0, 16),
    duration: appointment?.duration || 60,
    location: appointment?.location || '',
    leadId: appointment?.leadId || '',
    propertyId: appointment?.propertyId || '',
    notes: appointment?.notes || '',
    status: appointment?.status || 'scheduled'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      leadId: formData.leadId ? parseInt(formData.leadId) : null,
      propertyId: formData.propertyId ? parseInt(formData.propertyId) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="text-sm font-semibold">Appointment Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Property showing at Lanikai Beach"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="type" className="text-sm font-semibold">Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APPOINTMENT_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scheduledAt" className="text-sm font-semibold">Date & Time *</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="duration" className="text-sm font-semibold">Duration (minutes)</Label>
          <Select value={formData.duration.toString()} onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="180">3 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location" className="text-sm font-semibold">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g. 123 Kalakaua Ave, Honolulu, HI"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="leadId" className="text-sm font-semibold">Associated Lead</Label>
          <Select value={formData.leadId} onValueChange={(value) => setFormData({ ...formData, leadId: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a lead (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No lead selected</SelectItem>
              {leads.map(lead => (
                <SelectItem key={lead.id} value={lead.id.toString()}>
                  {lead.firstName} {lead.lastName} - {lead.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="propertyId" className="text-sm font-semibold">Associated Property</Label>
          <Select value={formData.propertyId} onValueChange={(value) => setFormData({ ...formData, propertyId: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a property (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No property selected</SelectItem>
              {properties.slice(0, 10).map(property => (
                <SelectItem key={property.id} value={property.id.toString()}>
                  {property.title} - {property.city}
                </SelectItem>
              ))}
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
          placeholder="Any additional details about this appointment..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {appointment ? 'Update' : 'Schedule'} Appointment
        </Button>
      </div>
    </form>
  );
}