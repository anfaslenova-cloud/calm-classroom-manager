import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  FileSpreadsheet,
  UserPlus,
  MoreVertical
} from 'lucide-react';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock student data
  const students = [
    { id: 1, name: 'John Doe', rollNo: '001', class: '5A', attendance: 95, status: 'Active' },
    { id: 2, name: 'Jane Smith', rollNo: '002', class: '5A', attendance: 92, status: 'Active' },
    { id: 3, name: 'Mike Johnson', rollNo: '003', class: '5A', attendance: 88, status: 'Active' },
    { id: 4, name: 'Sarah Wilson', rollNo: '004', class: '5A', attendance: 97, status: 'Active' },
    { id: 5, name: 'David Brown', rollNo: '005', class: '5A', attendance: 85, status: 'Active' },
    { id: 6, name: 'Emily Davis', rollNo: '006', class: '5A', attendance: 94, status: 'Active' },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground">Manage your class students efficiently</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Import Excel</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{students.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-foreground">{students.filter(s => s.status === 'Active').length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-accent/10">
                <UserPlus className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-3xl font-bold text-foreground">
                  {Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-orange-100">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Class</p>
                <p className="text-3xl font-bold text-foreground">5A</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search students by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
            <Button variant="outline" className="shrink-0">
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Students ({filteredStudents.length})</span>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
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
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Roll: {student.rollNo}</span>
                      <span>•</span>
                      <span>Class: {student.class}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {student.attendance}% Attendance
                    </div>
                    <Badge 
                      variant={student.status === 'Active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {student.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first student'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;