import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { PayrollRecord } from '@/types/payroll';

export class PDFService {
    static async generateSalarySlip(payroll: PayrollRecord, element?: HTMLElement): Promise<void> {
        const pdf = new jsPDF('portrait', 'mm', 'a4');

        if (element) {
            // Generate from HTML element
            return this.generateFromHTML(pdf, element);
        } else {
            // Generate programmatically
            return this.generateProgrammatically(pdf, payroll);
        }
    }

    private static async generateFromHTML(pdf: jsPDF, element: HTMLElement): Promise<void> {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('salary-slip.pdf');
    }

    private static async generateProgrammatically(pdf: jsPDF, payroll: PayrollRecord): Promise<void> {
        const monthYear = new Date(payroll.salaryMonth).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long'
        });

        // Company Header
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(44, 62, 80);
        pdf.text('COMPANY NAME', 105, 20, { align: 'center' });

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(128, 128, 128);
        pdf.text('Salary Slip', 105, 28, { align: 'center' });

        // Separator line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(15, 35, 195, 35);

        let yPosition = 50;

        // Employee Details
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(44, 62, 80);
        pdf.text('Employee Details', 20, yPosition);

        yPosition += 10;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);

        pdf.text(`Employee Name: ${payroll.employeeName}`, 20, yPosition);
        pdf.text(`Employee ID: ${payroll.employeeId}`, 120, yPosition);

        yPosition += 6;
        pdf.text(`Salary Month: ${monthYear}`, 20, yPosition);
        pdf.text(`Payment Date: ${new Date().toLocaleDateString('en-IN')}`, 120, yPosition);

        yPosition += 15;

        // Earnings Section
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Earnings', 20, yPosition);

        yPosition += 8;
        this.addTableRow(pdf, 'Basic Salary', this.formatCurrency(payroll.basic), 20, yPosition);
        yPosition += 6;
        this.addTableRow(pdf, 'House Rent Allowance (HRA)', this.formatCurrency(payroll.hra), 20, yPosition);
        yPosition += 6;
        this.addTableRow(pdf, 'Other Allowances', this.formatCurrency(payroll.allowances), 20, yPosition);
        yPosition += 6;
        this.addTableRow(pdf, 'Bonus', this.formatCurrency(payroll.bonus), 20, yPosition);
        yPosition += 6;
        this.addTableRow(pdf, 'Reimbursements', this.formatCurrency(payroll.reimbursements), 20, yPosition);

        yPosition += 10;

        // Deductions Section
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Deductions', 20, yPosition);

        yPosition += 8;
        this.addTableRow(pdf, 'Provident Fund (PF)', this.formatCurrency(payroll.pf), 20, yPosition);
        yPosition += 6;
        this.addTableRow(pdf, 'Employee State Insurance (ESI)', this.formatCurrency(payroll.esi), 20, yPosition);
        yPosition += 6;
        this.addTableRow(pdf, 'Tax Deducted at Source (TDS)', this.formatCurrency(payroll.tds), 20, yPosition);
        yPosition += 6;
        this.addTableRow(pdf, 'Other Deductions', this.formatCurrency(payroll.deductions), 20, yPosition);

        yPosition += 15;

        // Net Salary
        pdf.setDrawColor(44, 62, 80);
        pdf.setLineWidth(0.5);
        pdf.line(20, yPosition, 190, yPosition);

        yPosition += 8;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(44, 62, 80);
        this.addTableRow(pdf, 'NET PAYABLE AMOUNT', this.formatCurrency(payroll.netPayable), 20, yPosition);

        yPosition += 15;

        // Payment Details
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Payment Mode: ${payroll.paymentMode.toUpperCase()}`, 20, yPosition);
        pdf.text(`Status: ${payroll.status.toUpperCase()}`, 120, yPosition);

        yPosition += 10;

        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text('This is a computer-generated document and does not require a signature.', 105, 280, { align: 'center' });
        pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 105, 285, { align: 'center' });

        pdf.save(`salary-slip-${payroll.employeeName}-${monthYear}.pdf`);
    }

    private static addTableRow(pdf: jsPDF, label: string, value: string, x: number, y: number): void {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text(label, x, y);
        pdf.setFont('helvetica', 'bold');
        pdf.text(value, 190, y, { align: 'right' });
    }

    private static formatCurrency(amount: number): string {
        return `₹${amount.toLocaleString('en-IN')}`;
    }

    static async generatePFChallan(payrolls: PayrollRecord[]): Promise<void> {
        const pdf = new jsPDF();

        // PF Challan header
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROVIDENT FUND CHALLAN', 105, 20, { align: 'center' });

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 105, 30, { align: 'center' });

        let yPosition = 50;
        let totalPF = 0;

        payrolls.forEach(payroll => {
            if (yPosition > 250) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.text(`Employee: ${payroll.employeeName}`, 20, yPosition);
            pdf.text(`PF Amount: ${this.formatCurrency(payroll.pf)}`, 120, yPosition);
            yPosition += 8;

            totalPF += payroll.pf;
        });

        yPosition += 10;
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Total PF Contribution: ${this.formatCurrency(totalPF)}`, 20, yPosition);

        pdf.save(`pf-challan-${new Date().getTime()}.pdf`);
    }

    static async generateESIChallan(payrolls: PayrollRecord[]): Promise<void> {
        const pdf = new jsPDF();

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EMPLOYEE STATE INSURANCE CHALLAN', 105, 20, { align: 'center' });

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 105, 30, { align: 'center' });

        let yPosition = 50;
        let totalESI = 0;

        payrolls.forEach(payroll => {
            if (yPosition > 250) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.text(`Employee: ${payroll.employeeName}`, 20, yPosition);
            pdf.text(`ESI Amount: ${this.formatCurrency(payroll.esi)}`, 120, yPosition);
            yPosition += 8;

            totalESI += payroll.esi;
        });

        yPosition += 10;
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Total ESI Contribution: ${this.formatCurrency(totalESI)}`, 20, yPosition);

        pdf.save(`esi-challan-${new Date().getTime()}.pdf`);
    }

    static async generateTDSChallan(payrolls: PayrollRecord[]): Promise<void> {
        const pdf = new jsPDF();

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TAX DEDUCTED AT SOURCE CHALLAN', 105, 20, { align: 'center' });

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 105, 30, { align: 'center' });

        let yPosition = 50;
        let totalTDS = 0;

        payrolls.forEach(payroll => {
            if (yPosition > 250) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.text(`Employee: ${payroll.employeeName}`, 20, yPosition);
            pdf.text(`TDS Amount: ${this.formatCurrency(payroll.tds)}`, 120, yPosition);
            yPosition += 8;

            totalTDS += payroll.tds;
        });

        yPosition += 10;
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Total TDS Deducted: ${this.formatCurrency(totalTDS)}`, 20, yPosition);

        pdf.save(`tds-challan-${new Date().getTime()}.pdf`);
    }
}