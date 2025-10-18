export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  dob: Date;
  gender: 'male' | 'female' | 'other';
  contactDetails: {
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  department: string;
  designation: string;
  reportingManager: string;
  dateOfJoining: Date;
  employmentType: 'permanent' | 'contract';
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  pan: string;
  aadhaar: string;
  uan: string;
  esiNumber: string;
  ctcDetails: {
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
  };
  documents: Document[];
  assets: Asset[];
}

export interface Document {
  id: string;
  type: string;
  name: string;
  uploadDate: Date;
  verified: boolean;
}

export interface Asset {
  id: string;
  type: string;
  name: string;
  allocatedDate: Date;
  returnedDate?: Date;
  status: 'allocated' | 'returned';
}