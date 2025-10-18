import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PayrollRecord } from '@/types/payroll';
import { Download, Eye, Edit } from 'lucide-react';
import { PDFService } from '@/lib/pdf-service';

interface PayrollListProps {
    payrolls: PayrollRecord[];
    onEdit: (payroll: PayrollRecord) => void;
    onView: (payroll: PayrollRecord) => void;
    onDownload: (payroll: PayrollRecord) => void;
}

export const PayrollList: React.FC<PayrollListProps> = ({ payrolls, onEdit, onView, onDownload }) => {
    const getStatusVariant = (status: PayrollRecord['status']) => {
        switch (status) {
            case 'approved': return 'default';
            case 'pending': return 'secondary';
            case 'paid': return 'default';
            default: return 'outline';
        }
    };
    const handleDownloadSalarySlip = async (payroll: PayrollRecord) => {
        try {
            await PDFService.generateSalarySlip(payroll);
        } catch (error) {
            console.error('Error generating salary slip:', error);
            alert('Error generating salary slip. Please try again.');
        }
    };
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payroll Records</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Salary Month</TableHead>
                        <TableHead>Basic</TableHead>
                        <TableHead>Net Payable</TableHead>
                        <TableHead>Payment Mode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payrolls.map(payroll => (
                        <TableRow key={payroll.id}>
                            <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                            <TableCell>
                                {new Date(payroll.salaryMonth).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long'
                                })}
                            </TableCell>
                            <TableCell>₹{payroll.basic.toLocaleString('en-IN')}</TableCell>
                            <TableCell className="font-semibold">
                                ₹{payroll.netPayable.toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell className="capitalize">{payroll.paymentMode}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(payroll.status)}>
                                    {payroll.status.toUpperCase()}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => onView(payroll)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => onEdit(payroll)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDownloadSalarySlip(payroll)}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};