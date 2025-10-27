export interface PerformanceReview {
    id: string;
    employeeId: string;
    employeeName: string;
    reviewPeriod: {
        start: Date;
        end: Date;
    };
    kraKpi: KRAKPI[];
    ratings: Ratings;
    managerFeedback: string;
    employeeSelfReview: string;
    finalAppraisalResult: AppraisalResult;
    promotionDetails?: PromotionIncrement;
    status: 'draft' | 'in-progress' | 'completed' | 'approved';
    createdAt: Date;
    updatedAt: Date;
}

export interface KRAKPI {
    id: string;
    category: string;
    objective: string;
    kpi: string;
    target: string;
    weightage: number;
    actualAchievement: string;
    score: number;
}

export interface Ratings {
    overall: number;
    qualityOfWork: number;
    productivity: number;
    technicalSkills: number;
    communication: number;
    teamwork: number;
    initiative: number;
    adaptability: number;
}

export interface AppraisalResult {
    finalRating: number;
    performanceLevel: 'exceeds' | 'meets' | 'needs-improvement' | 'poor';
    summary: string;
    recommendations: string[];
    nextPeriodGoals: string[];
}

export interface PromotionIncrement {
    promotedTo?: string;
    incrementPercentage?: number;
    effectiveDate?: Date;
    newSalary?: number;
    comments: string;
}

export interface Goal {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    category: string;
    startDate: Date;
    endDate: Date;
    target: string;
    progress: number;
    status: 'not-started' | 'in-progress' | 'completed' | 'behind-schedule';
    weightage: number;
}

export interface Feedback {
    id: string;
    employeeId: string;
    reviewerId: string;
    reviewerName: string;
    reviewerType: 'manager' | 'peer' | 'subordinate' | 'self';
    feedback: string;
    ratings: {
        overall: number;
        collaboration: number;
        leadership: number;
        communication: number;
    };
    createdAt: Date;
    anonymous: boolean;
}