import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TrainingProgram } from '@/types/training';
import { Eye, Edit, Users, Calendar, IndianRupee } from 'lucide-react';

interface TrainingListProps {
  trainingPrograms: TrainingProgram[];
  onEdit: (training: TrainingProgram) => void;
  onView: (training: TrainingProgram) => void;
  onManageAttendance: (training: TrainingProgram) => void;
}

export const TrainingList: React.FC<TrainingListProps> = ({
  trainingPrograms,
  onEdit,
  onView,
  onManageAttendance
}) => {
  const getStatusVariant = (status: TrainingProgram['status']) => {
    switch (status) {
      case 'scheduled': return 'secondary';
      case 'ongoing': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category: TrainingProgram['category']) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'soft-skills': return 'bg-green-100 text-green-800';
      case 'leadership': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Programs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Training Program</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainingPrograms.map(training => (
              <TableRow key={training.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{training.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {training.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getCategoryColor(training.category)}>
                    {training.category.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{training.trainer}</div>
                    <div className="text-sm text-muted-foreground">
                      {training.trainerSpecialization}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(training.startDate).toLocaleDateString()} - {' '}
                      {new Date(training.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{training.duration} days</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    <span>{training.cost.toLocaleString('en-IN')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(training.status)}>
                    {training.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView(training)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit(training)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onManageAttendance(training)}
                      disabled={training.status === 'draft'}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};