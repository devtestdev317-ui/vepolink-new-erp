import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { TrainingProgram } from '@/types/training';

interface TrainingFormProps {
  onSubmit: (data: TrainingProgram) => void;
  editingTraining?: TrainingProgram | null;
}

export const TrainingForm: React.FC<TrainingFormProps> = ({ onSubmit, editingTraining }) => {
  const [formData, setFormData] = useState<Partial<TrainingProgram>>({
    title: '',
    description: '',
    trainer: '',
    trainerEmail: '',
    trainerSpecialization: '',
    duration: 1,
    cost: 0,
    startDate: new Date(),
    endDate: new Date(),
    maxParticipants: 20,
    category: 'technical',
    status: 'draft'
  });

  React.useEffect(() => {
    if (editingTraining) {
      setFormData({
        ...editingTraining,
        startDate: new Date(editingTraining.startDate),
        endDate: new Date(editingTraining.endDate)
      });
    }
  }, [editingTraining]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trainingData: TrainingProgram = {
      id: editingTraining?.id || `training-${Date.now()}`,
      createdDate: new Date(),
      ...formData
    } as TrainingProgram;

    onSubmit(trainingData);
    
    if (!editingTraining) {
      // Reset form if not editing
      setFormData({
        title: '',
        description: '',
        trainer: '',
        trainerEmail: '',
        trainerSpecialization: '',
        duration: 1,
        cost: 0,
        startDate: new Date(),
        endDate: new Date(),
        maxParticipants: 20,
        category: 'technical',
        status: 'draft'
      });
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [field]: date }));
      
      // Auto-calculate duration
      if (field === 'startDate' && formData.endDate) {
        const diffTime = Math.abs(formData.endDate.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, duration: diffDays + 1 }));
      } else if (field === 'endDate' && formData.startDate) {
        const diffTime = Math.abs(date.getTime() - formData.startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, duration: diffDays + 1 }));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingTraining ? 'Edit Training Program' : 'Plan New Training Program'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Training Program Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter training program title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                defaultValue={formData.category}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Skills</SelectItem>
                  <SelectItem value="soft-skills">Soft Skills</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the training program objectives and content"
              rows={3}
            />
          </div>

          {/* Trainer Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainer">Trainer Name *</Label>
              <Input
                id="trainer"
                value={formData.trainer}
                onChange={(e) => setFormData(prev => ({ ...prev, trainer: e.target.value }))}
                placeholder="Enter trainer name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trainerEmail">Trainer Email</Label>
              <Input
                id="trainerEmail"
                type="email"
                value={formData.trainerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, trainerEmail: e.target.value }))}
                placeholder="Enter trainer email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trainerSpecialization">Specialization</Label>
              <Input
                id="trainerSpecialization"
                value={formData.trainerSpecialization}
                onChange={(e) => setFormData(prev => ({ ...prev, trainerSpecialization: e.target.value }))}
                placeholder="Trainer specialization"
              />
            </div>
          </div>

          {/* Schedule & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleDateChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
                min="1"
              />
            </div>
          </div>

          {/* Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost (₹)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                placeholder="Enter training cost"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={formData.status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {editingTraining ? 'Update Training Program' : 'Schedule Training Program'}
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};