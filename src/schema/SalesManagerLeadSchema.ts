import { z } from 'zod';

// Sign In Schema
export const SignInSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean("Accecpt terms and conditions")
});

// Lead Base Selection Schema
export const LeadBaseSelectionSchema = z.enum([
    "Instrument",
    "Chemical",
    "Project",
    "Data Transmission"
]);

// New Client Schema
export const NewClientSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    customerCompanyName: z.string().min(1, "Company name is required"),
    customerContactNumber: z.string().optional(),
    inquiryLocation: z.enum(["north", "south", "east", "west"]),
    category: z.enum(["ambient", "effluent", "RTWQMS", "emission"]).optional(),
    requirement: z.string().min(1, "Requirement is required"),
    sourceOfLead: z.enum(["email", "inbound call", "outbound call"]),
    salesManager: z.string().min(1, "Sales manager is required"),
    remark: z.string().optional()
});

// Existing Client Schema
export const ExistingClientSchema = z.object({
    customerCompanyName: z.string().min(1, "Company selection is required"),
    customerName: z.string(),
    customerContactNumber: z.string(),
    inquiryLocation: z.string(),
    category: z.enum(["ambient", "effluent", "emission"]).optional(),
    requirement: z.string().min(1, "Requirement is required"),
    sourceOfLead: z.enum(["email", "inbound call", "outbound call"]),
    salesManager: z.string().min(1, "Sales manager is required"),
    remark: z.string().optional()
});

// Sales Manager Lead Schema
export const SalesManagerLeadSchema = z.object({
    leadId: z.string().min(1, "Lead ID is required"),
    clientType: z.string().min(1, "Client Type is required"),
    InstrumentType: z.string().min(1, "Instrument is required"),
    customerName: z.string().min(1, "Customer name is required"),
    customerCompanyName: z.string().min(1, "Company name is required"),
    customerContactNumber: z.string().min(10, "Valid contact number is required"),
    inquiryLocation: z.string().min(1, "Inquiry location is required"),
    category: z.string().min(1, "Category is required"),
    requirement: z.string().min(1, "Requirement is required"),
    sourceOfLead: z.string().min(1, "Source of lead is required"),
    salesManager: z.string().min(1, "Sales manager is required"),
    remark: z.string().optional(),
    enquiryStatus: z.string().optional(),
    closeRemark: z.string().optional(),
    companyAddress: z.string().min(1, "Address required"),
    technicalFieldEngineer: z.string().optional(),
    siteVisit: z.string().optional(),
    inspectionStatus: z.string().optional(),
    quoteAmount: z.number().positive("Quote amount must be positive").optional(),
    quoteAttached: z.string().optional(),
    attachedPO: z.string().optional(),
    poDate: z.string().optional(),
    attachedPI: z.string().optional(),
    callStatus: z.string().optional(),
    status: z.boolean(),
    storeStatus: z.enum(["Available", "Order"]).optional(),
    deliveryDate: z.date().optional(),

});



export type SalesManagerLead = z.infer<typeof SalesManagerLeadSchema>;

// Export all schemas
export const VepolinkERPSchemas = {
    SignInSchema,
    LeadBaseSelectionSchema,
    NewClientSchema,
    ExistingClientSchema,
    SalesManagerLeadSchema,
};