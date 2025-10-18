export interface PayrollRecord {
    id: string;
    salaryMonth: Date;
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
    pf: number;
    esi: number;
    tds: number;
    bonus: number;
    reimbursements: number;
    netPayable: number;
    paymentMode: 'bank' | 'upi';
    status: 'draft' | 'pending' | 'approved' | 'paid';
    employeeId: string;
    employeeName: string;
}

export interface AttendanceData {
    employeeId: string;
    employeeName: string;
    presentDays: number;
    totalDays: number;
    basicSalary: number;
}

export interface PayrollCalculation {
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
    pf: number;
    esi: number;
    tds: number;
    bonus: number;
    reimbursements: number;
    netPayable: number;
}