import { useState } from 'react';
import { TrainingForm } from '@/components/training-form';
import { TrainingList } from '@/components/training-list';
import { TrainingCalendar } from '@/components/training-calendar';
import { TrainingDetailsDialog } from '@/components/training-details-dialog';
import { AttendanceManagementDialog } from '@/components/attendance-management-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TrainingProgram, TrainingSession, TrainingAttendance, SkillDevelopmentReport, TrainingEffectiveness } from '@/types/training';
import { Plus, Calendar, FileText, BarChart } from 'lucide-react';
import { PDFService } from '@/lib/pdf-service';
// Mock data
const mockTrainingPrograms: TrainingProgram[] = [
  {
    id: '1',
    title: 'React Advanced Patterns',
    description: 'Advanced React patterns and best practices for senior developers',
    trainer: 'John Doe',
    trainerEmail: 'john@example.com',
    trainerSpecialization: 'Frontend Development',
    duration: 3,
    cost: 15000,
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    maxParticipants: 15,
    category: 'technical',
    status: 'scheduled',
    createdDate: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Leadership Skills Workshop',
    description: 'Developing leadership qualities and team management skills',
    trainer: 'Jane Smith',
    trainerEmail: 'jane@example.com',
    trainerSpecialization: 'Leadership Coaching',
    duration: 2,
    cost: 20000,
    startDate: new Date('2024-03-20'),
    endDate: new Date('2024-03-21'),
    maxParticipants: 12,
    category: 'leadership',
    status: 'scheduled',
    createdDate: new Date('2024-01-10')
  }
];

const mockTrainingSessions: TrainingSession[] = [
  {
    id: 'session-1',
    trainingProgramId: '1',
    date: new Date('2024-03-15'),
    startTime: '09:00',
    endTime: '17:00',
    topic: 'React Hooks Deep Dive',
    materials: ['slides.pdf', 'exercise.zip'],
    completed: false
  }
];

// Mock attendance data - Fixed to match the updated TrainingAttendance interface
const mockAttendance: TrainingAttendance[] = [
  {
    id: 'attendance-1',
    trainingProgramId: '1',
    employeeId: 'emp-1',
    employeeName: 'Alice Johnson',
    department: 'Engineering',
    attendanceStatus: 'present',
    completionStatus: 'completed',
    attendanceDate: new Date('2024-03-15'),
    feedback: 'Great session! Learned a lot about React patterns.',
    rating: 5,
    skillsImproved: ['React', 'JavaScript'],
    certificateIssued: true,
    certificateUrl: 'https://example.com/certificates/attendance-1.pdf'
  },
  {
    id: 'attendance-2',
    trainingProgramId: '1',
    employeeId: 'emp-2',
    employeeName: 'Bob Smith',
    department: 'Engineering',
    attendanceStatus: 'late',
    attendanceDate: new Date('2024-03-15'),
    completionStatus: 'in-progress',
    feedback: '',
    rating: 4,
    skillsImproved: ['React'],
    certificateIssued: false
  }
];

// Define the report summary interface locally since it's not in the main types
interface ReportSummary {
  totalTrainings: number;
  completedTrainings: number;
  ongoingTrainings: number;
  totalParticipants: number;
  totalCost: number;
  averageParticipantRating: number;
}

export default function TrainingPage() {
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(mockTrainingPrograms);
  const [activeTab, setActiveTab] = useState('calendar');
  const [editingTraining, setEditingTraining] = useState<TrainingProgram | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<TrainingProgram | null>(null);
  // const [attendanceData] = useState<TrainingAttendance[]>(mockAttendance);

  const [showTrainingDetails, setShowTrainingDetails] = useState(false);
  const [showAttendanceManagement, setShowAttendanceManagement] = useState(false);

  const handleSubmitTraining = (data: TrainingProgram) => {
    if (editingTraining) {
      setTrainingPrograms(prev =>
        prev.map(training => training.id === data.id ? data : training)
      );
      setEditingTraining(null);
    } else {
      const newTraining: TrainingProgram = {
        ...data,
        id: `training-${Date.now()}`,
        createdDate: new Date()
      };
      setTrainingPrograms(prev => [...prev, newTraining]);
    }
    setActiveTab('programs');
  };

  const handleEditTraining = (training: TrainingProgram) => {
    setEditingTraining(training);
    setActiveTab('create');
  };

  const handleViewTraining = (training: TrainingProgram) => {
    setSelectedTraining(training);
    setShowTrainingDetails(true);
  };

  const handleManageAttendance = (training: TrainingProgram) => {
    setSelectedTraining(training);
    setShowAttendanceManagement(true);
  };

  const handleGenerateReport = () => {
    // Calculate report statistics with proper type safety
    const totalTrainings = trainingPrograms.length;
    const completedTrainings = trainingPrograms.filter(t => t.status === 'completed').length;
    const ongoingTrainings = trainingPrograms.filter(t => t.status === 'ongoing').length;
    const totalCost = trainingPrograms.reduce((sum, training) => sum + training.cost, 0);

    // Calculate average rating safely
    const ratings = mockAttendance.filter(att => att.rating && att.rating > 0).map(att => att.rating!);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    // Create training effectiveness data
    const trainingEffectiveness: TrainingEffectiveness[] = trainingPrograms.map(training => {
      const trainingAttendance = mockAttendance.filter(att => att.trainingProgramId === training.id);
      const presentAttendance = trainingAttendance.filter(att => att.attendanceStatus === 'present');
      const trainingRatings = trainingAttendance.filter(att => att.rating && att.rating > 0).map(att => att.rating!);

      return {
        trainingProgramId: training.id,
        trainingTitle: training.title,
        attendanceRate: trainingAttendance.length > 0 ? presentAttendance.length / trainingAttendance.length : 0,
        averageRating: trainingRatings.length > 0 ? trainingRatings.reduce((sum, rating) => sum + rating, 0) / trainingRatings.length : 0,
        skillImprovements: Array.from(new Set(trainingAttendance.flatMap(att => att.skillsImproved)))
      };
    });

    const summary: ReportSummary = {
      totalTrainings,
      completedTrainings,
      ongoingTrainings,
      totalParticipants: mockAttendance.length,
      totalCost,
      averageParticipantRating: averageRating
    };

    // Generate report data - using type assertion for now since the types don't fully match
    const reportData = {
      id: `report-${Date.now()}`,
      generatedDate: new Date(),
      period: {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31')
      },
      summary,
      trainingEffectiveness,
      recommendations: [
        'Increase focus on practical hands-on sessions',
        'Consider more advanced technical training programs',
        'Improve feedback collection process'
      ],
      // Include the required fields from SkillDevelopmentReport
      employeeId: 'all',
      employeeName: 'All Employees',
      department: 'All Departments',
      skillsAcquired: Array.from(new Set(mockAttendance.flatMap(att => att.skillsImproved))),
      performanceImprovement: 15 // Mock percentage
    } as SkillDevelopmentReport & {
      summary: ReportSummary;
      trainingEffectiveness: TrainingEffectiveness[];
      recommendations: string[];
    };
    PDFService.generateTrainingReport(reportData);
  };



  return (
    <div className="w-full p-3 md:p-7">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Training & Development</h1>
            <p className="text-muted-foreground">
              Plan training programs, track attendance, and generate skill development reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGenerateReport}>
              <BarChart className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button
              onClick={() => {
                setEditingTraining(null);
                setActiveTab('create');
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Training
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Programs
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {editingTraining ? 'Edit Program' : 'Create Program'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <TrainingCalendar
              trainingPrograms={trainingPrograms}
              trainingSessions={mockTrainingSessions}
              onViewTraining={handleViewTraining}
              onEditTraining={handleEditTraining}
            />
          </TabsContent>

          <TabsContent value="programs">
            <TrainingList
              trainingPrograms={trainingPrograms}
              onEdit={handleEditTraining}
              onView={handleViewTraining}
              onManageAttendance={handleManageAttendance}
            />
          </TabsContent>

          <TabsContent value="create">
            <TrainingForm
              onSubmit={handleSubmitTraining}
              editingTraining={editingTraining}
            />
          </TabsContent>

        </Tabs>
        <TrainingDetailsDialog
          training={selectedTraining}
          open={showTrainingDetails}
          onOpenChange={setShowTrainingDetails}
          onEdit={handleEditTraining}
        />

        <AttendanceManagementDialog
          training={selectedTraining}
          attendance={mockAttendance}
          open={showAttendanceManagement}
          onOpenChange={setShowAttendanceManagement}
        />
      </div>

    </div>
  );
}