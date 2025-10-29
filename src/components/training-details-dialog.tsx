import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TrainingProgram } from '@/types/training';
import { Calendar, Users, IndianRupee, Mail, Clock } from 'lucide-react';

interface TrainingDetailsDialogProps {
    training: TrainingProgram | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (training: TrainingProgram) => void;
}

export const TrainingDetailsDialog: React.FC<TrainingDetailsDialogProps> = ({
    training,
    open,
    onOpenChange,
}) => {
    if (!training) return null;

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent style={{ maxWidth: '992px', width: '100%' }}>
                <DialogHeader className='border-b pb-3'>
                    <DialogTitle className="flex items-center gap-x-5 mb-0">
                        <span>{training.title}</span>
                        <Badge variant={getStatusVariant(training.status)}>
                            {training.status.toUpperCase()}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Training program details and information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground">{training.description}</p>
                    </div>

                    {/* Schedule & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-accent p-3">
                        <div className="space-y-3">
                            <h4 className="font-semibold">Schedule & Details</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {training.startDate.toLocaleDateString()} - {training.endDate.toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{training.duration} days</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>Max {training.maxParticipants} participants</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>{training.cost.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Trainer Information */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Trainer Information</h4>
                            <div className="space-y-2">
                                <div className="font-medium">{training.trainer}</div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>{training.trainerEmail}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {training.trainerSpecialization}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <h4 className="font-semibold mb-2">Category</h4>
                        <Badge variant="outline" className={getCategoryColor(training.category)}>
                            {training.category.replace('-', ' ')}
                        </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t justify-end">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};