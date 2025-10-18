// components/attendance/AttendanceSummary.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type{ AttendanceRecord, ApprovalStatus } from '@/types/attendance';

interface AttendanceSummaryProps {
  records: AttendanceRecord[];
  onApproveReject: (recordId: string, status: ApprovalStatus) => void;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ records, onApproveReject }) => {
  const getStatusVariant = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>In-Time</TableHead>
            <TableHead>Out-Time</TableHead>
            <TableHead>OT Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{format(record.attendanceDate, 'dd/MM/yyyy')}</TableCell>
              <TableCell>{record.shift}</TableCell>
              <TableCell>{record.inTime}</TableCell>
              <TableCell>{record.outTime}</TableCell>
              <TableCell>{record.otHours}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(record.approvalStatus)}>
                  {record.approvalStatus}
                </Badge>
              </TableCell>
              <TableCell>
                {record.approvalStatus === 'Pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onApproveReject(record.id, 'Approved')}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onApproveReject(record.id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No attendance records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceSummary;