import React from 'react';
import type { PayrollRecord } from '@/types/payroll';
import { Card, CardContent } from '@/components/ui/card';

interface SalarySlipTemplateProps {
    payroll: PayrollRecord;
    ref?: React.Ref<HTMLDivElement>;
}

export const SalarySlipTemplate = React.forwardRef<HTMLDivElement, SalarySlipTemplateProps>(
    ({ payroll }, ref) => {
        const monthYear = new Date(payroll.salaryMonth).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long'
        });

        const formatCurrency = (amount: number) => {
            return `₹${amount.toLocaleString('en-IN')}`;
        };

        return (
            <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">COMPANY NAME</h1>
                    <p className="text-gray-600 text-lg">Salary Slip</p>
                </div>

                {/* Employee Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="font-semibold text-gray-700">Employee Details</h3>
                        <p><strong>Name:</strong> {payroll.employeeName}</p>
                        <p><strong>ID:</strong> {payroll.employeeId}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-700">Payment Details</h3>
                        <p><strong>Salary Month:</strong> {monthYear}</p>
                        <p><strong>Payment Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
                    </div>
                </div>

                {/* Earnings and Deductions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Earnings */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-lg text-green-700 mb-3">EARNINGS</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Basic Salary</span>
                                    <span className="font-semibold">{formatCurrency(payroll.basic)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>House Rent Allowance (HRA)</span>
                                    <span className="font-semibold">{formatCurrency(payroll.hra)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Other Allowances</span>
                                    <span className="font-semibold">{formatCurrency(payroll.allowances)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Bonus</span>
                                    <span className="font-semibold">{formatCurrency(payroll.bonus)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Reimbursements</span>
                                    <span className="font-semibold">{formatCurrency(payroll.reimbursements)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Deductions */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-lg text-red-700 mb-3">DEDUCTIONS</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Provident Fund (PF)</span>
                                    <span className="font-semibold">{formatCurrency(payroll.pf)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Employee State Insurance (ESI)</span>
                                    <span className="font-semibold">{formatCurrency(payroll.esi)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax Deducted at Source (TDS)</span>
                                    <span className="font-semibold">{formatCurrency(payroll.tds)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Other Deductions</span>
                                    <span className="font-semibold">{formatCurrency(payroll.deductions)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Net Salary */}
                <Card className="bg-gray-50 border-2 border-gray-300">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-xl text-gray-800">NET PAYABLE AMOUNT</h3>
                            <span className="font-bold text-2xl text-green-700">
                                {formatCurrency(payroll.netPayable)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Payment Mode: <strong>{payroll.paymentMode.toUpperCase()}</strong></p>
                    <p>Status: <strong>{payroll.status.toUpperCase()}</strong></p>
                    <p className="mt-4 italic">
                        This is a computer-generated document and does not require a signature.
                    </p>
                    <p className="mt-2">Generated on: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
            </div>
        );
    }
);

SalarySlipTemplate.displayName = 'SalarySlipTemplate';