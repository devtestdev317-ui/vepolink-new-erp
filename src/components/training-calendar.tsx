import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Event, View } from 'react-big-calendar';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { TrainingProgram, TrainingSession } from '@/types/training';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface TrainingCalendarProps {
    trainingPrograms: TrainingProgram[];
    trainingSessions: TrainingSession[];
    onViewTraining: (training: TrainingProgram) => void;
    onEditTraining: (training: TrainingProgram) => void;
}

export const TrainingCalendar: React.FC<TrainingCalendarProps> = ({
    trainingPrograms,
    trainingSessions,
    onViewTraining,
}) => {
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());

    const events: Event[] = [
        ...trainingPrograms.map(program => ({
            id: program.id,
            title: program.title,
            start: new Date(program.startDate),
            end: new Date(program.endDate),
            resource: program
        })),
        ...trainingSessions.map(session => ({
            id: session.id,
            title: session.topic,
            start: new Date(`${session.date}T${session.startTime}`),
            end: new Date(`${session.date}T${session.endTime}`),
            resource: session
        }))
    ];

    const getEventStyle = (event: Event) => {
        const program = event.resource as TrainingProgram;
        const backgroundColor =
            program.status === 'completed' ? '#10b981' :
                program.status === 'ongoing' ? '#f59e0b' :
                    program.status === 'scheduled' ? '#3b82f6' : '#6b7280';

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                color: 'white',
                border: 'none'
            }
        };
    };

    const CustomEvent = ({ event }: { event: Event }) => {
        const program = event.resource as TrainingProgram;
        return (
            <div className="p-1 text-xs">
                <div className="font-medium truncate">{event.title}</div>
                <div className="flex items-center gap-1 mt-1">
                    <Users className="h-3 w-3" />
                    <span>{program.trainer}</span>
                </div>
            </div>
        );
    };

    // Custom toolbar to handle navigation
    const CustomToolbar = (toolbar: any) => {
        const goToBack = () => {
            toolbar.onNavigate('PREV');
        };

        const goToNext = () => {
            toolbar.onNavigate('NEXT');
        };

        const goToCurrent = () => {
            toolbar.onNavigate('TODAY');
        };



        return (
            <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToBack}>
                        <ChevronLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToCurrent}>
                        Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNext}>
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <span className="text-lg font-semibold">
                    {toolbar.label}
                </span>

                <div className="flex gap-2">
                    <Button
                        variant={view === 'month' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toolbar.onView('month')}
                    >
                        Month
                    </Button>
                    <Button
                        variant={view === 'week' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toolbar.onView('week')}
                    >
                        Week
                    </Button>
                    <Button
                        variant={view === 'day' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toolbar.onView('day')}
                    >
                        Day
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Training Calendar</CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ height: '600px' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        view={view}
                        date={date}
                        onView={setView}
                        onNavigate={setDate}
                        eventPropGetter={getEventStyle}
                        components={{
                            event: CustomEvent,
                            toolbar: CustomToolbar
                        }}
                        onSelectEvent={(event) => {
                            const program = event.resource as TrainingProgram;
                            onViewTraining(program);
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
};