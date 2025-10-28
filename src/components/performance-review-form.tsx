import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calculator, CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { PerformanceReview, KRAKPI, Ratings, AppraisalResult } from '@/types/performance';
import { cn } from '@/lib/utils';
import { PDFService } from '@/lib/pdf-service';
import { toast } from "sonner";
interface PerformanceReviewFormProps {
    onSubmit: (review: PerformanceReview) => void;
    employees: Array<{ id: string; name: string }>;
    initialData?: PerformanceReview;
}

export const PerformanceReviewForm: React.FC<PerformanceReviewFormProps> = ({
    onSubmit,
    employees,
    initialData
}) => {
    const [formData, setFormData] = useState<Partial<PerformanceReview>>(
        initialData || {
            reviewPeriod: { start: new Date(), end: new Date() },
            kraKpi: [],
            ratings: {
                overall: 0,
                qualityOfWork: 0,
                productivity: 0,
                technicalSkills: 0,
                communication: 0,
                teamwork: 0,
                initiative: 0,
                adaptability: 0
            },
            finalAppraisalResult: {
                finalRating: 0,
                performanceLevel: 'meets',
                summary: '',
                recommendations: [],
                nextPeriodGoals: []
            },
            status: 'draft'
        }
    );

    const [newKRA, setNewKRA] = useState<Omit<KRAKPI, 'id'>>({
        category: '',
        objective: '',
        kpi: '',
        target: '',
        weightage: 0,
        actualAchievement: '',
        score: 0
    });

    const addKRA = () => {
        if (newKRA.category && newKRA.objective && newKRA.kpi) {
            setFormData(prev => ({
                ...prev,
                kraKpi: [
                    ...(prev.kraKpi || []),
                    { ...newKRA, id: `kra-${Date.now()}` }
                ]
            }));
            setNewKRA({
                category: '',
                objective: '',
                kpi: '',
                target: '',
                weightage: 0,
                actualAchievement: '',
                score: 0
            });
            toast.success("KRA added successfully", {
                description: new Date().toString(),
                action: {
                    label: "Success",
                    onClick: () => console.log("Success"),
                },
            })
        }
        else {
            toast.error("Please fill in all required fields", {
                description: "Category, Objective, and KPI are required.",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            })
        }
    };

    const removeKRA = (id: string) => {
        setFormData(prev => ({
            ...prev,
            kraKpi: prev.kraKpi?.filter(kra => kra.id !== id)
        }));
        toast.success("KRA removed successfully", {
            description: new Date().toString(),
            action: {
                label: "Success",
                onClick: () => console.log("Success"),
            },
        })
    };

    const handleRatingChange = (field: keyof Ratings, value: number) => {
        setFormData(prev => ({
            ...prev,
            ratings: {
                ...prev.ratings!,
                [field]: Math.min(5, Math.max(0, value))
            }
        }));
    };

    const calculateOverallRating = () => {
        const ratings = formData.ratings!;
        const values = Object.values(ratings).filter(val => typeof val === 'number') as number[];
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;

        setFormData(prev => ({
            ...prev,
            ratings: {
                ...prev.ratings!,
                overall: parseFloat(average.toFixed(1))
            },
            finalAppraisalResult: {
                ...prev.finalAppraisalResult!,
                finalRating: parseFloat(average.toFixed(1))
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.employeeId && formData.reviewPeriod) {
            const review: PerformanceReview = {
                id: initialData?.id || `review-${Date.now()}`,
                employeeName: employees.find(emp => emp.id === formData.employeeId)?.name || '',
                createdAt: initialData?.createdAt || new Date(),
                updatedAt: new Date(),
                ...formData
            } as PerformanceReview;
            onSubmit(review);
        }
        else {
            toast.error("complete then form", {
                description: "Please complete the performance review before generating report",
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
        }
    };
    const handleGenerateReport = async () => {
        if (!formData.employeeId || !formData.reviewPeriod) {
            toast.error("complete then form", {
                description: "Please complete the performance review before generating report",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            })
            return;
        }

        try {
            // Create complete review data for PDF generation
            const reportData: PerformanceReview = {
                id: formData.id || `report-${Date.now()}`,
                employeeId: formData.employeeId,
                employeeName: employees.find(emp => emp.id === formData.employeeId)?.name || '',
                reviewPeriod: formData.reviewPeriod,
                kraKpi: formData.kraKpi || [],
                ratings: formData.ratings!,
                managerFeedback: formData.managerFeedback || '',
                employeeSelfReview: formData.employeeSelfReview || '',
                finalAppraisalResult: formData.finalAppraisalResult!,
                promotionDetails: formData.promotionDetails,
                status: formData.status || 'draft',
                createdAt: formData.createdAt || new Date(),
                updatedAt: new Date()
            };

            // Generate PDF report
            await PDFService.generatePerformanceReport(reportData);

            // Optional: Track report generation
            console.log('Performance report generated successfully');

        } catch (error) {
            console.error('Error generating report:', error);
            alert('Error generating performance report. Please try again.');
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Performance Review</span>
                    {/* <Badge variant={
                        formData.status === 'completed' ? 'default' :
                            formData.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                        {formData.status?.toUpperCase()}
                    </Badge> */}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employeeId">Employee</Label>
                            <Select
                                value={formData.employeeId}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, employeeId: value }))}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue className='w-full' placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Review Period From Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.reviewPeriod?.start && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.reviewPeriod?.start ? (
                                            format(formData.reviewPeriod.start, "PPP")
                                        ) : (
                                            <span>Start date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.reviewPeriod?.start}
                                        captionLayout="dropdown"
                                        onSelect={(date) => setFormData(prev => ({
                                            ...prev,
                                            reviewPeriod: { ...prev.reviewPeriod!, start: date! }
                                        }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Review Period End Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.reviewPeriod?.end && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.reviewPeriod?.end ? (
                                            format(formData.reviewPeriod.end, "PPP")
                                        ) : (
                                            <span>End date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.reviewPeriod?.end} captionLayout="dropdown"
                                        onSelect={(date) => setFormData(prev => ({
                                            ...prev,
                                            reviewPeriod: { ...prev.reviewPeriod!, end: date! }
                                        }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Button className='mt-[0] md:mt-[20px] cursor-pointer' type="button" onClick={calculateOverallRating} variant="default">
                                <Calculator className='h-4 w-4 mr-2' /> Calculate Overall Rating
                            </Button>
                        </div>
                    </div>

                    {/* KRA/KPI Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">KRA/KPI</Label>
                        </div>

                        {/* Add New KRA */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Input
                                            id="category"
                                            value={newKRA.category}
                                            onChange={(e) => setNewKRA(prev => ({ ...prev, category: e.target.value }))}
                                            placeholder="e.g., Technical"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="objective">Objective</Label>
                                        <Input
                                            id="objective"
                                            value={newKRA.objective}
                                            onChange={(e) => setNewKRA(prev => ({ ...prev, objective: e.target.value }))}
                                            placeholder="Objective description"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kpi">KPI</Label>
                                        <Input
                                            id="kpi"
                                            value={newKRA.kpi}
                                            onChange={(e) => setNewKRA(prev => ({ ...prev, kpi: e.target.value }))}
                                            placeholder="Key Performance Indicator"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weightage">Weightage (%)</Label>
                                        <Input
                                            id="weightage"
                                            type="number"
                                            value={newKRA.weightage}
                                            onChange={(e) => setNewKRA(prev => ({ ...prev, weightage: Number(e.target.value) }))}
                                            placeholder="0-100"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="target">Target</Label>
                                        <Input
                                            id="target"
                                            value={newKRA.target}
                                            onChange={(e) => setNewKRA(prev => ({ ...prev, target: e.target.value }))}
                                            placeholder="Expected target"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="actual">Actual Achievement</Label>
                                        <Input
                                            id="actual"
                                            value={newKRA.actualAchievement}
                                            onChange={(e) => setNewKRA(prev => ({ ...prev, actualAchievement: e.target.value }))}
                                            placeholder="Actual achievement"
                                        />
                                    </div>
                                </div>
                                <Button type="button" onClick={addKRA} className="mt-4 cursor-pointer" variant="default">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add KRA
                                </Button>
                            </CardContent>
                        </Card>

                        {/* KRA List */}
                        {formData.kraKpi?.map((kra) => (
                            <Card key={kra.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-semibold">{kra.category}</h4>
                                            <p className="text-sm text-muted-foreground">{kra.objective}</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeKRA(kra.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">KPI:</span> {kra.kpi}
                                        </div>
                                        <div>
                                            <span className="font-medium">Target:</span> {kra.target}
                                        </div>
                                        <div>
                                            <span className="font-medium">Actual:</span> {kra.actualAchievement}
                                        </div>
                                        <div>
                                            <span className="font-medium">Weightage:</span> {kra.weightage}%
                                        </div>
                                        <div>
                                            <span className="font-medium">Score:</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="5"
                                                step="0.1"
                                                value={kra.score}
                                                onChange={(e) => {
                                                    const updatedKRA = formData.kraKpi?.map(k =>
                                                        k.id === kra.id ? { ...k, score: Number(e.target.value) } : k
                                                    );
                                                    setFormData(prev => ({ ...prev, kraKpi: updatedKRA }));
                                                }}
                                                className="w-20 ml-2 inline-block"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Ratings Section */}
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Performance Ratings (1-5)</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(formData.ratings || {}).map(([key, value]) => (
                                key !== 'overall' && (
                                    <div key={key} className="space-y-2">
                                        <Label htmlFor={key} className="capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id={key}
                                                type="number"
                                                min="0"
                                                max="5"
                                                step="0.1"
                                                value={value as number}
                                                onChange={(e) => handleRatingChange(key as keyof Ratings, Number(e.target.value))}
                                            />
                                            <div className="w-20 text-sm text-muted-foreground">
                                                {value >= 4.5 ? 'Excellent' :
                                                    value >= 3.5 ? 'Good' :
                                                        value >= 2.5 ? 'Average' :
                                                            value >= 1.5 ? 'Needs Improvement' : 'Poor'}
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Overall Rating */}
                        <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <Label className="text-lg font-semibold">Overall Rating</Label>
                                <div className="text-2xl font-bold text-blue-600">
                                    {formData.ratings?.overall.toFixed(1)}/5.0
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="managerFeedback">Manager Feedback</Label>
                            <Textarea
                                id="managerFeedback"
                                value={formData.managerFeedback}
                                onChange={(e) => setFormData(prev => ({ ...prev, managerFeedback: e.target.value }))}
                                placeholder="Provide constructive feedback..."
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="employeeSelfReview">Employee Self-Review</Label>
                            <Textarea
                                id="employeeSelfReview"
                                value={formData.employeeSelfReview}
                                onChange={(e) => setFormData(prev => ({ ...prev, employeeSelfReview: e.target.value }))}
                                placeholder="Employee's self-assessment..."
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Final Appraisal Result */}
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Final Appraisal Result</Label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="performanceLevel">Performance Level</Label>
                                <Select
                                    value={formData.finalAppraisalResult?.performanceLevel}
                                    onValueChange={(value: AppraisalResult['performanceLevel']) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            finalAppraisalResult: {
                                                ...prev.finalAppraisalResult!,
                                                performanceLevel: value
                                            }
                                        }))
                                    }
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select performance level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="exceeds">Exceeds Expectations</SelectItem>
                                        <SelectItem value="meets">Meets Expectations</SelectItem>
                                        <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                                        <SelectItem value="poor">Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="finalRating">Final Rating</Label>
                                <Input
                                    id="finalRating"
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={formData.finalAppraisalResult?.finalRating}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        finalAppraisalResult: {
                                            ...prev.finalAppraisalResult!,
                                            finalRating: Number(e.target.value)
                                        }
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea
                                id="summary"
                                value={formData.finalAppraisalResult?.summary}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    finalAppraisalResult: {
                                        ...prev.finalAppraisalResult!,
                                        summary: e.target.value
                                    }
                                }))}
                                placeholder="Overall performance summary..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="flex-1">
                            Save Performance Review
                        </Button>
                        <Button onClick={() => handleGenerateReport()} type="button" variant="outline" className="flex-1">
                            Generate Report
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};