import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ClipboardCheck, 
  Calendar as CalendarIcon,
  Users,
  Check,
  X,
  Clock,
  Save
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type AttendanceStatus = 'present' | 'absent' | 'late';

interface Student {
  id: number;
  name: string;
  rollNo: string;
  status: AttendanceStatus;
}

const Attendance = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'John Doe', rollNo: '001', status: 'present' },
    { id: 2, name: 'Jane Smith', rollNo: '002', status: 'present' },
    { id: 3, name: 'Mike Johnson', rollNo: '003', status: 'absent' },
    { id: 4, name: 'Sarah Wilson', rollNo: '004', status: 'present' },
    { id: 5, name: 'David Brown', rollNo: '005', status: 'late' },
    { id: 6, name: 'Emily Davis', rollNo: '006', status: 'present' },
  ]);

  const updateAttendance = (studentId: number, status: AttendanceStatus) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'present' as AttendanceStatus })));
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'absent' as AttendanceStatus })));
  };

  const saveAttendance = () => {
    // Save attendance to localStorage
    const attendanceData = {
      date: selectedDate.toISOString().split('T')[0],
      students: students.map(s => ({ id: s.id, name: s.name, rollNo: s.rollNo, status: s.status })),
      timestamp: new Date().toISOString()
    };
    
    const existingData = JSON.parse(localStorage.getItem('classtrack_attendance') || '[]');
    const updatedData = existingData.filter((d: any) => d.date !== attendanceData.date);
    updatedData.push(attendanceData);
    localStorage.setItem('classtrack_attendance', JSON.stringify(updatedData));
    
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(selectedDate, 'PPP')} has been saved successfully.`,
    });
  };

  const loadAttendanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const savedData = JSON.parse(localStorage.getItem('classtrack_attendance') || '[]');
    const dayData = savedData.find((d: any) => d.date === dateStr);
    
    if (dayData) {
      setStudents(dayData.students);
      toast({
        title: "Attendance Loaded",
        description: `Showing attendance for ${format(date, 'PPP')}`,
      });
    } else {
      // Reset to default if no data found
      setStudents([
        { id: 1, name: 'John Doe', rollNo: '001', status: 'present' },
        { id: 2, name: 'Jane Smith', rollNo: '002', status: 'present' },
        { id: 3, name: 'Mike Johnson', rollNo: '003', status: 'present' },
        { id: 4, name: 'Sarah Wilson', rollNo: '004', status: 'present' },
        { id: 5, name: 'David Brown', rollNo: '005', status: 'present' },
        { id: 6, name: 'Emily Davis', rollNo: '006', status: 'present' },
      ]);
      toast({
        title: "No Data Found",
        description: `No attendance data found for ${format(date, 'PPP')}. Showing default view.`,
      });
    }
  };

  const getStatusStats = () => {
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const late = students.filter(s => s.status === 'late').length;
    const total = students.length;
    const percentage = Math.round((present / total) * 100);

    return { present, absent, late, total, percentage };
  };

  const stats = getStatusStats();

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-accent text-white';
      case 'absent':
        return 'bg-destructive text-white';
      case 'late':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <Check className="w-4 h-4" />;
      case 'absent':
        return <X className="w-4 h-4" />;
      case 'late':
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Attendance</h1>
          <p className="text-muted-foreground">Mark attendance for Class 5A</p>
        </div>
        <div className="flex items-center space-x-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  "px-4 py-2 rounded-2xl"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 px-4 py-2 rounded-2xl"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>View Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={viewDate}
                onSelect={(date) => {
                  if (date) {
                    setViewDate(date);
                    loadAttendanceForDate(date);
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button onClick={saveAttendance} variant="primary" className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="p-3 rounded-2xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-3xl font-bold text-accent">{stats.present}</p>
              </div>
              <div className="p-3 rounded-2xl bg-accent/10">
                <Check className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-3xl font-bold text-destructive">{stats.absent}</p>
              </div>
              <div className="p-3 rounded-2xl bg-destructive/10">
                <X className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Late</p>
                <p className="text-3xl font-bold text-orange-600">{stats.late}</p>
              </div>
              <div className="p-3 rounded-2xl bg-orange-100">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                <p className="text-3xl font-bold text-foreground">{stats.percentage}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-100">
                <ClipboardCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft border-0">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={markAllPresent} variant="accent" size="sm">
              Mark All Present
            </Button>
            <Button onClick={markAllAbsent} variant="destructive" size="sm">
              Mark All Absent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span>Attendance for {format(selectedDate, 'EEEE, MMMM do, yyyy')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={cn("px-3 py-1 rounded-2xl", getStatusColor(student.status))}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(student.status)}
                      <span className="capitalize">{student.status}</span>
                    </div>
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateAttendance(student.id, 'present')}
                      className="h-8 px-3 rounded-xl"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={student.status === 'late' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateAttendance(student.id, 'late')}
                      className="h-8 px-3 rounded-xl"
                    >
                      <Clock className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={student.status === 'absent' ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => updateAttendance(student.id, 'absent')}
                      className="h-8 px-3 rounded-xl"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;