import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileDown, 
  Download, 
  Calendar as CalendarIcon,
  FileText,
  BarChart3,
  Users,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const Reports = () => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const { toast } = useToast();

  // Mock data for reports
  const attendanceData = [
    { date: '2024-01-15', present: 28, absent: 2, late: 1, total: 31 },
    { date: '2024-01-16', present: 30, absent: 1, late: 0, total: 31 },
    { date: '2024-01-17', present: 27, absent: 3, late: 1, total: 31 },
    { date: '2024-01-18', present: 29, absent: 1, late: 1, total: 31 },
    { date: '2024-01-19', present: 31, absent: 0, late: 0, total: 31 },
  ];

  const studentReports = [
    { name: 'John Doe', rollNo: '001', attendance: 98, assignments: 15, notes: 2, punishments: 0 },
    { name: 'Jane Smith', rollNo: '002', attendance: 95, assignments: 14, notes: 1, punishments: 0 },
    { name: 'Mike Johnson', rollNo: '003', attendance: 87, assignments: 12, notes: 3, punishments: 1 },
    { name: 'Sarah Wilson', rollNo: '004', attendance: 100, assignments: 16, notes: 0, punishments: 0 },
    { name: 'David Brown', rollNo: '005', attendance: 92, assignments: 13, notes: 2, punishments: 0 },
  ];

  const generateAttendancePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138); // Primary blue
    doc.text('CLASS TRACK - Attendance Report', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Class 5A - Daily Attendance Summary', 20, 45);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);

    // Prepare table data
    const tableData = attendanceData.map(day => [
      new Date(day.date).toLocaleDateString(),
      day.present.toString(),
      day.absent.toString(),
      day.late.toString(),
      `${Math.round((day.present / day.total) * 100)}%`
    ]);

    // Add table
    const tableResult = doc.autoTable({
      head: [['Date', 'Present', 'Absent', 'Late', 'Attendance %']],
      body: tableData,
      startY: 70,
      styles: {
        fontSize: 10,
        cellPadding: 8,
      },
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246],
      },
    });

    // Summary statistics
    const totalPresent = attendanceData.reduce((sum, day) => sum + day.present, 0);
    const totalDays = attendanceData.length;
    const avgAttendance = Math.round((totalPresent / (totalDays * 31)) * 100);
    const finalY = (doc as any).lastAutoTable?.finalY || 140;

    doc.setFontSize(14);
    doc.text('Summary Statistics:', 20, finalY + 20);
    doc.setFontSize(11);
    doc.text(`Total Days Recorded: ${totalDays}`, 20, finalY + 35);
    doc.text(`Average Daily Attendance: ${avgAttendance}%`, 20, finalY + 45);
    doc.text(`Highest Attendance: 100% (Jan 19, 2024)`, 20, finalY + 55);
    doc.text(`Lowest Attendance: 87% (Jan 17, 2024)`, 20, finalY + 65);

    doc.save('attendance-report.pdf');
    
    toast({
      title: "Report Generated",
      description: "Attendance report has been downloaded successfully.",
    });
  };

  const generateStudentPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.text('CLASS TRACK - Student Progress Report', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Class 5A - Individual Student Performance', 20, 45);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);

    // Prepare table data
    const tableData = studentReports.map(student => [
      student.name,
      student.rollNo,
      `${student.attendance}%`,
      student.assignments.toString(),
      student.notes.toString(),
      student.punishments.toString()
    ]);

    // Add table
    const tableResult = doc.autoTable({
      head: [['Student Name', 'Roll No', 'Attendance', 'Assignments', 'Notes', 'Punishments']],
      body: tableData,
      startY: 70,
      styles: {
        fontSize: 9,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: [16, 185, 129], // Accent green
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246],
      },
    });

    // Class statistics
    const avgAttendance = Math.round(studentReports.reduce((sum, s) => sum + s.attendance, 0) / studentReports.length);
    const totalAssignments = studentReports.reduce((sum, s) => sum + s.assignments, 0);
    const totalNotes = studentReports.reduce((sum, s) => sum + s.notes, 0);
    const finalY = (doc as any).lastAutoTable?.finalY || 140;

    doc.setFontSize(14);
    doc.text('Class Performance Summary:', 20, finalY + 20);
    doc.setFontSize(11);
    doc.text(`Class Average Attendance: ${avgAttendance}%`, 20, finalY + 35);
    doc.text(`Total Assignments Completed: ${totalAssignments}`, 20, finalY + 45);
    doc.text(`Total Notes: ${totalNotes}`, 20, finalY + 55);
    doc.text(`Students with Perfect Attendance: ${studentReports.filter(s => s.attendance === 100).length}`, 20, finalY + 65);

    doc.save('student-progress-report.pdf');
    
    toast({
      title: "Report Generated",
      description: "Student progress report has been downloaded successfully.",
    });
  };

  const quickStats = {
    totalStudents: 31,
    avgAttendance: 94,
    totalAssignments: 70,
    pendingReports: 3
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate comprehensive class reports</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-soft border-0 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-primary">{quickStats.totalStudents}</p>
              </div>
              <div className="p-3 rounded-2xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-3xl font-bold text-accent">{quickStats.avgAttendance}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-accent/10">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assignments</p>
                <p className="text-3xl font-bold text-purple-600">{quickStats.totalAssignments}</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-100">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
                <p className="text-3xl font-bold text-orange-600">{quickStats.pendingReports}</p>
              </div>
              <div className="p-3 rounded-2xl bg-orange-100">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Selector */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span>Report Date Range</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Attendance Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Generate comprehensive attendance reports with daily statistics and trends.
            </p>
            <div className="flex flex-col space-y-3">
              <Button onClick={generateAttendancePDF} className="flex items-center space-x-2">
                <FileDown className="w-4 h-4" />
                <span>Generate PDF Report</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export to Excel</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent" />
              <span>Student Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Individual student performance reports including assignments and behavior.
            </p>
            <div className="flex flex-col space-y-3">
              <Button onClick={generateStudentPDF} variant="accent" className="flex items-center space-x-2">
                <FileDown className="w-4 h-4" />
                <span>Generate PDF Report</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export to Excel</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle>Recent Report Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Attendance Report - January 2024</p>
                  <p className="text-sm text-muted-foreground">Generated 2 hours ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-accent/10">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Student Progress Report</p>
                  <p className="text-sm text-muted-foreground">Generated yesterday</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;