'use client';

import { useState } from 'react';
import { PayrollForm } from '@/components/payroll-form';
import { PayrollList } from '@/components/payroll-list';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PayrollRecord, AttendanceData } from '@/types/payroll';
import { Plus, FileText, Download } from 'lucide-react';
import { PDFService } from '@/lib/pdf-service';

// Mock data - replace with actual API calls
const mockAttendanceData: AttendanceData[] = [
    {
        employeeId: 'emp1',
        employeeName: 'John Doe',
        presentDays: 22,
        totalDays: 26,
        basicSalary: 50000
    },
    {
        employeeId: 'emp2',
        employeeName: 'Jane Smith',
        presentDays: 24,
        totalDays: 26,
        basicSalary: 60000
    }
];

const mockPayrolls: PayrollRecord[] = [
    {
        id: '1',
        salaryMonth: new Date('2024-01-01'),
        basic: 45000,
        hra: 18000,
        allowances: 5000,
        deductions: 2000,
        pf: 5400,
        esi: 337,
        tds: 2500,
        bonus: 10000,
        reimbursements: 3000,
        netPayable: 72763,
        paymentMode: 'bank',
        status: 'paid',
        employeeId: 'emp1',
        employeeName: 'John Doe',
        date: '2024-01-31'
    }
];

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState<PayrollRecord[]>(mockPayrolls);
    const [activeTab, setActiveTab] = useState('create');

    const handleSubmitPayroll = (data: PayrollRecord) => {
        setPayrolls(prev => [...prev, data]);
        setActiveTab('records');
    };

    const handleEditPayroll = (payroll: PayrollRecord) => {
        // Implement edit functionality
        console.log('Edit payroll:', payroll);
    };

    const handleViewPayroll = (payroll: PayrollRecord) => {
        // Implement view functionality
        console.log('View payroll:', payroll);
    };

    const handleDownloadPayroll = (payroll: PayrollRecord) => {
        // Implement download functionality
        console.log('Download payroll:', payroll);
    };

    const generatePFChallan = async () => {
        try {
            await PDFService.generatePFChallan(payrolls);
        } catch (error) {
            console.error('Error generating PF challan:', error);
            alert('Error generating PF challan. Please try again.');
        }
    };

    const generateESIChallan = async () => {
        try {
            await PDFService.generateESIChallan(payrolls);
        } catch (error) {
            console.error('Error generating ESI challan:', error);
            alert('Error generating ESI challan. Please try again.');
        }
    };
    const generateTDSChallan = async () => {
        try {
            await PDFService.generateTDSChallan(payrolls);
        } catch (error) {
            console.error('Error generating TDS challan:', error);
            alert('Error generating TDS challan. Please try again.');
        }
    };
    return (
        <div className="w-full p-3 md:p-7">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Payroll & Compliance</h1>
                        <p className="text-muted-foreground">
                            Manage employee payroll, generate salary slips, and compliance documents
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={generatePFChallan}>
                            <FileText className="h-4 w-4 mr-2" />
                            PF Challan
                        </Button>
                        <Button variant="outline" onClick={generateESIChallan}>
                            <FileText className="h-4 w-4 mr-2" />
                            ESI Challan
                        </Button>
                        <Button variant="outline" onClick={generateTDSChallan}>
                            <FileText className="h-4 w-4 mr-2" />
                            TDS Challan
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="create" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Payroll
                        </TabsTrigger>
                        <TabsTrigger value="records" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Payroll Records
                        </TabsTrigger>
                        <TabsTrigger value="settlement" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Full & Final
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="create">
                        <PayrollForm
                            onSubmit={handleSubmitPayroll}
                            attendanceData={mockAttendanceData}
                        />
                    </TabsContent>

                    <TabsContent value="records">
                        <PayrollList
                            payrolls={payrolls}
                            onEdit={handleEditPayroll}
                            onView={handleViewPayroll}
                            onDownload={handleDownloadPayroll}
                        />
                    </TabsContent>

                    <TabsContent value="settlement">
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold mb-4">Full & Final Settlement</h3>
                            <p className="text-muted-foreground mb-6">
                                Automate full and final settlement calculations for employees leaving the organization.
                            </p>
                            <Button>Start Settlement Process</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

        </div>
    );
}