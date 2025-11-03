import React, { useState } from 'react';
import type { CalendarEvent, CreateEventData } from '@/types/employee-engagement';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface AddEventFormProps {
    onSubmit: (eventData: CreateEventData) => void;
    onCancel?: () => void;
    initialData?: Partial<CalendarEvent>;
    isEditing?: boolean;
}

export const AddEventForm: React.FC<AddEventFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
    isEditing = false
}) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        date: initialData?.date || new Date(),
        type: (initialData?.type as CalendarEvent['type']) || 'custom',
        employeeName: initialData?.employeeName || '',
        description: initialData?.description || '',
        isRecurring: initialData?.isRecurring || false
    });

    const [date, setDate] = useState<Date | undefined>(formData.date);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !date) return;

        onSubmit({
            ...formData,
            date: date
        });
    };

    const eventTypes = [
        { value: 'festival', label: 'Festival', description: 'Company-wide celebrations' },
        { value: 'birthday', label: 'Birthday', description: 'Employee birthdays' },
        { value: 'anniversary', label: 'Work Anniversary', description: 'Employment milestones' },
        { value: 'custom', label: 'Custom Event', description: 'Other events' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {/* Event Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter event title"
                        required
                    />
                </div>

                {/* Event Type */}
                <div className="space-y-2">
                    <Label htmlFor="type">Event Type *</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(value: CalendarEvent['type']) =>
                            setFormData(prev => ({ ...prev, type: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {eventTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                    <div className="flex flex-col">
                                        <span>{type.label}</span>
                                        <span className="text-xs text-gray-500">{type.description}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Picker */}
                <div className="space-y-2">
                    <Label>Event Date *</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Employee Name (for birthdays/anniversaries) */}
                {(formData.type === 'birthday' || formData.type === 'anniversary') && (
                    <div className="space-y-2">
                        <Label htmlFor="employeeName">Employee Name *</Label>
                        <Input
                            id="employeeName"
                            value={formData.employeeName}
                            onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                            placeholder="Enter employee name"
                            required
                        />
                    </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter event description"
                        rows={3}
                    />
                </div>

                {/* Recurring Event */}
                <div className="flex items-center space-x-2">
                    <Switch
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onCheckedChange={(checked) =>
                            setFormData(prev => ({ ...prev, isRecurring: checked }))
                        }
                    />
                    <Label htmlFor="isRecurring">Recurring event (repeat yearly)</Label>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                )}
                <Button type="submit" className="flex-1">
                    {isEditing ? 'Update Event' : 'Create Event'}
                </Button>
            </div>
        </form>
    );
};