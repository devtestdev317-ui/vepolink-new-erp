'use client';

import { useEffect, useState } from 'react';
import { PerformanceReviewForm } from '@/components/performance-review-form';
import { GoalsTracking } from '@/components/goals-tracking';
import { Feedback360 } from '@/components/feedback-360';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Target,
    FileText,
    Users,
    History,
    Plus,
    Download
} from 'lucide-react';
import type {
    PerformanceReview,
    Goal,
    Feedback
} from '@/types/performance';

// Mock data
const mockEmployees = [
    { id: 'emp1', name: 'John Doe', role: 'Software Engineer' },
    { id: 'emp2', name: 'Jane Smith', role: 'Product Manager' },
    { id: 'emp3', name: 'Mike Johnson', role: 'Team Lead' },
    { id: 'emp4', name: 'Sarah Wilson', role: 'Engineering Manager' },
    { id: 'emp5', name: 'David Kim', role: 'UX Designer' },
    { id: 'emp6', name: 'Lisa Rodriguez', role: 'QA Engineer' },
];

const mockPerformanceReviews: PerformanceReview[] = [
    {
        id: 'review1',
        employeeId: 'emp1',
        employeeName: 'John Doe',
        reviewPeriod: {
            start: new Date('2024-01-01'),
            end: new Date('2024-03-31')
        },
        kraKpi: [
            {
                id: 'kra1',
                category: 'Technical',
                objective: 'Improve code quality',
                kpi: 'Code review score',
                target: '4.5/5',
                weightage: 30,
                actualAchievement: '4.2/5',
                score: 4.2
            }
        ],
        ratings: {
            overall: 4.2,
            qualityOfWork: 4.5,
            productivity: 4.0,
            technicalSkills: 4.3,
            communication: 4.0,
            teamwork: 4.5,
            initiative: 4.1,
            adaptability: 4.0
        },
        managerFeedback: 'Excellent work this quarter. Showed great initiative.',
        employeeSelfReview: 'I feel I have grown significantly in technical skills.',
        finalAppraisalResult: {
            finalRating: 4.2,
            performanceLevel: 'exceeds',
            summary: 'Outstanding performance with significant contributions.',
            recommendations: ['Continue mentoring junior team members'],
            nextPeriodGoals: ['Lead a major feature implementation']
        },
        promotionDetails: {
            incrementPercentage: 12,
            effectiveDate: new Date('2024-04-01'),
            comments: 'Promotion to Senior Developer recommended'
        },
        status: 'completed',
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2024-04-01')
    }
];

const mockGoals: Goal[] = [
    {
        id: 'goal1',
        employeeId: 'emp1',
        title: 'Complete Advanced React Course',
        description: 'Finish the advanced React patterns course and apply learnings',
        category: 'learning',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        target: 'Course completion certificate',
        progress: 75,
        status: 'in-progress',
        weightage: 25
    }
];

// Mock feedback data
const mockFeedbackRequests = [
    {
        id: 'req1',
        employeeId: 'emp1',
        employeeName: 'John Doe',
        reviewPeriod: 'Q1 2024',
        reviewers: [
            { id: 'emp4', type: 'manager', name: 'Sarah Wilson' },
            { id: 'emp2', type: 'peer', name: 'Jane Smith' },
            { id: 'emp5', type: 'peer', name: 'David Kim' }
        ],
        questions: [
            'How effective is communication with team members?',
            'What are the key strengths demonstrated?',
            'What areas need improvement for professional growth?'
        ],
        deadline: new Date('2024-04-15'),
        anonymous: true,
        status: 'in-progress',
        createdAt: new Date('2024-04-01'),
        submittedFeedback: 2,
        totalReviewers: 3
    }
];

const mockReceivedFeedback: Feedback[] = [
    {
        id: 'fb1',
        employeeId: 'emp1',
        reviewerId: 'emp4',
        reviewerName: 'Sarah Wilson',
        reviewerType: 'manager',
        feedback: 'John demonstrates excellent technical skills and always delivers high-quality code. His communication with stakeholders has improved significantly this quarter. Would like to see more initiative in mentoring junior team members.',
        ratings: {
            overall: 4.5,
            collaboration: 4.0,
            leadership: 3.5,
            communication: 4.0
        },
        createdAt: new Date('2024-04-10'),
        anonymous: true
    },
    {
        id: 'fb2',
        employeeId: 'emp1',
        reviewerId: 'emp2',
        reviewerName: 'Jane Smith',
        reviewerType: 'peer',
        feedback: 'Great team player! Always available to help with technical challenges. Sometimes takes on too much work which affects work-life balance. Excellent problem-solving skills.',
        ratings: {
            overall: 4.0,
            collaboration: 4.5,
            leadership: 4.0,
            communication: 4.0
        },
        createdAt: new Date('2024-04-12'),
        anonymous: true
    },
    {
        id: 'fb3',
        employeeId: 'emp1',
        reviewerId: 'emp5',
        reviewerName: 'David Kim',
        reviewerType: 'peer',
        feedback: 'Very reliable and knowledgeable. Provides clear explanations during code reviews. Could improve on documenting complex features for future reference.',
        ratings: {
            overall: 4.2,
            collaboration: 4.0,
            leadership: 3.8,
            communication: 4.3
        },
        createdAt: new Date('2024-04-08'),
        anonymous: true
    }
];

export default function PerformanceManagementPage() {
    const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(mockPerformanceReviews);
    const [goals, setGoals] = useState<Goal[]>(mockGoals);
    const [feedbackRequests, setFeedbackRequests] = useState(mockFeedbackRequests);
    const [receivedFeedback, setReceivedFeedback] = useState<Feedback[]>([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(()=>{
        setReceivedFeedback(mockReceivedFeedback);  
    },[])

    const handleSubmitReview = (review: PerformanceReview) => {
        setPerformanceReviews(prev => [...prev, review]);
        setActiveTab('overview');
    };

    const handleGoalsUpdate = (updatedGoals: Goal[]) => {
        setGoals(updatedGoals);
    };

    const handleFeedbackRequest = (newRequest: any) => {
        const request = {
            ...newRequest,
            id: `feedback-request-${Date.now()}`,
            status: 'pending',
            createdAt: new Date(),
            submittedFeedback: 0,
            totalReviewers: newRequest.reviewers.length
        };
        setFeedbackRequests(prev => [...prev, request]);
    };

    const getPerformanceLevelColor = (level: string) => {
        switch (level) {
            case 'exceeds': return 'text-green-600 bg-green-100';
            case 'meets': return 'text-blue-600 bg-blue-100';
            case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
            case 'poor': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    // Calculate average ratings from feedback
    const calculateAverageRatings = () => {
        if (receivedFeedback.length === 0) return { overall: 0, collaboration: 0, leadership: 0, communication: 0 };

        const totals = receivedFeedback.reduce((acc, feedback) => ({
            overall: acc.overall + feedback.ratings.overall,
            collaboration: acc.collaboration + feedback.ratings.collaboration,
            leadership: acc.leadership + feedback.ratings.leadership,
            communication: acc.communication + feedback.ratings.communication
        }), { overall: 0, collaboration: 0, leadership: 0, communication: 0 });

        return {
            overall: parseFloat((totals.overall / receivedFeedback.length).toFixed(1)),
            collaboration: parseFloat((totals.collaboration / receivedFeedback.length).toFixed(1)),
            leadership: parseFloat((totals.leadership / receivedFeedback.length).toFixed(1)),
            communication: parseFloat((totals.communication / receivedFeedback.length).toFixed(1))
        };
    };

    calculateAverageRatings();

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Performance Management</h1>
                    <p className="text-muted-foreground">
                        Track employee performance, set goals, and manage appraisals
                    </p>
                </div>
                <div className="flex gap-2">
                    {
                        activeTab === 'reviews' ? null :
                            (<Button onClick={() => setActiveTab('reviews')}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Review
                            </Button>)
                    }
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Reports
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Performance Reviews
                    </TabsTrigger>
                    <TabsTrigger value="goals" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Goals & Tracking
                    </TabsTrigger>
                    <TabsTrigger value="feedback" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        360° Feedback
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Appraisal History
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                                        <h3 className="text-2xl font-bold mt-2">3</h3>
                                    </div>
                                    <FileText className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Avg. Performance Rating</p>
                                        <h3 className="text-2xl font-bold mt-2">4.2/5.0</h3>
                                    </div>
                                    <Target className="h-8 w-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Goals Completion</p>
                                        <h3 className="text-2xl font-bold mt-2">68%</h3>
                                    </div>
                                    <Users className="h-8 w-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">360° Feedback</p>
                                        <h3 className="text-2xl font-bold mt-2">{receivedFeedback.length}</h3>
                                        <p className="text-xs text-muted-foreground">Responses</p>
                                    </div>
                                    <Users className="h-8 w-8 text-orange-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Reviews */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Performance Reviews</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Review Period</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Performance Level</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {performanceReviews.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell className="font-medium">{review.employeeName}</TableCell>
                                            <TableCell>
                                                {new Date(review.reviewPeriod.start).toLocaleDateString()} - {' '}
                                                {new Date(review.reviewPeriod.end).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{review.ratings.overall}</span>
                                                    <Progress value={review.ratings.overall * 20} className="w-20" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getPerformanceLevelColor(review.finalAppraisalResult.performanceLevel)}>
                                                    {review.finalAppraisalResult.performanceLevel.replace('-', ' ').toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    review.status === 'completed' ? 'default' :
                                                        review.status === 'in-progress' ? 'secondary' : 'outline'
                                                }>
                                                    {review.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Performance Reviews Tab */}
                <TabsContent value="reviews">
                    <PerformanceReviewForm
                        onSubmit={handleSubmitReview}
                        employees={mockEmployees}
                    />
                </TabsContent>

                {/* Goals & Tracking Tab */}
                <TabsContent value="goals">
                    <GoalsTracking
                        goals={goals}
                        onGoalsUpdate={handleGoalsUpdate}
                    />
                </TabsContent>

                {/* 360° Feedback Tab */}
                <TabsContent value="feedback">
                    <Feedback360
                        employees={mockEmployees}
                        feedbackRequests={feedbackRequests}
                        receivedFeedback={receivedFeedback}
                        onFeedbackRequest={handleFeedbackRequest}
                    />
                </TabsContent>

                {/* Appraisal History Tab */}
                <TabsContent value="history">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Appraisal History</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Final Rating</TableHead>
                                        <TableHead>Increment</TableHead>
                                        <TableHead>Promotion</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {performanceReviews.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell className="font-medium">{review.employeeName}</TableCell>
                                            <TableCell>
                                                Q{Math.floor((new Date(review.reviewPeriod.start).getMonth() + 3) / 3)} {' '}
                                                {new Date(review.reviewPeriod.start).getFullYear()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{review.finalAppraisalResult.finalRating}/5.0</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {review.promotionDetails?.incrementPercentage ? (
                                                    <span className="text-green-600 font-semibold">
                                                        +{review.promotionDetails.incrementPercentage}%
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {review.promotionDetails?.promotedTo || (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    review.status === 'completed' ? 'default' :
                                                        review.status === 'in-progress' ? 'secondary' : 'outline'
                                                }>
                                                    {review.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}