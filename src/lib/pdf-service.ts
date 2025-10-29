import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { PayrollRecord } from '@/types/payroll';
import type { PerformanceReview } from '@/types/performance';
import type { SkillDevelopmentReport} from '@/types/training';
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
        pdf.addImage('/assets/images/login.jpg', 'jpg', 15, 0, 180, 35);
        pdf.text('Vepolink', 105, 20, { align: 'center' });

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
        return `${amount.toLocaleString('en-IN')}`;
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


    static async generatePerformanceReport(review: PerformanceReview): Promise<void> {
        const pdf = new jsPDF('portrait', 'mm', 'a4');

        let yPosition = 20;

        // Add Header
        await this.addPerformanceReportHeader(pdf, review);
        yPosition = 45;

        // Add Employee & Review Details
        yPosition = this.addEmployeeDetails(pdf, review, yPosition);
        yPosition += 10;

        // Add Executive Summary
        yPosition = this.addExecutiveSummary(pdf, review, yPosition);
        yPosition += 10;

        // Add KRA/KPI Performance
        yPosition = this.addKRAPerformance(pdf, review, yPosition);

        // Check for page break
        if (yPosition > 200) {
            pdf.addPage();
            yPosition = 20;
        }

        // Add Ratings Breakdown
        yPosition = this.addRatingsBreakdown(pdf, review, yPosition);
        yPosition += 10;

        // Add Feedback Section
        yPosition = this.addFeedbackSection(pdf, review, yPosition);

        // Check for page break
        if (yPosition > 200) {
            pdf.addPage();
            yPosition = 20;
        }

        // Add Final Assessment
        yPosition = this.addFinalAssessment(pdf, review, yPosition);
        yPosition += 10;

        // Add Recommendations & Goals
        this.addRecommendationsAndGoals(pdf, review, yPosition);

        // Add Footer
        this.addPerformanceReportFooter(pdf);

        // Generate filename and save
        const fileName = `performance-review-${review.employeeName}-${this.formatDateForFilename(review.reviewPeriod.end)}.pdf`;
        pdf.save(fileName);
    }

    private static async addPerformanceReportHeader(pdf: jsPDF, review: PerformanceReview): Promise<void> {

        const pageWidth = pdf.internal.pageSize.getWidth();
        // Company Logo and Header
        pdf.setFillColor(44, 62, 80);
        pdf.rect(0, 0, pageWidth, 40, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PERFORMANCE REVIEW REPORT', pageWidth / 2, 15, { align: 'center' });

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Comprehensive Performance Assessment', pageWidth / 2, 22, { align: 'center' });

        // Review Period
        const periodText = `Review Period: ${this.formatDate(review.reviewPeriod.start)} - ${this.formatDate(review.reviewPeriod.end)}`;
        pdf.text(periodText, pageWidth / 2, 30, { align: 'center' });

        pdf.setTextColor(0, 0, 0); // Reset text color
    }

    private static addEmployeeDetails(pdf: jsPDF, review: PerformanceReview, yPosition: number): number {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EMPLOYEE DETAILS', 20, yPosition);

        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        pdf.text(`Employee Name: ${review.employeeName}`, 20, yPosition);
        pdf.text(`Employee ID: ${review.employeeId}`, 120, yPosition);

        yPosition += 6;
        pdf.text(`Review Date: ${this.formatDate(new Date())}`, 20, yPosition);
        pdf.text(`Final Rating: ${review.finalAppraisalResult.finalRating}/5.0`, 120, yPosition);

        yPosition += 6;
        const performanceLevel = review.finalAppraisalResult.performanceLevel.toUpperCase();
        pdf.text(`Performance Level: ${performanceLevel}`, 20, yPosition);

        yPosition += 6;
        if (review.promotionDetails) {
            pdf.text(`Increment: ${review.promotionDetails.incrementPercentage}%`, 20, yPosition);
            if (review.promotionDetails.promotedTo) {
                pdf.text(`Promotion: ${review.promotionDetails.promotedTo}`, 120, yPosition);
            }
        }

        return yPosition;
    }

    private static addExecutiveSummary(pdf: jsPDF, review: PerformanceReview, yPosition: number): number {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EXECUTIVE SUMMARY', 20, yPosition);

        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const pageWidth = pdf.internal.pageSize.getWidth();
        // Performance Summary
        const summary = review.finalAppraisalResult.summary || 'No summary provided.';
        const splitSummary = pdf.splitTextToSize(summary, pageWidth - 40);
        pdf.text(splitSummary, 20, yPosition);
        yPosition += splitSummary.length * 5 + 5;

        // Overall Rating Box
        pdf.setFillColor(240, 240, 240);
        pdf.rect(20, yPosition, pageWidth - 40, 20, 'F');

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Overall Performance Rating:', 25, yPosition + 8);
        pdf.setTextColor(44, 62, 80);
        pdf.text(`${review.finalAppraisalResult.finalRating}/5.0`, 180, yPosition + 8, { align: 'right' });
        pdf.setTextColor(0, 0, 0);

        return yPosition + 25;
    }

    private static addKRAPerformance(pdf: jsPDF, review: PerformanceReview, yPosition: number): number {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('KEY RESULT AREAS & PERFORMANCE', 20, yPosition);

        yPosition += 8;

        if (!review.kraKpi || review.kraKpi.length === 0) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'italic');
            pdf.text('No KRA/KPI data available.', 20, yPosition);
            return yPosition + 5;
        }

        review.kraKpi.forEach((kra, index) => {
            // Check for page break
            if (yPosition > 250) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${index + 1}. ${kra.category}: ${kra.objective}`, 20, yPosition);

            yPosition += 6;
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');

            pdf.text(`KPI: ${kra.kpi}`, 25, yPosition);
            pdf.text(`Target: ${kra.target}`, 120, yPosition);

            yPosition += 5;
            pdf.text(`Achievement: ${kra.actualAchievement}`, 25, yPosition);
            pdf.text(`Weightage: ${kra.weightage}%`, 120, yPosition);

            yPosition += 5;
            pdf.text(`Score: ${kra.score}/5.0`, 25, yPosition);

            // Progress bar visualization
            const scoreWidth = (kra.score / 5) * 50;
            pdf.setFillColor(44, 62, 80);
            pdf.rect(60, yPosition - 2, scoreWidth, 3, 'F');
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(60, yPosition - 2, 50, 3, 'S');

            yPosition += 10;
        });

        return yPosition;
    }

    private static addRatingsBreakdown(pdf: jsPDF, review: PerformanceReview, yPosition: number): number {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('DETAILED RATINGS BREAKDOWN', 20, yPosition);

        yPosition += 8;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');

        const ratings = review.ratings;
        const ratingCategories = [
            { label: 'Quality of Work', value: ratings.qualityOfWork },
            { label: 'Productivity', value: ratings.productivity },
            { label: 'Technical Skills', value: ratings.technicalSkills },
            { label: 'Communication', value: ratings.communication },
            { label: 'Teamwork', value: ratings.teamwork },
            { label: 'Initiative', value: ratings.initiative },
            { label: 'Adaptability', value: ratings.adaptability }
        ];

        ratingCategories.forEach((category, index) => {
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 20;
            }

            const x = index % 2 === 0 ? 20 : 110;
            if (index % 2 === 0 && index !== 0) {
                yPosition += 25;
            }

            pdf.text(category.label, x, yPosition);
            pdf.text(`${category.value}/5.0`, x + 70, yPosition, { align: 'right' });

            // Rating visualization
            const ratingWidth = (category.value / 5) * 40;
            pdf.setFillColor(44, 62, 80);
            pdf.rect(x, yPosition + 2, ratingWidth, 3, 'F');
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(x, yPosition + 2, 40, 3, 'S');
        });

        return yPosition + 35;
    }

    private static addFeedbackSection(pdf: jsPDF, review: PerformanceReview, yPosition: number): number {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('FEEDBACK & COMMENTS', 20, yPosition);

        yPosition += 8;

        // Manager Feedback
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text("Manager's Feedback:", 20, yPosition);

        yPosition += 6;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const managerFeedback = review.managerFeedback || 'No manager feedback provided.';
        const splitManagerFeedback = pdf.splitTextToSize(managerFeedback, pageWidth - 40);
        pdf.text(splitManagerFeedback, 25, yPosition);
        yPosition += splitManagerFeedback.length * 4 + 10;

        // Employee Self-Review
        if (review.employeeSelfReview) {
            if (yPosition > 250) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text("Employee's Self-Review:", 20, yPosition);

            yPosition += 6;
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            const splitSelfReview = pdf.splitTextToSize(review.employeeSelfReview, pageWidth - 40);
            pdf.text(splitSelfReview, 25, yPosition);
            yPosition += splitSelfReview.length * 4 + 10;
        }

        return yPosition;
    }

    private static addFinalAssessment(pdf: jsPDF, review: PerformanceReview, yPosition: number): number {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('FINAL ASSESSMENT', 20, yPosition);

        yPosition += 8;

        const assessment = review.finalAppraisalResult;

        // Performance Level with color coding
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Performance Level:', 20, yPosition);

        let levelColor = [0, 0, 0];
        switch (assessment.performanceLevel) {
            case 'exceeds': levelColor = [0, 128, 0]; break; // Green
            case 'meets': levelColor = [0, 0, 255]; break;   // Blue
            case 'needs-improvement': levelColor = [255, 165, 0]; break; // Orange
            case 'poor': levelColor = [255, 0, 0]; break;    // Red
        }

        pdf.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
        pdf.text(assessment.performanceLevel.toUpperCase().replace('-', ' '), 60, yPosition);
        pdf.setTextColor(0, 0, 0);

        yPosition += 8;

        // Final Rating
        pdf.text('Final Rating:', 20, yPosition);
        pdf.setTextColor(44, 62, 80);
        pdf.text(`${assessment.finalRating}/5.0`, 60, yPosition);
        pdf.setTextColor(0, 0, 0);

        return yPosition + 15;
    }

    private static addRecommendationsAndGoals(pdf: jsPDF, review: PerformanceReview, yPosition: number): void {
        const assessment = review.finalAppraisalResult;

        // Recommendations
        if (assessment.recommendations && assessment.recommendations.length > 0) {
            if (yPosition > 220) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('RECOMMENDATIONS FOR DEVELOPMENT', 20, yPosition);

            yPosition += 8;
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');

            assessment.recommendations.forEach((rec) => {
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
                pdf.text(`• ${rec}`, 25, yPosition);
                yPosition += 5;
            });
        }

        yPosition += 5;

        // Next Period Goals
        if (assessment.nextPeriodGoals && assessment.nextPeriodGoals.length > 0) {
            if (yPosition > 250) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('GOALS FOR NEXT REVIEW PERIOD', 20, yPosition);

            yPosition += 8;
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');

            assessment.nextPeriodGoals.forEach((goal) => {
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
                pdf.text(`• ${goal}`, 25, yPosition);
                yPosition += 5;
            });
        }
    }

    private static addPerformanceReportFooter(pdf: jsPDF): void {
        const pageWidth = pdf.internal.pageSize.getWidth();
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text('Confidential Performance Document - For authorized use only', pageWidth / 2, 285, { align: 'center' });
        pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, 290, { align: 'center' });
    }

    private static formatDate(date: Date): string {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    private static formatDateForFilename(date: Date): string {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }
   static generateTrainingReport(report: SkillDevelopmentReport & any) {
        const doc = new jsPDF();
        let yPosition = 20;

        // Title
        doc.setFontSize(20);
        doc.setTextColor(33, 37, 41);
        doc.text('Skill Development Report', 20, yPosition);
        yPosition += 15;

        // Report Metadata
        doc.setFontSize(10);
        doc.setTextColor(108, 117, 125);
        doc.text(`Generated on: ${report.generatedDate.toLocaleDateString()}`, 20, yPosition);
        doc.text(`Period: ${report.period.start.toLocaleDateString()} - ${report.period.end.toLocaleDateString()}`, 20, yPosition + 5);
        yPosition += 20;

        // Summary Section
        doc.setFontSize(16);
        doc.setTextColor(33, 37, 41);
        doc.text('Executive Summary', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        const summaryLines = [
            `Total Training Programs: ${report.summary.totalTrainings}`,
            `Completed Programs: ${report.summary.completedTrainings}`,
            `Ongoing Programs: ${report.summary.ongoingTrainings}`,
            `Total Participants: ${report.summary.totalParticipants}`,
            `Total Investment: ₹${report.summary.totalCost.toLocaleString('en-IN')}`,
            `Average Participant Rating: ${report.summary.averageParticipantRating.toFixed(1)}/5`
        ];

        summaryLines.forEach(line => {
            doc.text(`• ${line}`, 25, yPosition);
            yPosition += 6;
        });

        yPosition += 10;

        // Training Effectiveness
        if (report.trainingEffectiveness && report.trainingEffectiveness.length > 0) {
            doc.addPage();
            yPosition = 20;

            doc.setFontSize(16);
            doc.text('Training Effectiveness', 20, yPosition);
            yPosition += 15;

            doc.setFontSize(10);
            report.trainingEffectiveness.forEach((effectiveness: any, index: number) => {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFontSize(12);
                doc.setTextColor(33, 37, 41);
                doc.text(`${index + 1}. ${effectiveness.trainingTitle}`, 20, yPosition);
                yPosition += 8;

                doc.setFontSize(10);
                doc.setTextColor(108, 117, 125);
                const details = [
                    `Attendance Rate: ${(effectiveness.attendanceRate * 100).toFixed(1)}%`,
                    `Average Rating: ${effectiveness.averageRating.toFixed(1)}/5`,
                    `Skills Improved: ${effectiveness.skillImprovements.join(', ')}`
                ];

                details.forEach(detail => {
                    doc.text(`  ${detail}`, 25, yPosition);
                    yPosition += 6;
                });

                yPosition += 5;
            });
        }

        // Recommendations
        if (report.recommendations && report.recommendations.length > 0) {
            doc.addPage();
            yPosition = 20;

            doc.setFontSize(16);
            doc.setTextColor(33, 37, 41);
            doc.text('Recommendations', 20, yPosition);
            yPosition += 15;

            doc.setFontSize(10);
            report.recommendations.forEach((recommendation: string, index: number) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(`${index + 1}. ${recommendation}`, 25, yPosition);
                yPosition += 8;
            });
        }

        // Save the PDF
        doc.save(`skill-development-report-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    static generateTrainingCertificate(employeeName: string, trainingTitle: string, completionDate: Date) {
        const doc = new jsPDF();

        // Certificate border
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(2);
        doc.rect(10, 10, 190, 277);

        // Certificate title
        doc.setFontSize(30);
        doc.setTextColor(212, 175, 55);
        doc.text('CERTIFICATE OF COMPLETION', 105, 60, { align: 'center' });

        // Body text
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('This is to certify that', 105, 100, { align: 'center' });

        // Employee name
        doc.setFontSize(24);
        doc.setTextColor(33, 37, 41);
        doc.text(employeeName, 105, 120, { align: 'center' });

        // Completion text
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('has successfully completed the training program', 105, 140, { align: 'center' });

        // Training title
        doc.setFontSize(20);
        doc.setTextColor(33, 37, 41);
        doc.text(trainingTitle, 105, 160, { align: 'center' });

        // Date
        doc.setFontSize(12);
        doc.setTextColor(108, 117, 125);
        doc.text(`Completed on: ${completionDate.toLocaleDateString()}`, 105, 200, { align: 'center' });

        // Save certificate
        doc.save(`certificate-${employeeName.replace(/\s+/g, '-')}.pdf`);
    }


}