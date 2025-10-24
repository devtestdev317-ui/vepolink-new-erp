// components/ui/date-picker.tsx
"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";

export interface DatePickerProps {
    value?: Date;
    onChange: (date?: Date) => void;
    disabled?: (date: Date) => boolean;
    placeholder?: string;
    className?: string;
    fromYear?: number;
    toYear?: number;
    required?: boolean;
}

export function DatePicker({
    value,
    onChange,
    disabled,
    placeholder = "Pick a date",
    className,
    fromYear = 1900,
    toYear = new Date().getFullYear() + 10
}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !value && "text-muted-foreground",
                            className
                        )}
                    >
                        {value ? format(value, "PPP") : <span>{placeholder}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                    initialFocus
                    fromYear={fromYear}
                    toYear={toYear}
                    captionLayout="dropdown"
                />
            </PopoverContent>
        </Popover>
    );
}