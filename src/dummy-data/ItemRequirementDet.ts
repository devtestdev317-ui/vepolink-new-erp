//  interface
export interface ItemSpecification {
    id: number;
    itemName: string;
    specifications: {
        modelNumber: string;
        capacity: string;
        dimensions: string;
        material: string;
        voltage: string;
        other: string;
    };
    quantity: number;
    urgency: "Urgent" | "Normal" | "Low";
    budget: {
        allocation: string;
        costCenter: string;
        estimatedCost: number;
    };
    remark?: string;
}
export const ItemRequirementDetails: ItemSpecification[] = [
    {
        id: 1,
        itemName: "Item A",
        specifications: {
            modelNumber: "Model X",
            capacity: "100L",

            dimensions: "10x10x10 cm",
            material: "Stainless Steel",
            voltage: "220V",
            other: "Additional specs"
        },
        quantity: 5,
        urgency: "Urgent",
        budget: {
            allocation: "Budget 2024",
            costCenter: "CC101",
            estimatedCost: 1500
        },
        remark: "Handle with care"
    }, 
    {
        id: 2,
        itemName: "Item B",
        specifications: {
            modelNumber: "Model Y",
            capacity: "200L",
            dimensions: "20x20x20 cm",
            material: "Aluminum",
            voltage: "110V",
            other: "Additional specs"
        },
        quantity: 10,
        urgency: "Normal",
        budget: {
            allocation: "Budget 2024",
            costCenter: "CC102",
            estimatedCost: 3000
        },
        remark: "Urgent delivery required"
    }
]