// types/attendance.ts
export type LeaveType = 'CL' | 'PL' | 'SL';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type Shift = 'Morning' | 'Evening' | 'Night';

export interface AttendanceRecord {
  id: string;
  attendanceDate: Date;
  shift: Shift;
  inTime: string;
  outTime: string;
  otHours: number;
  leaveType?: LeaveType;
  fromDate?: Date;
  toDate?: Date;
  reason?: string;
  approvalStatus: ApprovalStatus;
  employeeId: string;
}

export interface LeaveBalance {
  cl: number;
  pl: number;
  sl: number;
  carriedForward: number;
}

export interface MonthlySummary {
  month: string;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  totalOTHours: number;
}