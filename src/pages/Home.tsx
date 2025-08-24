import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  ClipboardCheck, 
  FileText, 
  TrendingUp,
  Calendar,
  Bell,
  BookOpen,
  Award,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Home = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickStats = [
    { title: 'Total Students', value: '32', icon: Users, color: 'text-blue-600' },
    { title: 'Present Today', value: '28', icon: ClipboardCheck, color: 'text-green-600' },
    { title: 'Assignments Due', value: '5', icon: FileText, color: 'text-orange-600' },
    { title: 'Class Average', value: '87%', icon: TrendingUp, color: 'text-purple-600' },
  ];

  const quickActions = [
    { title: 'Take Attendance', description: 'Mark daily attendance', icon: ClipboardCheck, path: '/attendance', variant: 'primary' as const },
    { title: 'Manage Students', description: 'Add, edit, or view students', icon: Users, path: '/students', variant: 'secondary' as const },
    { title: 'New Assignment', description: 'Create homework or tasks', icon: FileText, path: '/assignments', variant: 'accent' as const },
    { title: 'View Reports', description: 'Generate progress reports', icon: BarChart3, path: '/reports', variant: 'outline' as const },
  ];

  const recentActivities = [
    { action: 'Attendance taken for Class 5A', time: '2 hours ago', icon: ClipboardCheck },
    { action: 'Math assignment graded', time: '4 hours ago', icon: BookOpen },
    { action: 'Student John Doe added', time: '1 day ago', icon: Users },
    { action: 'Monthly report generated', time: '2 days ago', icon: Award },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, Teacher! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to manage your classroom efficiently
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-2xl font-semibold text-primary">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-muted-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-soft border-0 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-2xl bg-muted", stat.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.title} 
                className="shadow-soft border-0 hover:shadow-medium transition-all duration-200 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-primary/10">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <Button variant={action.variant} size="sm" className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-muted/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent/10">
                <div>
                  <p className="font-medium text-foreground">Math Class - 5A</p>
                  <p className="text-sm text-muted-foreground">09:00 - 10:00 AM</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-accent"></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">English Class - 6B</p>
                  <p className="text-sm text-muted-foreground">11:00 AM - 12:00 PM</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Science Class - 5A</p>
                  <p className="text-sm text-muted-foreground">02:00 - 03:00 PM</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;