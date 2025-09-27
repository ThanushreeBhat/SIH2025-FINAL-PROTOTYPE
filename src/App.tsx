import image_c15de9ce4bcecc2f31e02b23f8576a641ab591f5 from 'figma:asset/c15de9ce4bcecc2f31e02b23f8576a641ab591f5.png';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Leaf, Users, Truck, Home, Calendar, BookOpen, ShoppingCart, User, Award, MapPin, Clock, Download, LogOut, BarChart3, Package, Settings, Bell, Plus, Edit, Trash2, Send, Filter, Factory } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// Types
interface User {
  userId: string;
  name: string;
  email: string;
  points: number;
  role: 'citizen' | 'green-champion' | 'processing-plant' | null;
  completedModules: string[];
  certificates: Certificate[];
  attendedEvents: string[];
  reportedImageHashes: string[];
}

interface Certificate {
  id: string;
  moduleId: string;
  moduleName: string;
  issuedDate: string;
  recipientName: string;
}

interface Module {
  id: string;
  title: string;
  points: number;
  image: string;
  description: string;
  certificateName: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  points: number;
  image: string;
  description: string;
}

interface MarketplaceItem {
  id: string;
  name: string;
  cost: number;
  image: string;
  description: string;
}

interface Schedule {
  id: string;
  area: string;
  date: string;
  time: string;
}

interface Report {
  reporterId: string;
  status: 'pending' | 'resolved';
  timestamp: string;
  location?: string;
}

interface Statistics {
  peopleTrained: number;
  shgTrained: number;
  garbageCollected: number;
  eventsOrganized: number;
  reportsResolved: number;
}

interface Order {
  id: string;
  citizenId: string;
  citizenName: string;
  item: string;
  pointsUsed: number;
  status: 'pending' | 'shipped' | 'delivered';
  date: string;
}

interface GarbageType {
  id: string;
  name: string;
  size: 'small' | 'medium' | 'large';
  weight: string;
  zone: string;
  collectionDate: string;
  plantDestination: string;
  status: 'scheduled' | 'collected' | 'in-transit' | 'delivered';
}

interface PlantNotification {
  id: string;
  plantId: string;
  garbageTypes: GarbageType[];
  expectedDate: string;
  totalWeight: string;
  status: 'sent' | 'acknowledged';
}

// Data
const gamifiedModules: Module[] = [
  {
    id: 'm1',
    title: 'Waste Segregation 101',
    points: 100,
    image: 'https://images.unsplash.com/photo-1678380948471-1daf95e9c9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMHJlY3ljbGluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTg4NjI3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Learn the basics of proper waste segregation',
    certificateName: 'Waste Segregation Specialist'
  },
  {
    id: 'm2',
    title: 'Composting Basics',
    points: 150,
    image: 'https://images.unsplash.com/photo-1716903282677-3a1b5c936b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0aW5nJTIwdHV0b3JpYWx8ZW58MXx8fHwxNzU4ODYyNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Master the art of home composting',
    certificateName: 'Certified Composting Expert'
  },
  {
    id: 'm3',
    title: 'Upcycling Fun',
    points: 200,
    image: 'https://images.unsplash.com/photo-1568536173914-29d586b2124c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cGN5Y2xpbmclMjBjcmFmdCUyMHByb2plY3RzfGVufDF8fHx8MTc1ODg2MjcyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Creative projects with recycled materials',
    certificateName: 'Upcycling Innovation Certificate'
  }
];

const demoEvents: Event[] = [
  {
    id: 'e1',
    name: 'Beach Clean-up Drive',
    date: 'Oct 15, 2025',
    location: 'Marina Beach',
    points: 300,
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGNsZWFudXAlMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc1ODgyNjMwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Join us for a community beach cleanup event'
  },
  {
    id: 'e2',
    name: 'Neighborhood Tree Planting',
    date: 'Nov 5, 2025',
    location: 'Central Park',
    points: 250,
    image: 'https://images.unsplash.com/photo-1758599668356-c8c919e24dda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjBjb21tdW5pdHl8ZW58MXx8fHwxNzU4ODYyNzMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Help us plant trees and beautify our neighborhood'
  }
];

const marketplaceItems: MarketplaceItem[] = [
  {
    id: 'mp1',
    name: 'Eco-friendly Jute Bag',
    cost: 500,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsGGaW9D9nRh_HJlIOJaXPdOTNRxv7uHXDyA&s',
    description: 'Sustainable jute shopping bag'
  },
  {
    id: 'mp2',
    name: 'Home Compost Kit',
    cost: 1200,
    image: 'https://m.media-amazon.com/images/I/812BeY831oL.jpg',
    description: 'Complete kit for home composting'
  },
  {
    id: 'mp3',
    name: 'Recycled Plastic Bin',
    cost: 800,
    image: 'https://ozwashroom.com.au/cdn/shop/files/rb15rg.jpg?v=1727280039',
    description: 'Durable waste bin made from recycled plastic'
  }
];

const demoSchedules: Schedule[] = [
  { id: 's1', area: 'Zone A', date: 'Monday', time: '8:00 AM' },
  { id: 's2', area: 'Zone B', date: 'Wednesday', time: '8:00 AM' },
  { id: 's3', area: 'Zone C', date: 'Friday', time: '8:00 AM' },
  { id: 's4', area: 'Zone D', date: 'Sunday', time: '8:00 AM' }
];

const plantSchedules: Schedule[] = [
  { id: 'ps1', area: 'Zone A', date: 'Tuesday', time: '8:00 AM' },
  { id: 'ps2', area: 'Zone B', date: 'Thursday', time: '8:00 AM' },
  { id: 'ps3', area: 'Zone C', date: 'Saturday', time: '8:00 AM' },
  { id: 'ps4', area: 'Zone D', date: 'Monday', time: '8:00 AM' }
];

const demoReports: Report[] = [
  { reporterId: 'citizen-demo-user-a', status: 'pending', timestamp: '2025-09-22', location: 'Downtown Area' },
  { reporterId: 'citizen-demo-user-b', status: 'pending', timestamp: '2025-09-21', location: 'Park Street' },
  { reporterId: 'citizen-demo-user-c', status: 'resolved', timestamp: '2025-09-20', location: 'Market Square' }
];

const championStats: Statistics = {
  peopleTrained: 1240,
  shgTrained: 85,
  garbageCollected: 89,
  eventsOrganized: 23,
  reportsResolved: 156
};

const demoOrders: Order[] = [
  { id: 'ord1', citizenId: 'cit001', citizenName: 'John Doe', item: 'Eco-friendly Jute Bag', pointsUsed: 500, status: 'pending', date: '2025-09-25' },
  { id: 'ord2', citizenId: 'cit002', citizenName: 'Jane Smith', item: 'Home Compost Kit', pointsUsed: 1200, status: 'shipped', date: '2025-09-24' },
  { id: 'ord3', citizenId: 'cit003', citizenName: 'Mike Johnson', item: 'Recycled Plastic Bin', pointsUsed: 800, status: 'delivered', date: '2025-09-23' }
];

const garbageTypes: GarbageType[] = [
  { id: 'gt1', name: 'Organic Waste', size: 'large', weight: '150kg', zone: 'Zone A', collectionDate: '2025-09-26', plantDestination: 'Compost Plant A', status: 'scheduled' },
  { id: 'gt2', name: 'Plastic Waste', size: 'medium', weight: '80kg', zone: 'Zone B', collectionDate: '2025-09-27', plantDestination: 'Recycling Plant B', status: 'collected' },
  { id: 'gt3', name: 'Metal Waste', size: 'small', weight: '45kg', zone: 'Zone C', collectionDate: '2025-09-28', plantDestination: 'Metal Recovery Plant', status: 'in-transit' }
];

// Hash function for file deduplication
const hashFile = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export default function App() {
  const [user, setUser] = useState<User>({
    userId: '',
    name: '',
    email: '',
    points: 0,
    role: null,
    completedModules: [],
    certificates: [],
    attendedEvents: [],
    reportedImageHashes: []
  });

  const [currentPage, setCurrentPage] = useState<string>('login');
  const [loginForm, setLoginForm] = useState({
    name: '',
    email: '',
    role: '' as 'citizen' | 'green-champion' | 'processing-plant' | ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [schedules, setSchedules] = useState<Schedule[]>(demoSchedules);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [garbage, setGarbage] = useState<GarbageType[]>(garbageTypes);
  const [championPage, setChampionPage] = useState<string>('dashboard');

  const handleLogin = () => {
    if (!loginForm.name || !loginForm.email || !loginForm.role) {
      toast.error('Please fill in all fields');
      return;
    }

    const userId = `${loginForm.role}-${Date.now()}`;
    setUser({
      userId,
      name: loginForm.name,
      email: loginForm.email,
      points: 0,
      role: loginForm.role as User['role'],
      completedModules: [],
      certificates: [],
      attendedEvents: [],
      reportedImageHashes: []
    });
    setCurrentPage('home');
    toast.success(`Welcome ${loginForm.name}! Logged in as ${loginForm.role.replace('-', ' ')}`);
  };

  const handleLogout = () => {
    setUser({
      userId: '',
      name: '',
      email: '',
      points: 0,
      role: null,
      completedModules: [],
      certificates: [],
      attendedEvents: [],
      reportedImageHashes: []
    });
    setLoginForm({
      name: '',
      email: '',
      role: ''
    });
    setCurrentPage('login');
    toast.success('Successfully logged out!');
  };

  const reportDump = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select an image to report.');
      return;
    }

    try {
      const hash = await hashFile(file);
      if (user.reportedImageHashes.includes(hash)) {
        toast.warning('This image has already been reported. Thank you for your vigilance!');
        return;
      }

      setUser(prev => ({
        ...prev,
        reportedImageHashes: [...prev.reportedImageHashes, hash]
      }));
      toast.success('Illegal dumping reported successfully!');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Error processing image. Please try again.');
    }
  };

  const completeModule = (moduleId: string, points: number) => {
    if (user.completedModules.includes(moduleId)) {
      toast.warning('You have already completed this module.');
      return;
    }

    const module = gamifiedModules.find(m => m.id === moduleId);
    if (!module) return;

    const certificate: Certificate = {
      id: `cert-${moduleId}-${Date.now()}`,
      moduleId,
      moduleName: module.title,
      issuedDate: new Date().toLocaleDateString(),
      recipientName: user.name
    };

    setUser(prev => ({
      ...prev,
      points: prev.points + points,
      completedModules: [...prev.completedModules, moduleId],
      certificates: [...prev.certificates, certificate]
    }));
    toast.success(`Training completed! Certificate earned: ${module.certificateName}`);
  };

  const downloadCertificate = (certificate: Certificate) => {
    // Create a simple text certificate for demo purposes
    const certificateText = `
CERTIFICATE OF COMPLETION

This certifies that

${certificate.recipientName}

has successfully completed the training module

${certificate.moduleName}

Issued on: ${certificate.issuedDate}
Certificate ID: ${certificate.id}

Eco-Sustain Platform
Environmental Training Certification
    `;

    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificate.moduleName.replace(/\s+/g, '_')}_Certificate.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Certificate downloaded successfully!');
  };

  const joinEvent = (eventId: string, points: number) => {
    if (user.attendedEvents.includes(eventId)) {
      toast.warning('You have already joined this event.');
      return;
    }

    setUser(prev => ({
      ...prev,
      points: prev.points + points,
      attendedEvents: [...prev.attendedEvents, eventId]
    }));
    toast.success(`Event joined! You earned ${points} points.`);
  };

  const buyItem = (cost: number, itemName: string) => {
    if (user.points < cost) {
      toast.error('Not enough points to purchase this item.');
      return;
    }

    setUser(prev => ({
      ...prev,
      points: prev.points - cost
    }));
    toast.success(`${itemName} purchased successfully!`);
  };

  const updateSchedule = (scheduleId: string, newDate: string, newTime: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, date: newDate, time: newTime }
        : schedule
    ));
    toast.success('Schedule updated successfully!');
  };

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'shipped' | 'delivered') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    toast.success('Order status updated!');
  };

  const sendNotificationToPlant = (garbageItems: GarbageType[]) => {
    const notification: PlantNotification = {
      id: `notif-${Date.now()}`,
      plantId: garbageItems[0].plantDestination,
      garbageTypes: garbageItems,
      expectedDate: garbageItems[0].collectionDate,
      totalWeight: garbageItems.reduce((sum, item) => sum + parseInt(item.weight), 0) + 'kg',
      status: 'sent'
    };
    toast.success(`Notification sent to ${garbageItems[0].plantDestination}`);
  };

  const organizeEvent = (eventName: string, eventDate: string, eventLocation: string) => {
    const newEvent: Event = {
      id: `e-${Date.now()}`,
      name: eventName,
      date: eventDate,
      location: eventLocation,
      points: 300,
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGNsZWFudXAlMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc1ODgyNjMwNXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Community environmental event organized by Green Champion'
    };
    toast.success(`Event "${eventName}" organized successfully!`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'citizen': return <Users className="h-6 w-6 text-white" />;
      case 'green-champion': return <Leaf className="h-6 w-6 text-white" />;
      case 'processing-plant': return <Factory className="h-6 w-6 text-white" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600 text-yellow-100';
      case 'shipped': case 'collected': return 'bg-blue-600 text-blue-100';
      case 'delivered': case 'resolved': return 'bg-green-600 text-green-100';
      case 'in-transit': return 'bg-purple-600 text-purple-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  // Login Page Component
  const LoginPage = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Welcome to Eco-Sustain
          </CardTitle>
          <CardDescription>
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={loginForm.name}
              onChange={(e) => setLoginForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={loginForm.email}
              onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Select Your Role</Label>
            <Select value={loginForm.role} onValueChange={(value) => setLoginForm(prev => ({ ...prev, role: value as any }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citizen">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Citizen
                  </div>
                </SelectItem>
                <SelectItem value="green-champion">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Green Champion
                  </div>
                </SelectItem>
                <SelectItem value="processing-plant">
                  <div className="flex items-center gap-2">
                    <Factory className="h-4 w-4" />
                    Processing Plant
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handleLogin}
              className="w-full h-12 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Login to Eco-Sustain
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Citizen Dashboard Component
  const CitizenDashboard = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Tabs value={currentPage} onValueChange={setCurrentPage} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-6">
          {/* Report Dumping Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Report Illegal Dumping
              </CardTitle>
              <CardDescription>
                Help keep our environment clean by reporting illegal waste dumping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:bg-gray-800 transition-colors cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <h4>Drop photo here or click to browse</h4>
                <p className="text-muted-foreground mt-2">GPS location will be automatically captured</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={reportDump}
                />
              </div>
            </CardContent>
          </Card>

          {/* Collection Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Collection Schedule</CardTitle>
              <CardDescription>
                View upcoming waste collection times for your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoSchedules.map((schedule) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{schedule.area}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {schedule.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        {schedule.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Join community events and earn points while making a difference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {demoEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <ImageWithFallback
                      src={event.image}
                      alt={event.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{event.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-green-900 text-green-300">
                          <Award className="h-3 w-3 mr-1" />
                          {event.points} points
                        </Badge>
                        <Button
                          onClick={() => joinEvent(event.id, event.points)}
                          disabled={user.attendedEvents.includes(event.id)}
                          size="sm"
                        >
                          {user.attendedEvents.includes(event.id) ? 'Joined' : 'Join Event'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Training & Certification</CardTitle>
              <CardDescription>
                Complete training modules to earn certificates and points for environmental sustainability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {gamifiedModules.map((module) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <ImageWithFallback
                      src={module.image}
                      alt={module.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-green-900 text-green-300">
                            <Award className="h-3 w-3 mr-1" />
                            {module.points} points
                          </Badge>
                          <Button
                            onClick={() => completeModule(module.id, module.points)}
                            disabled={user.completedModules.includes(module.id)}
                            size="sm"
                          >
                            {user.completedModules.includes(module.id) ? 'Completed' : 'Start Training'}
                          </Button>
                        </div>
                        {user.completedModules.includes(module.id) && (
                          <div className="text-center">
                            <Badge className="bg-blue-900 text-blue-300">
                              <Award className="h-3 w-3 mr-1" />
                              {module.certificateName}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eco Marketplace</CardTitle>
              <CardDescription>
                Redeem your points for sustainable products and eco-friendly items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {marketplaceItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-lg overflow-hidden flex flex-col h-full"
                  >
                    <div className="h-48 overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-grow">{item.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {item.cost} points
                        </Badge>
                        <Button
                          onClick={() => buyItem(item.cost, item.name)}
                          disabled={user.points < item.cost}
                          size="sm"
                        >
                          {user.points < item.cost ? 'Insufficient Points' : 'Buy Now'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email} • {user.role?.replace('-', ' ').toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm break-all">{user.userId}</p>
                </div>
                <div className="text-center p-4 bg-green-900/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Reward Points</p>
                  <p className="text-3xl font-bold text-green-400">{user.points}</p>
                </div>
                <div className="text-center p-4 bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Certificates Earned</p>
                  <p className="text-3xl font-bold text-blue-400">{user.certificates.length}</p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                  <p className="text-2xl font-semibold">{user.completedModules.length}</p>
                  <p className="text-sm text-muted-foreground">Training Completed</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-400" />
                  <p className="text-2xl font-semibold">{user.attendedEvents.length}</p>
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-red-400" />
                  <p className="text-2xl font-semibold">{user.reportedImageHashes.length}</p>
                  <p className="text-sm text-muted-foreground">Reports Submitted</p>
                </div>
              </div>

              {/* Certificates Section */}
              {user.certificates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Your Certificates
                    </CardTitle>
                    <CardDescription>
                      Download and view your training certificates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {user.certificates.map((certificate) => (
                        <motion.div
                          key={certificate.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{certificate.moduleName}</h4>
                              <p className="text-sm text-muted-foreground">Issued: {certificate.issuedDate}</p>
                              <p className="text-xs text-muted-foreground mt-1">ID: {certificate.id}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadCertificate(certificate)}
                              className="ml-2"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );

  // Green Champion Dashboard
  const GreenChampionDashboard = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Tabs value={championPage} onValueChange={setChampionPage} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="garbage" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Garbage
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistics Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold">{championStats.peopleTrained}</p>
                <p className="text-sm text-muted-foreground">People Trained</p>
                <div className="mt-2 text-green-400 text-sm">↗ 85%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold">{championStats.shgTrained}</p>
                <p className="text-sm text-muted-foreground">SHG Trained</p>
                <div className="mt-2 text-green-400 text-sm">↗ 92%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <p className="text-2xl font-bold">{championStats.garbageCollected}%</p>
                <p className="text-sm text-muted-foreground">Garbage Collected</p>
                <div className="mt-2 text-green-400 text-sm">↗ 89%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-400" />
                <p className="text-2xl font-bold">{championStats.eventsOrganized}</p>
                <p className="text-sm text-muted-foreground">Events Organized</p>
                <div className="mt-2 text-green-400 text-sm">↗ 76%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Bell className="h-8 w-8 mx-auto mb-2 text-red-400" />
                <p className="text-2xl font-bold">{championStats.reportsResolved}</p>
                <p className="text-sm text-muted-foreground">Reports Resolved</p>
                <div className="mt-2 text-green-400 text-sm">↗ 94%</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button className="h-20 flex flex-col gap-2" onClick={() => setChampionPage('schedules')}>
                  <Settings className="h-6 w-6" />
                  Manage Schedules
                </Button>
                <Button className="h-20 flex flex-col gap-2" onClick={() => setChampionPage('events')}>
                  <Plus className="h-6 w-6" />
                  Organize Event
                </Button>
                <Button className="h-20 flex flex-col gap-2" onClick={() => setChampionPage('garbage')}>
                  <Send className="h-6 w-6" />
                  Send to Processing Plant
                </Button>
                <Button className="h-20 flex flex-col gap-2" onClick={() => setChampionPage('orders')}>
                  <Package className="h-6 w-6" />
                  View Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Citizen Orders from Marketplace
              </CardTitle>
              <CardDescription>
                Manage and track orders placed by citizens using their points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{order.item}</h4>
                        <p className="text-sm text-muted-foreground">Customer: {order.citizenName}</p>
                        <p className="text-sm text-muted-foreground">Points Used: {order.pointsUsed}</p>
                        <p className="text-sm text-muted-foreground">Date: {order.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value as any)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Garbage Collection Schedule Management
              </CardTitle>
              <CardDescription>
                Update collection timelines for different zones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{schedule.area}</h4>
                        <p className="text-sm text-muted-foreground">Current: {schedule.date} at {schedule.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={schedule.date} onValueChange={(value) => updateSchedule(schedule.id, value, schedule.time)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue={schedule.time} onValueChange={(value) => updateSchedule(schedule.id, schedule.date, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                            <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                            <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                            <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                            <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                            <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Organization
              </CardTitle>
              <CardDescription>
                Create and manage environmental awareness events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input id="eventName" placeholder="Enter event name" />
                  </div>
                  <div>
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input id="eventDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="eventLocation">Location</Label>
                    <Input id="eventLocation" placeholder="Enter event location" />
                  </div>
                  <Button 
                    onClick={() => {
                      const name = (document.getElementById('eventName') as HTMLInputElement)?.value;
                      const date = (document.getElementById('eventDate') as HTMLInputElement)?.value;
                      const location = (document.getElementById('eventLocation') as HTMLInputElement)?.value;
                      if (name && date && location) {
                        organizeEvent(name, date, location);
                      }
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Organize Event
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Upcoming Events</h4>
                  {demoEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <h5 className="font-medium">{event.name}</h5>
                      <p className="text-sm text-muted-foreground">{event.date} - {event.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="garbage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Garbage Management & Processing Plant Coordination
              </CardTitle>
              <CardDescription>
                Manage garbage types, sizes, and send notifications to processing plants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {garbage.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-muted-foreground">
                          <span>Size: {item.size}</span>
                          <span>Weight: {item.weight}</span>
                          <span>Zone: {item.zone}</span>
                          <span>Collection: {item.collectionDate}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Destination: {item.plantDestination}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => sendNotificationToPlant([item])}
                          disabled={item.status === 'delivered'}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Notify Processing Plant
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Citizen Reports Management
              </CardTitle>
              <CardDescription>
                Monitor and manage reports submitted by citizens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoReports.map((report, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      report.status === 'pending' ? 'bg-yellow-900/20 border-yellow-600' : 'bg-green-900/20 border-green-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Report from: {report.reporterId.substring(0, 12)}...</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {report.location}
                        </p>
                        <p className="text-sm text-muted-foreground">{report.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={report.status === 'pending' ? 'destructive' : 'default'}
                          className={report.status === 'pending' ? 'bg-yellow-600 text-yellow-100' : 'bg-green-600 text-green-100'}
                        >
                          {report.status}
                        </Badge>
                        {report.status === 'pending' && (
                          <Button size="sm" onClick={() => toast.success('Report marked as resolved!')}>
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );

  // Plant Dashboard
  const PlantDashboard = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Processing Plant Dashboard
          </CardTitle>
          <CardDescription>
            View daily and weekly waste collection routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {plantSchedules.map((schedule) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-semibold">{schedule.area}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {schedule.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    {schedule.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Eco-Sustain
          </h1>
          <p className="text-muted-foreground">A platform for a cleaner, greener planet</p>
          {user.role && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 flex flex-col items-center gap-3"
            >
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {getRoleIcon(user.role)}
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {user.role.replace('-', ' ').toUpperCase()}
                </Badge>
                {user.role === 'citizen' && (
                  <div className="flex gap-2">
                    <Badge className="bg-green-900/50 text-green-300 text-lg px-3 py-1">
                      {user.points} Points
                    </Badge>
                    <Badge className="bg-blue-900/50 text-blue-300 text-lg px-3 py-1">
                      <Award className="h-4 w-4 mr-1" />
                      {user.certificates.length} Certificates
                    </Badge>
                  </div>
                )}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="bg-red-900/20 border-red-600 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!user.role && <LoginPage />}
          {user.role === 'citizen' && <CitizenDashboard />}
          {user.role === 'green-champion' && <GreenChampionDashboard />}
          {user.role === 'processing-plant' && <PlantDashboard />}
        </AnimatePresence>
      </div>
    </div>
  );
}