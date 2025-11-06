import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart3, Clock, CheckCircle, Users, Eye, Trophy } from 'lucide-react';
import type { Survey, SurveyAnswer } from '@/types/employee-engagement';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { JSX } from 'react/jsx-runtime';

interface SurveysSectionProps {
    surveys: Survey[];
    onSubmitSurvey: (surveyId: string, answers: SurveyAnswer[]) => void;
    onViewResults: (surveyId: string) => any;
    hasUserResponded: (surveyId: string) => boolean;
}

export const SurveysSection: React.FC<SurveysSectionProps> = ({
    surveys,
    onSubmitSurvey,
    onViewResults,
    hasUserResponded
}) => {
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [surveyAnswers, setSurveyAnswers] = useState<{ [key: string]: any }>({});
    const [activeResultsTab, setActiveResultsTab] = useState<string>('');

    const getStatusIcon = (status: Survey['status']) => {
        return status === 'active' ?
            <Clock className="h-4 w-4 text-green-500" /> :
            <CheckCircle className="h-4 w-4 text-gray-500" />;
    };

    const getStatusVariant = (status: Survey['status']) => {
        return status === 'active' ? 'default' : 'secondary';
    };

    const handleAnswerChange = (questionId: string, answer: any) => {
        setSurveyAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmitSurvey = () => {
        if (!selectedSurvey) return;

        const answers: SurveyAnswer[] = Object.entries(surveyAnswers).map(([questionId, answer]) => ({
            questionId,
            answer
        }));

        // Validate required questions
        const missingRequired = selectedSurvey.questions.filter(
            q => q.required && !surveyAnswers[q.id]
        );

        if (missingRequired.length > 0) {
            alert(`Please answer all required questions: ${missingRequired.map(q => q.question).join(', ')}`);
            return;
        }

        onSubmitSurvey(selectedSurvey.id, answers);
        setSelectedSurvey(null);
        setSurveyAnswers({});
    };

    const renderQuestionInput = (question: Survey['questions'][0]) => {
        switch (question.type) {
            case 'rating':
                return (
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>1 - Strongly Disagree</span>
                            <span>5 - Strongly Agree</span>
                        </div>
                        <div className="flex space-x-2 justify-center">
                            {[1, 2, 3, 4, 5].map(rating => (
                                <Button
                                    key={rating}
                                    type="button"
                                    variant={surveyAnswers[question.id] === rating.toString() ? "default" : "outline"}
                                    size="sm"
                                    className="w-12 h-12 text-lg font-semibold"
                                    onClick={() => handleAnswerChange(question.id, rating.toString())}
                                >
                                    {rating}
                                </Button>
                            ))}
                        </div>
                    </div>
                );

            case 'multiple-choice':
                return (
                    <div className="space-y-3">
                        {question.options?.map(option => (
                            <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={Array.isArray(surveyAnswers[question.id]) && surveyAnswers[question.id].includes(option)}
                                    onChange={(e) => {
                                        const currentAnswers = Array.isArray(surveyAnswers[question.id]) ? surveyAnswers[question.id] : [];
                                        const newAnswers = e.target.checked
                                            ? [...currentAnswers, option]
                                            : currentAnswers.filter((a: string) => a !== option);
                                        handleAnswerChange(question.id, newAnswers);
                                    }}
                                    className="rounded border-gray-300"
                                />
                                <span className="flex-1">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'text':
                return (
                    <textarea
                        value={surveyAnswers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
                        placeholder="Share your thoughts..."
                    />
                );

            default:
                return null;
        }
    };

    const renderSurveyResults = (surveyId: string) => {
        const results = onViewResults(surveyId);
        if (!results) return <div>No results available</div>;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-3">
                                <Users className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="text-2xl font-bold">{results.totalResponses}</p>
                                    <p className="text-sm text-gray-600">Total Responses</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-3">
                                <Trophy className="h-8 w-8 text-yellow-500" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {results.questionResults[0]?.summary?.average || '0'}/5
                                    </p>
                                    <p className="text-sm text-gray-600">Average Rating</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-3">
                                <BarChart3 className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {Math.round((results.totalResponses / 50) * 100)}%
                                    </p>
                                    <p className="text-sm text-gray-600">Participation Rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs value={activeResultsTab} onValueChange={setActiveResultsTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="ratings">Ratings</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-6">
                        {results.questionResults.map((result: { question: { id: React.Key | null | undefined; question: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; type: string; }; summary: { average: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; distribution: any[]; map: (arg0: (item: any) => JSX.Element) => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; responses: any[]; }, index: number) => (
                            <Card key={result.question.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {index + 1}. {result.question.question}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {result.question.type === 'rating' && result.summary && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {result.summary.average}/5
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    Average Rating
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {result.summary.distribution.map((dist) => (
                                                    <div key={dist.rating} className="flex items-center space-x-3">
                                                        <span className="w-4 text-sm font-medium">{dist.rating}</span>
                                                        <Progress
                                                            value={(dist.count / results.totalResponses) * 100}
                                                            className="flex-1"
                                                        />
                                                        <span className="w-12 text-sm text-gray-600 text-right">
                                                            {dist.count} ({Math.round((dist.count / results.totalResponses) * 100)}%)
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {result.question.type === 'multiple-choice' && result.summary && (
                                        <div className="space-y-3">
                                            {result.summary.map((item: any) => (
                                                <div key={item.option} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <span>{item.option}</span>
                                                    <div className="flex items-center space-x-3">
                                                        <Progress
                                                            value={(item.count / results.totalResponses) * 100}
                                                            className="w-24"
                                                        />
                                                        <span className="text-sm font-medium w-12">
                                                            {item.count} ({Math.round((item.count / results.totalResponses) * 100)}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {result.question.type === 'text' && (
                                        <div className="space-y-3 max-h-60 overflow-y-auto">
                                            {result.responses
                                                .filter(r => r.answer && r.answer.trim())
                                                .map((response, idx) => (
                                                    <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                                                        <p className="text-sm">{response.answer}</p>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Employee Surveys</h2>
                    <p className="text-gray-600">Share your feedback to help improve our workplace</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {surveys.map(survey => {
                    const userResponded = hasUserResponded(survey.id);
                    const results = onViewResults(survey.id);

                    return (
                        <Card key={survey.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex flex-wrap items-start justify-between">
                                    <div className="md:flex-1 w-full">
                                        <CardTitle className="md:text-lg text-sm flex items-center space-x-2">
                                            <BarChart3 className="h-5 w-5 text-blue-500" />
                                            <span>{survey.title}</span>
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            {survey.description}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={getStatusVariant(survey.status)} className="md:ml-2 ml-auto">
                                        {getStatusIcon(survey.status)}
                                        <span className="ml-1">{survey.status}</span>
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Questions: {survey.questions.length}</span>
                                        <span>Created: {format(survey.createdAt, 'MMM d, yyyy')}</span>
                                    </div>

                                    {results && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Users className="h-4 w-4" />
                                            <span>{results.totalResponses} responses</span>
                                        </div>
                                    )}

                                    <div className="flex space-x-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant={userResponded ? "outline" : "default"}
                                                    disabled={survey.status === 'closed' || userResponded}
                                                    className="flex-1"
                                                >
                                                    {userResponded ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Completed
                                                        </>
                                                    ) : (
                                                        'Take Survey'
                                                    )}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl block w-[90%] max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className='text-left'>{survey.title}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-5 mt-2">
                                                    <p className="text-gray-600">{survey.description}</p>

                                                    <div className="space-y-6">
                                                        {survey.questions.map((question, index) => (
                                                            <div key={question.id} className="p-4 border rounded-lg space-y-3">
                                                                <h4 className="font-medium">
                                                                    {index + 1}. {question.question}
                                                                    {question.required && <span className="text-red-500 ml-1">*</span>}
                                                                </h4>
                                                                {renderQuestionInput(question)}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <DialogFooter>
                                                        <Button onClick={handleSubmitSurvey} className="w-full">
                                                            Submit Survey
                                                        </Button>
                                                    </DialogFooter>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {results && results.totalResponses > 0 && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="flex items-center space-x-2">
                                                        <Eye className="h-4 w-4" />
                                                        <span>Results</span>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Survey Results: {survey.title}</DialogTitle>
                                                    </DialogHeader>
                                                    {renderSurveyResults(survey.id)}
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {surveys.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Surveys Available</h3>
                        <p className="text-gray-600">Check back later for new surveys.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};