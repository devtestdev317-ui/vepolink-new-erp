import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Target } from 'lucide-react';
import { format } from 'date-fns';
import type{ Goal } from '@/types/performance';
import { cn } from '@/lib/utils';

interface GoalsTrackingProps {
  employeeId?: string;
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
}

export const GoalsTracking: React.FC<GoalsTrackingProps> = ({
  employeeId,
  goals,
  onGoalsUpdate
}) => {
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    employeeId: employeeId || '',
    title: '',
    description: '',
    category: 'work',
    startDate: new Date(),
    endDate: new Date(),
    target: '',
    progress: 0,
    status: 'not-started',
    weightage: 0
  });

  const addGoal = () => {
    if (newGoal.title && newGoal.description) {
      const goal: Goal = {
        ...newGoal,
        id: `goal-${Date.now()}`,
        employeeId: employeeId || newGoal.employeeId
      };
      onGoalsUpdate([...goals, goal]);
      setNewGoal({
        employeeId: employeeId || '',
        title: '',
        description: '',
        category: 'work',
        startDate: new Date(),
        endDate: new Date(),
        target: '',
        progress: 0,
        status: 'not-started',
        weightage: 0
      });
    }
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId
        ? {
            ...goal,
            progress: Math.min(100, Math.max(0, progress)),
            status: (progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started') as Goal['status']
          }
        : goal
    );
    onGoalsUpdate(updatedGoals);
  };

  const deleteGoal = (goalId: string) => {
    onGoalsUpdate(goals.filter(goal => goal.id !== goalId));
  };

  const getStatusVariant = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'behind-schedule': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goals Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Goal */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter goal title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newGoal.category} 
                  onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="learning">Learning & Development</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="stretch">Stretch Goal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the goal in detail..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newGoal.startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newGoal.startDate}
                      onSelect={(date) => setNewGoal(prev => ({ ...prev, startDate: date! }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newGoal.endDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newGoal.endDate}
                      onSelect={(date) => setNewGoal(prev => ({ ...prev, endDate: date! }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightage">Weightage (%)</Label>
                <Input
                  id="weightage"
                  type="number"
                  value={newGoal.weightage}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, weightage: Number(e.target.value) }))}
                  placeholder="0-100"
                />
              </div>
            </div>

            <Button type="button" onClick={addGoal} className="mt-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </CardContent>
        </Card>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{goal.title}</h4>
                      <Badge variant={getStatusVariant(goal.status)}>
                        {goal.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{goal.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Target: {goal.target}</span>
                      <span>Weightage: {goal.weightage}%</span>
                      <span>
                        Period: {format(goal.startDate, 'MMM dd')} - {format(goal.endDate, 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                      className="w-20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                    >
                      +10%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 25))}
                    >
                      +25%
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};