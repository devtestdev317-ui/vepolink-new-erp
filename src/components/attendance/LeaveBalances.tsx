// components/attendance/LeaveBalances.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { AttendanceRecord, LeaveBalance, ApprovalStatus } from '@/types/attendance';

interface LeaveBalancesProps {
  records: AttendanceRecord[];
  balances: LeaveBalance;
}

const LeaveBalances: React.FC<LeaveBalancesProps> = ({ records, balances }) => {
  const getStatusVariant = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-4 border rounded-lg bg-blue-50">
          <div className="text-2xl font-bold text-blue-600">{balances.cl}</div>
          <div className="text-sm text-gray-600">CL Available</div>
        </div>
        <div className="text-center p-4 border rounded-lg bg-green-50">
          <div className="text-2xl font-bold text-green-600">{balances.pl}</div>
          <div className="text-sm text-gray-600">PL Available</div>
        </div>
        <div className="text-center p-4 border rounded-lg bg-orange-50">
          <div className="text-2xl font-bold text-orange-600">{balances.sl}</div>
          <div className="text-sm text-gray-600">SL Available</div>
        </div>
        <div className="text-center p-4 border rounded-lg bg-purple-50">
          <div className="text-2xl font-bold text-purple-600">{balances.carriedForward}</div>
          <div className="text-sm text-gray-600">Carried Forward</div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leave Type</TableHead>
              <TableHead>From Date</TableHead>
              <TableHead>To Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.leaveType}</TableCell>
                <TableCell>{record.fromDate && format(record.fromDate, 'dd/MM/yyyy')}</TableCell>
                <TableCell>{record.toDate && format(record.toDate, 'dd/MM/yyyy')}</TableCell>
                <TableCell className="max-w-xs truncate">{record.reason}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(record.approvalStatus)}>
                    {record.approvalStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No leave applications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeaveBalances;