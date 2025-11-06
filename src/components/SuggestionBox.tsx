import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare, Plus, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import type { Suggestion } from '@/types/employee-engagement';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SuggestionBoxProps {
    suggestions: Suggestion[];
    onAddSuggestion: (suggestion: Omit<Suggestion, 'id' | 'createdAt' | 'status'>) => void;
}

const getStatusIcon = (status: Suggestion['status']) => {
    switch (status) {
        case 'submitted':
            return <Clock className="h-4 w-4 text-blue-500" />;
        case 'in-review':
            return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        case 'implemented':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'rejected':
            return <XCircle className="h-4 w-4 text-red-500" />;
        default:
            return null;
    }
};

const getStatusVariant = (status: Suggestion['status']) => {
    switch (status) {
        case 'submitted':
            return 'secondary';
        case 'in-review':
            return 'default';
        case 'implemented':
            return 'default';
        case 'rejected':
            return 'secondary';
        default:
            return 'secondary';
    }
};

export const SuggestionBox: React.FC<SuggestionBoxProps> = ({ suggestions, onAddSuggestion }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general' as Suggestion['category'],
        submittedBy: 'Anonymous'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddSuggestion(formData);
        setFormData({
            title: '',
            description: '',
            category: 'general',
            submittedBy: 'Anonymous'
        });
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between">
                <div className='mb-3'>
                    <h2 className="text-2xl font-bold text-gray-900">Suggestion Box</h2>
                    <p className="text-gray-600">Share your ideas to improve our workplace</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Suggestion
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Submit New Suggestion</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Brief title of your suggestion"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value: Suggestion['category']) =>
                                        setFormData(prev => ({ ...prev, category: value }))
                                    }
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="work-environment">Work Environment</SelectItem>
                                        <SelectItem value="benefits">Benefits</SelectItem>
                                        <SelectItem value="events">Events</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Detailed description of your suggestion..."
                                    rows={4}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Submitted By (Optional)</label>
                                <Input
                                    value={formData.submittedBy}
                                    onChange={(e) => setFormData(prev => ({ ...prev, submittedBy: e.target.value }))}
                                    placeholder="Your name or leave as Anonymous"
                                />
                            </div>

                            <Button type="submit" className="w-full">Submit Suggestion</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                {suggestions.map(suggestion => (
                    <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg flex items-center space-x-2">
                                        <MessageSquare className="h-5 w-5 text-blue-500" />
                                        <span>{suggestion.title}</span>
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {suggestion.description}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <Badge variant="outline">{suggestion.category}</Badge>
                                    <Badge variant={getStatusVariant(suggestion.status)}>
                                        {getStatusIcon(suggestion.status)}
                                        <span className="ml-1 capitalize">{suggestion.status.replace('-', ' ')}</span>
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>By: {suggestion.submittedBy}</span>
                                <span>Submitted: {format(suggestion.createdAt, 'MMM d, yyyy')}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {suggestions.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Suggestions Yet</h3>
                        <p className="text-gray-600 mb-4">Be the first to share your ideas!</p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Suggestion
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};