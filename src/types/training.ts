export interface TrainingProgram {
    id: string;
    title: string;
    description: string;
    trainer: string;
    trainerEmail: string;
    trainerSpecialization: string;
    duration: number; // in days
    cost: number;
    startDate: Date;
    endDate: Date;
    maxParticipants: number;
    category: 'technical' | 'soft-skills' | 'leadership' | 'compliance' | 'other';
    status: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    createdDate: Date;
}

export interface TrainingAttendance {
    id: string;
    trainingProgramId: string;
    employeeId: string;
    employeeName: string;
    department: string;
    attendanceStatus: 'present' | 'absent' | 'late'; // Fixed: was 'attendance'
    attendanceDate: Date; // Added missing field
    completionStatus: 'not-started' | 'in-progress' | 'completed' | 'failed';
    feedback?: string;
    rating?: number; // 1-5
    skillsImproved: string[];
    certificateIssued: boolean;
    certificateUrl?: string;
}

export interface TrainingSession {
    id: string;
    trainingProgramId: string;
    date: Date;
    startTime: string;
    endTime: string;
    topic: string;
    materials: string[];
    completed: boolean;
}

export interface SkillDevelopmentReport {
    id: string; // Added missing field
    employeeId: string;
    employeeName: string;
    department: string;
    totalTrainings: number;
    completedTrainings: number;
    skillsAcquired: string[];
    averageRating: number;
    performanceImprovement: number; // percentage
    generatedDate: Date; // Added missing field
    period: { // Added missing field
        start: Date;
        end: Date;
    };
    summary: { // Added missing field
        totalTrainings: number;
        completedTrainings: number;
        ongoingTrainings: number;
        totalParticipants: number;
        totalCost: number;
        averageParticipantRating: number;
    };
    trainingEffectiveness: TrainingEffectiveness[]; // Added missing field
    recommendations: string[]; // Added missing field
}

// Additional missing types that are used in the components
export interface TrainingEffectiveness {
    trainingProgramId: string;
    trainingTitle: string;
    attendanceRate: number;
    averageRating: number;
    skillImprovements: string[];
}

export interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: TrainingProgram | TrainingSession;
}

// Types for react-big-calendar
export type View = 'month' | 'week' | 'day' | 'agenda';

// Additional types that might be useful
export interface TrainingCategory {
    value: 'technical' | 'soft-skills' | 'leadership' | 'compliance' | 'other';
    label: string;
    color: string;
}

export interface TrainingStatus {
    value: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
}

// Constants for categories and statuses
export const TRAINING_CATEGORIES: TrainingCategory[] = [
    { value: 'technical', label: 'Technical Skills', color: 'bg-blue-100 text-blue-800' },
    { value: 'soft-skills', label: 'Soft Skills', color: 'bg-green-100 text-green-800' },
    { value: 'leadership', label: 'Leadership', color: 'bg-purple-100 text-purple-800' },
    { value: 'compliance', label: 'Compliance', color: 'bg-orange-100 text-orange-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
];

export const TRAINING_STATUSES: TrainingStatus[] = [
    { value: 'draft', label: 'Draft', variant: 'outline' },
    { value: 'scheduled', label: 'Scheduled', variant: 'secondary' },
    { value: 'ongoing', label: 'Ongoing', variant: 'default' },
    { value: 'completed', label: 'Completed', variant: 'default' },
    { value: 'cancelled', label: 'Cancelled', variant: 'destructive' }
];

// Attendance related types
export interface AttendanceRecord {
    id: string;
    trainingProgramId: string;
    employeeId: string;
    employeeName: string;
    department: string;
    status: 'present' | 'absent' | 'late';
    date: Date;
    notes?: string;
}

// Report related types
export interface ReportFilters {
    startDate?: Date;
    endDate?: Date;
    department?: string;
    category?: TrainingProgram['category'];
    status?: TrainingProgram['status'];
}

export interface TrainingMetrics {
    totalPrograms: number;
    completedPrograms: number;
    totalParticipants: number;
    averageAttendanceRate: number;
    totalCost: number;
    averageRating: number;
}