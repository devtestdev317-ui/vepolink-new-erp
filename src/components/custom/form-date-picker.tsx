// components/ui/form-date-picker.tsx
"use client";

import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "./date-picker";
import type { DatePickerProps } from "./date-picker";

export interface FormDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
}

export function FormDatePicker({
    name,
    label,
    description,
    required = false,
    ...datePickerProps
}: FormDatePickerProps) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    {label && <FormLabel>{label}{required && " *"}</FormLabel>}
                    <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        {...datePickerProps}

                        className="h-[40px] rounded"
                    />
                    {/* {description && <FormDescription>{description}</FormDescription>} */}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}