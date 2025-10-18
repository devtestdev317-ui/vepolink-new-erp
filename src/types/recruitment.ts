export interface ManpowerRequisition {
  id: string;
  requisitionId: string;
  department: string;
  positionTitle: string;
  numberOfOpenings: number;
  jobDescription: string;
  requiredSkills: string[];
  experience: string;
  budgetedCTC: number;
  hiringManager: string;
  requestDate: Date;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'draft';
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'draft';