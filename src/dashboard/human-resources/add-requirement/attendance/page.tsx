
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AttendanceRecordForm from '@/components/attendance/AttendanceRecordForm';
import LeaveApplicationForm from '@/components/attendance/LeaveApplicationForm';
import AttendanceSummary from '@/components/attendance/AttendanceSummary';
import LeaveBalances from '@/components/attendance/LeaveBalances';
import type { AttendanceRecord, LeaveBalance, MonthlySummary, LeaveType, ApprovalStatus } from '@/types/attendance';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
const AttendancePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('attendance');
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [leaveBalances, setLeaveBalances] = useState<LeaveBalance>({
        cl: 12,
        pl: 15,
        sl: 10,
        carriedForward: 5
    });

    const monthlySummary: MonthlySummary = {
        month: 'November 2024',
        workingDays: 22,
        presentDays: 18,
        leaveDays: 2,
        totalOTHours: 12.5
    };

    const handleAddAttendance = (data: Omit<AttendanceRecord, 'id' | 'employeeId' | 'approvalStatus'>) => {
        const newRecord: AttendanceRecord = {
            ...data,
            id: Date.now().toString(),
            employeeId: 'emp-001',
            approvalStatus: 'Pending'
        };
        setAttendanceRecords(prev => [...prev, newRecord]);
    };

    const handleApplyLeave = (data: {
        leaveType: LeaveType;
        fromDate: Date;
        toDate: Date;
        reason: string;
    }) => {
        const newRecord: AttendanceRecord = {
            id: Date.now().toString(),
            attendanceDate: data.fromDate,
            shift: 'Morning',
            inTime: '09:00',
            outTime: '18:00',
            otHours: 0,
            leaveType: data.leaveType,
            fromDate: data.fromDate,
            toDate: data.toDate,
            reason: data.reason,
            approvalStatus: 'Pending',
            employeeId: 'emp-001'
        };
        setAttendanceRecords(prev => [...prev, newRecord]);

        // Update leave balances
        const days = Math.ceil((data.toDate.getTime() - data.fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        setLeaveBalances(prev => ({
            ...prev,
            [data.leaveType.toLowerCase() as keyof Omit<LeaveBalance, 'carriedForward'>]:
                Math.max(0, prev[data.leaveType.toLowerCase() as keyof Omit<LeaveBalance, 'carriedForward'>] - days)
        }));
    };

    const handleApproveReject = (recordId: string, status: ApprovalStatus) => {
        setAttendanceRecords(prev =>
            prev.map(record =>
                record.id === recordId ? { ...record, approvalStatus: status } : record
            )
        );
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Attendance & Leave Management</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <ScrollArea className="w-full rounded-md border whitespace-nowrap">
                    <TabsList className="flex w-full whitespace-nowrap">
                        <TabsTrigger value="attendance" className="flex-1">Attendance</TabsTrigger>
                        <TabsTrigger value="leave" className="flex-1">Leave Application</TabsTrigger>
                        <TabsTrigger value="summary" className="flex-1">Monthly Summary</TabsTrigger>
                        <TabsTrigger value="balances" className="flex-1">Leave Balances</TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <TabsContent value="attendance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Record Attendance</CardTitle>
                                <CardDescription>Add new attendance record</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AttendanceRecordForm onSubmit={handleAddAttendance} />
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Recent Records</CardTitle>
                                <CardDescription>Your recent attendance entries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AttendanceSummary
                                    records={attendanceRecords}
                                    onApproveReject={handleApproveReject}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="leave" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Apply for Leave</CardTitle>
                                <CardDescription>Submit a new leave application</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LeaveApplicationForm
                                    onSubmit={handleApplyLeave}
                                    balances={leaveBalances}
                                />
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Leave Applications</CardTitle>
                                <CardDescription>Your leave application history</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LeaveBalances
                                    records={attendanceRecords.filter(r => r.leaveType)}
                                    balances={leaveBalances}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="summary">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Attendance Summary</CardTitle>
                            <CardDescription>Overview of your attendance for the month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{monthlySummary.workingDays}</div>
                                    <div className="text-sm text-gray-600">Working Days</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{monthlySummary.presentDays}</div>
                                    <div className="text-sm text-gray-600">Present Days</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{monthlySummary.leaveDays}</div>
                                    <div className="text-sm text-gray-600">Leave Days</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{monthlySummary.totalOTHours}</div>
                                    <div className="text-sm text-gray-600">OT Hours</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="balances">
                    <Card>
                        <CardHeader>
                            <CardTitle>Leave Balances</CardTitle>
                            <CardDescription>Your current leave entitlements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 border rounded-lg bg-blue-50">
                                    <div className="text-2xl font-bold text-blue-600">{leaveBalances.cl}</div>
                                    <div className="text-sm text-gray-600">Casual Leave</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg bg-green-50">
                                    <div className="text-2xl font-bold text-green-600">{leaveBalances.pl}</div>
                                    <div className="text-sm text-gray-600">Privileged Leave</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg bg-orange-50">
                                    <div className="text-2xl font-bold text-orange-600">{leaveBalances.sl}</div>
                                    <div className="text-sm text-gray-600">Sick Leave</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg bg-purple-50">
                                    <div className="text-2xl font-bold text-purple-600">{leaveBalances.carriedForward}</div>
                                    <div className="text-sm text-gray-600">Carried Forward</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AttendancePage;