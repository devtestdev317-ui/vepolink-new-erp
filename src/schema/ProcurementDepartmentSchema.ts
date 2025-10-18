import { z } from "zod";


export const ProcurementDepartmentSchema = z.object({
    requestingDepartment: z.enum(["Accounts", "Production", "Maintenance", "R&D"]),
    itemName: z.string().min(1, "Item name/description is required"),
    specifications: z.object({
        modelNumber: z.string().optional(),
        capacity: z.string().optional(),
        dimensions: z.string().optional(),
        material: z.string().optional(),
        voltage: z.string().optional(),
        other: z.string().optional()
    }).optional(),
    quantity: z.number().int().positive("Quantity must be a positive number"),
    urgency: z.enum(["Normal", "Urgent"]),
    budget: z.object({
        allocation: z.string().min(1, "Budget allocation is required"),
        costCenter: z.string().optional(),
        estimatedCost: z.number().positive("Estimated cost must be positive").optional()
    }),
    remark: z.string().optional()
});

export type RequestFormData = z.infer<typeof ProcurementDepartmentSchema>;