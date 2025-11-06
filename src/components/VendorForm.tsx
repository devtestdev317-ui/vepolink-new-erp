import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "./ui/card";
import { PlusIcon } from "lucide-react";

// Types



// Validation Schema
const vendorItemSchema = z.object({
    item_name: z.string().min(1, "Item name is required"),
    specification: z.string().min(1, "Specification is required"),
    price: z.number().min(0, "Price must be positive"),
    delivery_time: z.string().min(1, "Delivery time is required"),
    payment_terms: z.enum(["Net 30", "Net 60", "Upfront", "On Delivery"]),
    warranty: z.string().min(1, "Warranty information is required"),
    compliance: z.enum(["compliant", "non-compliant", "pending"]),
});

const vendorFormSchema = z.object({
    vendor_name: z.string().min(1, "Vendor name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    status: z.enum(["active", "inactive"]),
    items: z.array(vendorItemSchema).min(1, "At least one item is required"),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

interface VendorFormProps {
    onSubmit: (data: VendorFormValues) => void;
    defaultValues?: Partial<VendorFormValues>;
}

const VendorForm: React.FC<VendorFormProps> = ({ onSubmit, defaultValues }) => {
    const form = useForm<VendorFormValues>({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: {
            vendor_name: "",
            address: "",
            city: "",
            state: "",
            status: "active",
            items: [
                {
                    item_name: "",
                    specification: "",
                    price: 0,
                    delivery_time: "",
                    payment_terms: "Net 30",
                    warranty: "",
                    compliance: "pending",
                },
            ],
            ...defaultValues,
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "items",
        control: form.control,
    });

    const handleSubmit = (data: VendorFormValues) => {
        onSubmit(data);
    };

    const addNewItem = () => {
        append({
            item_name: "",
            specification: "",
            price: 0,
            delivery_time: "",
            payment_terms: "Net 30",
            warranty: "",
            compliance: "pending",
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {/* Vendor Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <FormField
                        control={form.control}
                        name="vendor_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vendor Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter vendor name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter city" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter state" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                {/* Vendor Items */}
                <Card className="p-4 rounded">

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Vendor Items</h3>
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="border rounded-lg md:p-6 p-3 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium">Item {index + 1}</h4>
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => remove(index)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.item_name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Item Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter item name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Enter price"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`items.${index}.specification`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specification</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter item specifications"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.delivery_time`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Delivery Time</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., 2 weeks" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.payment_terms`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Terms</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select payment terms" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Net 30">Net 30</SelectItem>
                                                        <SelectItem value="Net 60">Net 60</SelectItem>
                                                        <SelectItem value="Upfront">Upfront</SelectItem>
                                                        <SelectItem value="On Delivery">On Delivery</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.compliance`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Compliance Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select compliance" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="compliant">Compliant</SelectItem>
                                                        <SelectItem value="non-compliant">Non-compliant</SelectItem>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`items.${index}.warranty`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Warranty</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 1 year warranty" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                        <div className="flex justify-end items-center">
                            <Button type="button" className="cursor-pointer" onClick={addNewItem} variant="outline">
                                <PlusIcon /> Add Item
                            </Button>
                        </div>
                    </div>
                </Card>

                <Button type="submit" className="w-full">
                    Submit Vendor
                </Button>
            </form>
        </Form>
    );
};

export default VendorForm;