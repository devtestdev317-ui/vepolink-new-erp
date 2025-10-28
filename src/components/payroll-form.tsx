import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PayrollRecord, AttendanceData } from '@/types/payroll';
import { PDFService } from '@/lib/pdf-service';
import { SalarySlipTemplate } from '@/components/salary-slip-template';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from 'lucide-react';
import { Separator } from './ui/separator';
interface PayrollFormProps {
    onSubmit: (data: PayrollRecord) => void;
    attendanceData?: AttendanceData[];
}

export const PayrollForm: React.FC<PayrollFormProps> = ({ onSubmit, attendanceData = [] }) => {

    const [open, setOpen] = React.useState(false)
    const [formData, setFormData] = useState<Partial<PayrollRecord>>({
        salaryMonth: new Date(),
        basic: 0,
        hra: 0,
        allowances: 0,
        deductions: 0,
        pf: 0,
        esi: 0,
        tds: 0,
        bonus: 0,
        reimbursements: 0,
        netPayable: 0,
        paymentMode: 'bank',
        status: 'draft'
    });

    const salarySlipRef = useRef<HTMLDivElement>(null);

    const [selectedEmployee, setSelectedEmployee] = useState<string>('');

    // Auto-calculate salary based on attendance
    const calculateSalaryFromAttendance = () => {
        if (!selectedEmployee || !attendanceData.length) return;

        const employeeData = attendanceData.find(emp => emp.employeeId === selectedEmployee);
        if (!employeeData) return;

        const attendanceRatio = employeeData.presentDays / employeeData.totalDays;
        const calculatedBasic = employeeData.basicSalary * attendanceRatio;
        const calculatedHRA = calculatedBasic * 0.4; // 40% of basic
        const calculatedPF = calculatedBasic * 0.12; // 12% of basic
        const calculatedESI = calculatedBasic * 0.0075; // 0.75% of basic

        const calculatedTDS = Math.max(0, (calculatedBasic + calculatedHRA - 50000) * 0.05); // Simplified TDS calculation

        const netPayable = calculatedBasic + calculatedHRA - calculatedPF - calculatedESI - calculatedTDS;

        setFormData(prev => ({
            ...prev,
            basic: calculatedBasic,
            hra: calculatedHRA,
            pf: calculatedPF,
            esi: calculatedESI,
            tds: calculatedTDS,
            netPayable
        }));
    };

    // Recalculate net payable when any amount changes
    useEffect(() => {
        const basic = formData.basic || 0;
        const hra = formData.hra || 0;
        const allowances = formData.allowances || 0;
        const deductions = formData.deductions || 0;
        const pf = formData.pf || 0;
        const esi = formData.esi || 0;
        const tds = formData.tds || 0;
        const bonus = formData.bonus || 0;
        const reimbursements = formData.reimbursements || 0;

        const netPayable = basic + hra + allowances + bonus + reimbursements - deductions - pf - esi - tds;

        setFormData(prev => ({ ...prev, netPayable }));
    }, [formData.basic, formData.hra, formData.allowances, formData.deductions, formData.pf, formData.esi, formData.tds, formData.bonus, formData.reimbursements]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.netPayable && formData.salaryMonth) {
            onSubmit({
                id: `payroll-${Date.now()}`,
                employeeId: selectedEmployee,
                employeeName: attendanceData.find(emp => emp.employeeId === selectedEmployee)?.employeeName || '',
                ...formData
            } as PayrollRecord);
        }
    };
    const handleGenerateSalarySlip = async () => {
        if (!formData.netPayable || !formData.salaryMonth) {
            alert('Please fill all required fields');
            return;
        }

        const payrollData: PayrollRecord = {
            id: `temp-${Date.now()}`,
            employeeId: selectedEmployee,
            employeeName: attendanceData.find(emp => emp.employeeId === selectedEmployee)?.employeeName || '',
            status: 'draft',
            ...formData
        } as PayrollRecord;

        try {
            if (salarySlipRef.current) {
                // Generate from HTML template
                await PDFService.generateSalarySlip(payrollData, salarySlipRef.current);
            } else {
                // Generate programmatically
                await PDFService.generateSalarySlip(payrollData);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating salary slip. Please try again.');
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Payroll & Compliance</span>
                    {/* <Badge variant={formData.status === 'draft' ? 'secondary' : 'default'}>
                        {formData.status?.toUpperCase()}
                    </Badge> */}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Employee Selection and Auto Calculation */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employee">Select Employee</Label>
                            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {attendanceData.map(emp => (
                                        <SelectItem key={emp.employeeId} value={emp.employeeId}>
                                            {emp.employeeName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="employee">Generate</Label>
                            <Button
                                type="button"
                                onClick={calculateSalaryFromAttendance}
                                disabled={!selectedEmployee}
                                variant="outline"
                            >
                                Auto Calculate from Attendance
                            </Button>
                        </div>
                    </div>
                    <Separator />

                    {/* Salary Month */}

                    {/* Earnings Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Salary Month</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-full justify-between font-normal"
                                    >
                                        {formData.salaryMonth ? formData.salaryMonth.toLocaleDateString() : "Select date"}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.salaryMonth}
                                        captionLayout="dropdown"
                                        onSelect={(date) => setFormData(prev => ({ ...prev, salaryMonth: date }))}
                                        className="rounded-md border"
                                    />
                                </PopoverContent>
                            </Popover>

                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="basic">Basic Salary</Label>
                            <Input
                                id="basic"
                                type="number"
                                value={formData.basic || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, basic: Number(e.target.value) }))}
                                placeholder="Enter basic salary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hra">HRA</Label>
                            <Input
                                id="hra"
                                type="number"
                                value={formData.hra || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, hra: Number(e.target.value) }))}
                                placeholder="Enter HRA"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="allowances">Allowances</Label>
                            <Input
                                id="allowances"
                                type="number"
                                value={formData.allowances || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, allowances: Number(e.target.value) }))}
                                placeholder="Enter allowances"
                            />
                        </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pf">PF</Label>
                            <Input
                                id="pf"
                                type="number"
                                value={formData.pf || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, pf: Number(e.target.value) }))}
                                placeholder="Enter PF"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="esi">ESI</Label>
                            <Input
                                id="esi"
                                type="number"
                                value={formData.esi || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, esi: Number(e.target.value) }))}
                                placeholder="Enter ESI"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tds">TDS</Label>
                            <Input
                                id="tds"
                                type="number"
                                value={formData.tds || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, tds: Number(e.target.value) }))}
                                placeholder="Enter TDS"
                            />
                        </div>
                    </div>

                    {/* Additional Components */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bonus">Bonus</Label>
                            <Input
                                id="bonus"
                                type="number"
                                value={formData.bonus || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, bonus: Number(e.target.value) }))}
                                placeholder="Enter bonus"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reimbursements">Reimbursements</Label>
                            <Input
                                id="reimbursements"
                                type="number"
                                value={formData.reimbursements || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, reimbursements: Number(e.target.value) }))}
                                placeholder="Enter reimbursements"
                            />
                        </div>
                    </div>

                    {/* Deductions and Net Payable */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="deductions">Other Deductions</Label>
                            <Input
                                id="deductions"
                                type="number"
                                value={formData.deductions || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, deductions: Number(e.target.value) }))}
                                placeholder="Enter other deductions"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMode">Payment Mode</Label>
                            <Select
                                value={formData.paymentMode}
                                onValueChange={(value: 'bank' | 'upi') => setFormData(prev => ({ ...prev, paymentMode: value }))}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select payment mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank">Bank Transfer</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Net Payable Amount */}
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <Label className="text-lg font-semibold">Net Payable Amount</Label>
                            <span className="text-2xl font-bold text-green-600">
                                ₹{formData.netPayable?.toLocaleString('en-IN') || '0'}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="flex-1">
                            Save Payroll
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={handleGenerateSalarySlip}
                            disabled={!formData.netPayable}
                        >
                            Generate Salary Slip
                        </Button>
                        <Button type="button" variant="outline" className="flex-1">
                            Generate Challan
                        </Button>
                    </div>
                </form>
            </CardContent>
            <div className="hidden">
                {formData.netPayable && selectedEmployee && (
                    <SalarySlipTemplate
                        ref={salarySlipRef}
                        payroll={{
                            id: 'temp',
                            salaryMonth: formData.salaryMonth!,
                            basic: formData.basic!,
                            hra: formData.hra!,
                            allowances: formData.allowances!,
                            deductions: formData.deductions!,
                            pf: formData.pf!,
                            esi: formData.esi!,
                            tds: formData.tds!,
                            bonus: formData.bonus!,
                            reimbursements: formData.reimbursements!,
                            netPayable: formData.netPayable!,
                            paymentMode: formData.paymentMode!,
                            status: 'draft',
                            date: new Date().toISOString().split('T')[0],
                            employeeId: selectedEmployee,
                            employeeName: attendanceData.find(emp => emp.employeeId === selectedEmployee)?.employeeName || ''
                        }}
                    />
                )}
            </div>
        </Card>
    );
};