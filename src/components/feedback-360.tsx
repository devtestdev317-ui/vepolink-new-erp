import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Send, Users, Eye, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import type { Feedback } from '@/types/performance';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
interface Feedback360Props {
    employees: Array<{ id: string; name: string; role: string }>;
    feedbackRequests: any[];
    receivedFeedback: Feedback[];
    onFeedbackRequest: (request: any) => void;
}

export const Feedback360: React.FC<Feedback360Props> = ({
    employees,
    feedbackRequests,
    receivedFeedback,
    onFeedbackRequest
}) => {
    const [activeTab, setActiveTab] = useState<'request' | 'manage' | 'results'>('request');
    const [newRequest, setNewRequest] = useState({
        employeeId: '',
        reviewPeriod: '',
        reviewers: [] as Array<{ id: string; type: string; name: string }>,
        questions: ['How effective is communication with team members?', 'What are the key strengths demonstrated?', 'What areas need improvement?'],
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        anonymous: true
    });

    // Add a reviewer to the request
    const addReviewer = (employeeId: string, type: string) => {
        const employee = employees.find(emp => emp.id === employeeId);
        if (employee && !newRequest.reviewers.find(r => r.id === employeeId)) {
            setNewRequest(prev => ({
                ...prev,
                reviewers: [...prev.reviewers, { id: employeeId, type, name: employee.name }]
            }));
        }
    };

    // Remove a reviewer
    const removeReviewer = (reviewerId: string) => {
        setNewRequest(prev => ({
            ...prev,
            reviewers: prev.reviewers.filter(r => r.id !== reviewerId)
        }));
    };

    // Update question
    const updateQuestion = (index: number, value: string) => {
        const updatedQuestions = [...newRequest.questions];
        updatedQuestions[index] = value;
        setNewRequest(prev => ({ ...prev, questions: updatedQuestions }));
    };

    // Add more questions
    const addQuestion = () => {
        setNewRequest(prev => ({ ...prev, questions: [...prev.questions, ''] }));
    };

    // Remove question
    const removeQuestion = (index: number) => {
        if (newRequest.questions.length > 1) {
            const updatedQuestions = newRequest.questions.filter((_, i) => i !== index);
            setNewRequest(prev => ({ ...prev, questions: updatedQuestions }));
        }
    };

    // Submit feedback request
    const submitFeedbackRequest = () => {
        if (newRequest.employeeId && newRequest.reviewers.length > 0) {
            onFeedbackRequest(newRequest);

            // Reset form
            setNewRequest({
                employeeId: '',
                reviewPeriod: '',
                reviewers: [],
                questions: ['How effective is communication with team members?', 'What are the key strengths demonstrated?', 'What areas need improvement?'],
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                anonymous: true
            });

            setActiveTab('manage');
        }
    };

    // Calculate average ratings
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

    const averageRatings = calculateAverageRatings();

    // Group feedback by reviewer type
    const feedbackByType = receivedFeedback.reduce((acc, feedback) => {
        if (!acc[feedback.reviewerType]) {
            acc[feedback.reviewerType] = [];
        }
        acc[feedback.reviewerType].push(feedback);
        return acc;
    }, {} as Record<string, Feedback[]>);

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'request' | 'manage' | 'results')} className="space-y-6">
                <ScrollArea className="w-full rounded-md border whitespace-nowrap">
                    <TabsList className="flex w-full whitespace-nowrap">
                        <TabsTrigger value="request" className='flex-1'>New Request</TabsTrigger>
                        <TabsTrigger value="manage" className='flex-1'>Manage Requests</TabsTrigger>
                        <TabsTrigger value="results" className='flex-1'>View Results</TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* New Request Tab */}
                <TabsContent value="request">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                New 360° Feedback Request
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Employee Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="employee">Select Employee for Feedback</Label>
                                <Select
                                    value={newRequest.employeeId}
                                    onValueChange={(value) => setNewRequest(prev => ({ ...prev, employeeId: value }))}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Choose employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map(emp => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                {emp.name} - {emp.role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Review Period */}
                            <div className="space-y-2">
                                <Label htmlFor="reviewPeriod">Review Period</Label>
                                <Input
                                    id="reviewPeriod"
                                    value={newRequest.reviewPeriod}
                                    onChange={(e) => setNewRequest(prev => ({ ...prev, reviewPeriod: e.target.value }))}
                                    placeholder="e.g., Q1 2024, Annual Review 2024"
                                />
                            </div>

                            {/* Add Reviewers */}
                            <div className="space-y-4">
                                <Label>Add Reviewers</Label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select onValueChange={(value) => addReviewer(value, 'manager')}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Add Manager" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.filter(emp => emp.role.toLowerCase().includes('manager') || emp.role.toLowerCase().includes('lead')).map(emp => (
                                                <SelectItem key={emp.id} value={emp.id}>
                                                    {emp.name} ({emp.role})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select onValueChange={(value) => addReviewer(value, 'peer')}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Add Peer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.filter(emp => !emp.role.toLowerCase().includes('manager') && !emp.role.toLowerCase().includes('lead')).map(emp => (
                                                <SelectItem key={emp.id} value={emp.id}>
                                                    {emp.name} ({emp.role})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Selected Reviewers */}
                                {newRequest.reviewers.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Selected Reviewers ({newRequest.reviewers.length})</Label>
                                        <div className="space-y-2">
                                            {newRequest.reviewers.map(reviewer => (
                                                <div key={reviewer.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <span className="font-medium">{reviewer.name}</span>
                                                        <Badge variant="outline" className="ml-2 capitalize">
                                                            {reviewer.type}
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeReviewer(reviewer.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Feedback Questions */}
                            <div className="space-y-4">
                                <div className="flex flex-wrap space-y-3 md:space-y-0 items-center justify-between">
                                    <Label>Feedback Questions</Label>
                                    <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Question
                                    </Button>
                                </div>

                                {newRequest.questions.map((question, index) => (
                                    <div key={index} className="flex flex-wrap relative gap-2 items-start">
                                        <Textarea
                                            value={question}
                                            onChange={(e) => updateQuestion(index, e.target.value)}
                                            placeholder={`Feedback question ${index + 1}...`}
                                            rows={2}
                                            className="flex-1 md:p-2 pr-6 md:w-auto w-full md:text-base text-sm"
                                        />
                                        {newRequest.questions.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeQuestion(index)}
                                                className="mt-2 md:static absolute right-0"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Deadline & Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Feedback Deadline</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn("w-full justify-start text-left font-normal")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {format(newRequest.deadline, "PPP")}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={newRequest.deadline}
                                                onSelect={(date) => setNewRequest(prev => ({ ...prev, deadline: date! }))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label>Settings</Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={newRequest.anonymous}
                                            onCheckedChange={(checked) => setNewRequest(prev => ({ ...prev, anonymous: checked }))}
                                        />
                                        <Label htmlFor="anonymous">Anonymous Feedback</Label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Reviewers will not be identified in the feedback report
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={submitFeedbackRequest}
                                disabled={!newRequest.employeeId || newRequest.reviewers.length === 0}
                                className="w-full"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Send Feedback Requests
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Manage Requests Tab */}
                <TabsContent value="manage">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Manage Feedback Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {feedbackRequests.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No Feedback Requests</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Create your first 360° feedback request to get started.
                                    </p>
                                    <Button onClick={() => setActiveTab('request')}>
                                        <Send className="h-4 w-4 mr-2" />
                                        Create Request
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Review Period</TableHead>
                                            <TableHead>Reviewers</TableHead>
                                            <TableHead>Deadline</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {feedbackRequests.map(request => (
                                            <TableRow key={request.id}>
                                                <TableCell className="font-medium">
                                                    {employees.find(emp => emp.id === request.employeeId)?.name}
                                                </TableCell>
                                                <TableCell>{request.reviewPeriod}</TableCell>
                                                <TableCell>{request.reviewers.length} reviewers</TableCell>
                                                <TableCell>{format(request.deadline, 'MMM dd, yyyy')}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Progress
                                                            value={(request.submittedFeedback / request.totalReviewers) * 100}
                                                            className="w-20"
                                                        />
                                                        <span className="text-sm">{request.submittedFeedback}/{request.totalReviewers}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        request.status === 'completed' ? 'default' :
                                                            request.status === 'in-progress' ? 'secondary' : 'outline'
                                                    }>
                                                        {request.status.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Send className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* View Results Tab */}
                <TabsContent value="results">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Feedback Results & Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Feedback Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{averageRatings.overall}</div>
                                        <div className="text-sm text-muted-foreground">Avg. Rating</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">{receivedFeedback.length}</div>
                                        <div className="text-sm text-muted-foreground">Total Responses</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {feedbackByType['manager'] ?
                                                (feedbackByType['manager'].reduce((sum, fb) => sum + fb.ratings.overall, 0) / feedbackByType['manager'].length).toFixed(1)
                                                : '0.0'
                                            }
                                        </div>
                                        <div className="text-sm text-muted-foreground">Manager Rating</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {feedbackByType['peer'] ?
                                                (feedbackByType['peer'].reduce((sum, fb) => sum + fb.ratings.overall, 0) / feedbackByType['peer'].length).toFixed(1)
                                                : '0.0'
                                            }
                                        </div>
                                        <div className="text-sm text-muted-foreground">Peer Rating</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Rating Breakdown */}
                            <Card className='p-0'>
                                <CardContent className="md:p-6 p-3">
                                    <h4 className="font-semibold mb-4">Rating Breakdown</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap justify-between items-center">
                                                <span className="text-sm md:w-auto w-full">Overall Rating</span>
                                                <div className="flex items-center gap-2 md:w-auto w-full">
                                                    <span className="font-semibold">{averageRatings.overall}/5.0</span>
                                                    <Progress value={averageRatings.overall * 20} className="md:w-20 w-full" />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap justify-between items-center">
                                                <span className="text-sm md:w-auto w-full">Collaboration</span>
                                                <div className="flex items-center gap-2 md:w-auto w-full">
                                                    <span className="font-semibold">{averageRatings.collaboration}/5.0</span>
                                                    <Progress value={averageRatings.collaboration * 20} className="md:w-20 w-full" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap justify-between items-center">
                                                <span className="text-sm  md:w-auto w-full">Leadership</span>
                                                <div className="flex items-center gap-2  md:w-auto w-full">
                                                    <span className="font-semibold">{averageRatings.leadership}/5.0</span>
                                                    <Progress value={averageRatings.leadership * 20} className="md:w-20 w-full" />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap justify-between items-center">
                                                <span className="text-sm md:w-auto w-full">Communication</span>
                                                <div className="flex items-center gap-2 md:w-auto w-full">
                                                    <span className="font-semibold">{averageRatings.communication}/5.0</span>
                                                    <Progress value={averageRatings.communication * 20} className="md:w-20 w-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Detailed Feedback */}
                            <div className="space-y-4">
                                <h4 className="font-semibold">Detailed Feedback</h4>
                                {receivedFeedback.map(feedback => (
                                    <Card key={feedback.id} className='p-0'>
                                        <CardContent className="md:p-4 p-3">
                                            <div className="flex flex-wrap justify-between items-start mb-3">
                                                <div className='md:w-auto w-full'>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-medium">
                                                            {feedback.anonymous ? 'Anonymous' : feedback.reviewerName}
                                                        </span>
                                                        <Badge variant="outline" className="capitalize">
                                                            {feedback.reviewerType}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground md:w-auto w-full">
                                                        {format(feedback.createdAt, 'MMM dd, yyyy')}
                                                    </div>
                                                </div>
                                                <div className="text-right md:w-auto w-full md:flex-none flex flex-wrap md:mt-0 mt-1 items-center gap-x-2">
                                                    <div className="md:text-lg text-sm font-bold text-blue-600">
                                                        {feedback.ratings.overall}/5.0
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Overall</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Collaboration:</span>
                                                    <span className="ml-2 font-medium">{feedback.ratings.collaboration}/5.0</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Leadership:</span>
                                                    <span className="ml-2 font-medium">{feedback.ratings.leadership}/5.0</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Communication:</span>
                                                    <span className="ml-2 font-medium">{feedback.ratings.communication}/5.0</span>
                                                </div>
                                            </div>

                                            <div className="text-sm">
                                                <span className="font-medium">Comments:</span>
                                                <p className="mt-1 text-muted-foreground">{feedback.feedback}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};