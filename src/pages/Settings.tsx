import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon,
  User,
  School,
  Bell,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [teacherInfo, setTeacherInfo] = useState({
    name: 'Ms. Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1 (555) 123-4567',
    employeeId: 'T-2024-001'
  });

  const [classInfo, setClassInfo] = useState({
    mainClass: '5A',
    otherClasses: '6B, 7C',
    subject: 'Mathematics',
    academicYear: '2024-2025'
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    autoSave: true,
    darkMode: false,
    emailReports: true,
    backupReminder: true
  });

  const handleSaveSettings = () => {
    // Save settings to local storage or backend
    localStorage.setItem('classtrack_teacher_info', JSON.stringify(teacherInfo));
    localStorage.setItem('classtrack_class_info', JSON.stringify(classInfo));
    localStorage.setItem('classtrack_preferences', JSON.stringify(preferences));
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  const handleExportData = () => {
    const exportData = {
      teacherInfo,
      classInfo,
      preferences,
      students: JSON.parse(localStorage.getItem('classtrack_students') || '[]'),
      attendance: JSON.parse(localStorage.getItem('classtrack_attendance') || '[]'),
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `classtrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your app data has been downloaded as a backup file.",
    });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Restore data
        if (importedData.teacherInfo) {
          setTeacherInfo(importedData.teacherInfo);
          localStorage.setItem('classtrack_teacher_info', JSON.stringify(importedData.teacherInfo));
        }
        if (importedData.classInfo) {
          setClassInfo(importedData.classInfo);
          localStorage.setItem('classtrack_class_info', JSON.stringify(importedData.classInfo));
        }
        if (importedData.preferences) {
          setPreferences(importedData.preferences);
          localStorage.setItem('classtrack_preferences', JSON.stringify(importedData.preferences));
        }
        if (importedData.students) {
          localStorage.setItem('classtrack_students', JSON.stringify(importedData.students));
        }
        if (importedData.attendance) {
          localStorage.setItem('classtrack_attendance', JSON.stringify(importedData.attendance));
        }

        toast({
          title: "Data Imported",
          description: "Your backup has been restored successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import backup file. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleResetApp = () => {
    if (window.confirm('Are you sure you want to reset all app data? This action cannot be undone.')) {
      localStorage.clear();
      setTeacherInfo({
        name: '',
        email: '',
        phone: '',
        employeeId: ''
      });
      setClassInfo({
        mainClass: '',
        otherClasses: '',
        subject: '',
        academicYear: '2024-2025'
      });
      setPreferences({
        notifications: true,
        autoSave: true,
        darkMode: false,
        emailReports: true,
        backupReminder: true
      });
      
      toast({
        title: "App Reset",
        description: "All app data has been cleared successfully.",
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences and data</p>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </Button>
      </div>

      {/* Teacher Information */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <span>Teacher Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="teacher-name">Full Name</Label>
              <Input
                id="teacher-name"
                value={teacherInfo.name}
                onChange={(e) => setTeacherInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-email">Email Address</Label>
              <Input
                id="teacher-email"
                type="email"
                value={teacherInfo.email}
                onChange={(e) => setTeacherInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-phone">Phone Number</Label>
              <Input
                id="teacher-phone"
                value={teacherInfo.phone}
                onChange={(e) => setTeacherInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-id">Employee ID</Label>
              <Input
                id="employee-id"
                value={teacherInfo.employeeId}
                onChange={(e) => setTeacherInfo(prev => ({ ...prev, employeeId: e.target.value }))}
                placeholder="Enter your employee ID"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Information */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <School className="w-5 h-5 text-accent" />
            <span>Class Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="main-class">Main Class (Class Teacher)</Label>
              <Input
                id="main-class"
                value={classInfo.mainClass}
                onChange={(e) => setClassInfo(prev => ({ ...prev, mainClass: e.target.value }))}
                placeholder="e.g., 5A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="other-classes">Other Classes (Subject Teacher)</Label>
              <Input
                id="other-classes"
                value={classInfo.otherClasses}
                onChange={(e) => setClassInfo(prev => ({ ...prev, otherClasses: e.target.value }))}
                placeholder="e.g., 6B, 7C"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Primary Subject</Label>
              <Input
                id="subject"
                value={classInfo.subject}
                onChange={(e) => setClassInfo(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Mathematics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academic-year">Academic Year</Label>
              <Input
                id="academic-year"
                value={classInfo.academicYear}
                onChange={(e) => setClassInfo(prev => ({ ...prev, academicYear: e.target.value }))}
                placeholder="e.g., 2024-2025"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-purple-600" />
            <span>App Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for important updates</p>
              </div>
              <Switch
                checked={preferences.notifications}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto Save</Label>
                <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
              </div>
              <Switch
                checked={preferences.autoSave}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoSave: checked }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, darkMode: checked }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Reports</Label>
                <p className="text-sm text-muted-foreground">Send weekly reports to your email</p>
              </div>
              <Switch
                checked={preferences.emailReports}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailReports: checked }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Backup Reminders</Label>
                <p className="text-sm text-muted-foreground">Weekly reminders to backup your data</p>
              </div>
              <Switch
                checked={preferences.backupReminder}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, backupReminder: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleExportData} variant="accent" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
            
            <div>
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <Button 
                onClick={() => document.getElementById('import-file')?.click()}
                variant="outline" 
                className="flex items-center space-x-2 w-full"
              >
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </Button>
            </div>
            
            <Button onClick={handleResetApp} variant="destructive" className="flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Reset App</span>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-2xl">
            <p className="font-medium mb-2">📋 Data Management Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Export your data regularly to prevent data loss</li>
              <li>Backup files are saved in JSON format</li>
              <li>Reset will permanently delete all app data</li>
              <li>Import feature restores data from backup files</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle>App Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">v1.0.0</p>
              <p className="text-sm text-muted-foreground">Version</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">2024</p>
              <p className="text-sm text-muted-foreground">Release Year</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">Offline</p>
              <p className="text-sm text-muted-foreground">Data Storage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;