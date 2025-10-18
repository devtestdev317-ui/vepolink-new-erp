export type VendorStatus = "active" | "inactive";
export type PaymentTerms = "Net 30" | "Net 60" | "Upfront" | "On Delivery";
export type ComplianceStatus = "compliant" | "non-compliant" | "pending";
export interface VendorItem {
    item_name: string;
    specification: string;
    price: number;
    delivery_time: string;
    payment_terms: PaymentTerms;
    warranty: string;
    compliance: ComplianceStatus;
}

export interface VendorType {
    vendor_name: string;
    address: string;
    city: string;
    state: string;
    items: VendorItem[];
    createdAt: Date;
    status: VendorStatus;
}