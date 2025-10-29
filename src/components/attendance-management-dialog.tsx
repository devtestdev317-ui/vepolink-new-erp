import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { TrainingProgram, TrainingAttendance } from '@/types/training';
import { Download, Mail, UserCheck, UserX, Clock } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
interface AttendanceManagementDialogProps {
    training: TrainingProgram | null;
    attendance: TrainingAttendance[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AttendanceManagementDialog: React.FC<AttendanceManagementDialogProps> = ({
    training,
    attendance,
    open,
    onOpenChange,
}) => {
    if (!training) return null;

    const trainingAttendance = attendance.filter(att => att.trainingProgramId === training.id);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return <UserCheck className="h-4 w-4 text-green-600" />;
            case 'absent': return <UserX className="h-4 w-4 text-red-600" />;
            case 'late': return <Clock className="h-4 w-4 text-orange-600" />;
            default: return null;
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'present': return 'default';
            case 'absent': return 'destructive';
            case 'late': return 'secondary';
            default: return 'outline';
        }
    };
    const handleExportAttendance = async () => {
        // Create workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        // Add headers with black background
        const headerRow = worksheet.addRow(['Employee Name', 'Department', 'Status', 'Rating', 'Feedback']);
        headerRow.border = {
            top: { style: 'thin', color: { argb: 'FFb7d4ff' } },
            left: { style: 'thin', color: { argb: 'FFb7d4ff' } },
            bottom: { style: 'thin', color: { argb: 'FFb7d4ff' } },
            right: { style: 'thin', color: { argb: 'FFb7d4ff' } }
        };
        // Style header row - BLACK BACKGROUND
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2b7fff' } // Black
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }, // White text
                size: 12,


            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center'
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Set row height for header
        headerRow.height = 25;
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        trainingAttendance.forEach(att => {
            const row = worksheet.addRow([
                att.employeeName,
                att.department,
                att.attendanceStatus,
                att.rating || 'N/A',
                att.feedback || 'No feedback'
            ]);

            // Style data rows
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFb7d4ff' } },
                    left: { style: 'thin', color: { argb: 'FFb7d4ff' } },
                    bottom: { style: 'thin', color: { argb: 'FFb7d4ff' } },
                    right: { style: 'thin', color: { argb: 'FFb7d4ff' } }
                };

            });
            row.height = 25;
            row.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Set column widths
        worksheet.columns = [
            { width: 25 },
            { width: 20 },
            { width: 17 },
            { width: 15 },
            { width: 50 }
        ];

        // Add auto-filter
        worksheet.autoFilter = {
            from: 'A1',
            to: `E${trainingAttendance.length + 1}`
        };

        // Freeze header row
        worksheet.views = [
            { state: 'frozen', ySplit: 1 }
        ];

        // Generate and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, `${training.title.replace(/\s+/g, '_')}_attendance.xlsx`);
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent style={{ maxWidth: '992px', width: '100%' }} >
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Attendance - {training.title}</span>
                        <Button variant="outline" size="sm" className='md:mt-4' onClick={handleExportAttendance}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </DialogTitle>
                    <DialogDescription>
                        Manage and track attendance for this training program
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Attendance Summary */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {trainingAttendance.filter(att => att.attendanceStatus === 'present').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Present</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {trainingAttendance.filter(att => att.attendanceStatus === 'late').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Late</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {trainingAttendance.filter(att => att.attendanceStatus === 'absent').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Absent</div>
                        </div>
                    </div>

                    {/* Attendance Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Completion</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Certificate</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trainingAttendance.map(attendance => (
                                <TableRow key={attendance.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{attendance.employeeName}</div>
                                            <div className="text-sm text-muted-foreground">{attendance.employeeId}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{attendance.department}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(attendance.attendanceStatus)}
                                            <Badge variant={getStatusVariant(attendance.attendanceStatus)}>
                                                {attendance.attendanceStatus}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {attendance.completionStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {attendance.rating ? (
                                            <div className="flex items-center gap-1">
                                                <span>{attendance.rating}/5</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">No rating</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {attendance.certificateIssued ? (
                                            <Badge variant="default">Issued</Badge>
                                        ) : (
                                            <Badge variant="outline">Pending</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {trainingAttendance.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No attendance records found for this training program.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};