'use client';

import { useState } from 'react';
import { PayrollForm } from '@/components/payroll-form';
import { PayrollList } from '@/components/payroll-list';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PayrollRecord, AttendanceData } from '@/types/payroll';
import { Plus, FileText } from 'lucide-react';
import { PDFService } from '@/lib/pdf-service'
import { toast } from 'sonner';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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
    const date = new Date();
    const newDate = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "Asia/Kolkata",
    }).format(date)
    const handleSubmitPayroll = (data: PayrollRecord) => {
        const savedEditingPayroll = localStorage.getItem('editingPayroll');
        // Update existing payroll 
        if (savedEditingPayroll) {
            const editingPayroll = JSON.parse(savedEditingPayroll) as PayrollRecord;
            setPayrolls(prev => prev.map(p => p.id === editingPayroll.id ? data : p));
            localStorage.removeItem('editingPayroll');
            setActiveTab('records');
            toast.success("Payroll Updated Successfully", {
                description: newDate.toString(),
                action: {
                    label: "Success",
                    onClick: () => console.log("Success"),
                },
            })
            return;
        }
        // Add new payroll
        setPayrolls(prev => [...prev, data]);
        setActiveTab('records');
        toast.success("Payroll Added Successfully", {
            description: newDate.toString(),
            action: {
                label: "Success",
                onClick: () => console.log("Success"),
            },
        })
    };

    const handleEditPayroll = (payroll: PayrollRecord) => {
        localStorage.setItem('editingPayroll', JSON.stringify(payroll));
        setActiveTab('create');
        toast.success(`Editing payroll for ${payroll.employeeName}`, {
            description: newDate.toString(),
            action: {
                label: "Success",
                onClick: () => console.log("Success"),
            },
        });
    };

    const handleViewPayroll = (payroll: PayrollRecord) => {
        try {
            PDFService.generateSalarySlip(payroll);
        } catch (error) {
            console.error('Error viewing salary slip:', error);
            toast.error("Something went wrong", {
                description: "Error viewing salary slip. Please try again.",
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            });
        }
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
            toast.error("Something went wrong", {
                description: "Error generating PF challan. Please try again.",
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            });
        }
    };

    const generateESIChallan = async () => {
        try {
            await PDFService.generateESIChallan(payrolls);
        } catch (error) {
            console.error('Error generating ESI challan:', error);
            toast.error("Something went wrong", {
                description: "Error generating ESI challan. Please try again.",
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            });
        }
    };
    const generateTDSChallan = async () => {
        try {
            await PDFService.generateTDSChallan(payrolls);
        } catch (error) {
            console.error('Error generating TDS challan:', error);
            toast.error("Something went wrong", {
                description: "Error generating TDS challan. Please try again.",
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            });
        }
    };
    return (
        <div className="w-full p-3 md:p-7">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex flex-wrap justify-between items-center">
                    <div className='md:mb-0 mb-3'>
                        <h1 className="text-3xl font-bold">Payroll & Compliance</h1>
                        <p className="text-muted-foreground">
                            Manage employee payroll, generate salary slips, and compliance documents
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                    <ScrollArea className="w-full rounded-md border whitespace-nowrap">
                        <TabsList className="flex w-full whitespace-nowrap">
                            <TabsTrigger value="create" className="flex-1 flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Payroll
                            </TabsTrigger>
                            <TabsTrigger value="records" className="flex-1 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Payroll Records
                            </TabsTrigger>
                            {/* <TabsTrigger value="settlement" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Full & Final
                        </TabsTrigger> */}
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

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

                    {/* <TabsContent value="settlement">
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold mb-4">Full & Final Settlement</h3>
                            <p className="text-muted-foreground mb-6">
                                Automate full and final settlement calculations for employees leaving the organization.
                            </p>
                            <Button>Start Settlement Process</Button>
                        </div>
                    </TabsContent> */}
                </Tabs>
            </div>

        </div>
    );
}