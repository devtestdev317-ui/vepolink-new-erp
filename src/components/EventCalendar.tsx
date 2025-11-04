import React, { useState } from 'react';
//  isToday, isThisMonth
import { format} from 'date-fns';
import { Calendar as CalendarIcon, Cake, Star, PartyPopper, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { CalendarEvent, CreateEventData } from '@/types/employee-engagement';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AddEventForm } from './AddEventForm';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface EventCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (eventData: CreateEventData) => void;
  onUpdateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  onDeleteEvent: (eventId: string) => void;
}

const getEventIcon = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'birthday':
      return <Cake className="h-4 w-4 text-pink-500" />;
    case 'anniversary':
      return <Star className="h-4 w-4 text-yellow-500" />;
    case 'festival':
      return <PartyPopper className="h-4 w-4 text-green-500" />;
    default:
      return <CalendarIcon className="h-4 w-4 text-blue-500" />;
  }
};

const getEventColor = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'birthday':
      return 'bg-pink-50 border-pink-200 text-pink-700';
    case 'anniversary':
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    case 'festival':
      return 'bg-green-50 border-green-200 text-green-700';
    default:
      return 'bg-blue-50 border-blue-200 text-blue-700';
  }
};

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const dateEvents = events.filter(event =>
    selectedDate && event.date.toDateString() === selectedDate.toDateString()
  );

  const handleAddEvent = (eventData: CreateEventData) => {
    onAddEvent(eventData);
    setIsAddEventDialogOpen(false);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
  };

  const handleUpdateEvent = (eventData: CreateEventData) => {
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      onDeleteEvent(eventId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Event Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Calendar</h2>
          <p className="text-gray-600">View and manage company events, birthdays, and anniversaries</p>
        </div>
        
        <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <AddEventForm 
              onSubmit={handleAddEvent}
              onCancel={() => setIsAddEventDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            {editingEvent && (
              <AddEventForm
                onSubmit={handleUpdateEvent}
                onCancel={() => setEditingEvent(null)}
                initialData={editingEvent}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Event Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                event: events.map(event => event.date),
                today: new Date()
              }}
              modifiersStyles={{
                event: { backgroundColor: '#3b82f6', color: 'white' },
                today: { border: '2px solid #3b82f6' }
              }}
            />
          </CardContent>
        </Card>

        {/* Upcoming Events & Date Events */}
        <div className="space-y-6">
          {/* Date Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </span>
                {dateEvents.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    {dateEvents.length} event{dateEvents.length !== 1 ? 's' : ''}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No events scheduled for this date.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setIsAddEventDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {dateEvents.map(event => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${getEventColor(event.type)} relative group`}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <div className="flex items-center space-x-2 mb-1">
                        {getEventIcon(event.type)}
                        <span className="font-medium text-sm">{event.title}</span>
                      </div>
                      {event.employeeName && (
                        <p className="text-xs opacity-75">{event.employeeName}</p>
                      )}
                      {event.description && (
                        <p className="text-xs mt-1">{event.description}</p>
                      )}
                      {event.isRecurring && (
                        <p className="text-xs mt-1 text-blue-600">🔄 Recurring yearly</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming events.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-start space-x-3">
                      {getEventIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(event.date, 'MMM d, yyyy')}
                        </p>
                        {event.employeeName && (
                          <p className="text-xs text-gray-600">{event.employeeName}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};