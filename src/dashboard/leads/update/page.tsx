import { DashboardStrip } from "@/components/custom/DashboardStrip";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BadgeAlert, Eye } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SalesManagerLeadData } from "../../../dummy-data/SalesManagerDummyLeadData"
import { SalesManagerLeadSchema } from "../../../schema/SalesManagerLeadSchema"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Link, useParams } from "react-router-dom";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormDatePicker } from "@/components/custom/form-date-picker";
import type { ItemSpecification } from "@/dummy-data/ItemRequirementDet";
import { ItemRequirementDetails } from "@/dummy-data/ItemRequirementDet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
export default function UpdateLeadPage() {
    const { id } = useParams<{ id: string }>();
    const lead = SalesManagerLeadData.find(lead => lead.leadId === id);


    const DataLeads = [{
        sourceOfLeadContact: ["email", "inbound call", "outbound call"],
        inquiryLocation: ["north", "south", "east", "west"],
        salesManager: ["Rajesh Kumar", "Sanjay Verma", "Anita Desai", "Vikram Singh"]
    }]
    const form = useForm<z.infer<typeof SalesManagerLeadSchema>>({
        resolver: zodResolver(SalesManagerLeadSchema),
        defaultValues: {
            clientType: lead?.clientType || "",
            InstrumentType: lead?.InstrumentType || "",
            customerName: lead?.customerName || "",
            customerCompanyName: lead?.customerCompanyName || "",
            customerContactNumber: lead?.customerContactNumber || "",
            inquiryLocation: lead?.inquiryLocation || "",
            category: lead?.category || "",
            enquiryStatus: lead?.enquiryStatus,
            requirement: lead?.requirement || "",
            inspectionStatus: lead?.inspectionStatus,
            sourceOfLead: lead?.sourceOfLead || "",
            salesManager: lead?.salesManager || "",
            technicalFieldEngineer: lead?.technicalFieldEngineer,
            remark: lead?.remark || "",
            siteVisit: lead?.siteVisit,
            status: lead?.status || false,
            storeStatus: lead?.storeStatus || "Available",
            deliveryDate: lead?.deliveryDate ? new Date(lead.deliveryDate) : undefined,
        },
    })
    function onSubmit(values: z.infer<typeof SalesManagerLeadSchema>) {
        console.log(values)
    }
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("");


    interface LEADTYPE {
        id: number;
        label: string;
        value: string;
    }
    const leadTypes: LEADTYPE[] = [
        { id: 1, label: "Instrumental", value: "instrumental" },
        { id: 2, label: "Chemical", value: "chemical" },
        { id: 3, label: "Project", value: "project" },
    ];
    const ClientTypes: LEADTYPE[] = [
        { id: 1, label: "New client", value: "New client" },
        { id: 2, label: "Existing client", value: "Existing client" },
    ];
    const sourceOfLeadContact = ["email", "inbound call", "outbound call"]


    const [selectedInstrument, setSelectedInstrument] = React.useState<string | null>(null);
    const [ClientList, setClientList] = React.useState<LEADTYPE[]>([]);

    function InstrumentChangeHand(value: string) {
        setSelectedInstrument(value);
        if (value !== "Existing client") {
            form.reset();
            setClientList([]);
            setValue("");
        }
        else {
            setClientList(SalesManagerLeadData.map((client) => ({
                id: parseInt(client.leadId),
                label: client.customerCompanyName,
                value: client.customerCompanyName
            })));
        }
    }
    function handelClientSelect(value: string) {
        SalesManagerLeadData.forEach((client) => {
            if (client.customerCompanyName === value) {
                form.setValue("customerName", client.customerName);
                form.setValue("customerCompanyName", client.customerCompanyName);
                form.setValue("customerContactNumber", client.customerContactNumber);
                form.setValue("inquiryLocation", client.inquiryLocation);
                form.setValue("category", client.category);
                form.setValue("requirement", client.requirement);
                form.setValue("sourceOfLead", client.sourceOfLead);
                form.setValue("salesManager", client.salesManager);
                form.setValue("remark", client.remark);
                form.setValue("status", client.status);
                form.setValue("siteVisit", client.inspectionStatus)
                form.setValue("enquiryStatus", client.enquiryStatus)
                form.setValue("inspectionStatus", client.enquiryStatus)
            }
        });
        form.clearErrors();
    }
    const [callStatus, SetCallStatus] = React.useState(lead?.enquiryStatus);
    const [ServiceStatus, SetServiceStatus] = React.useState(lead?.siteVisit);



    const dummyItemDetails: ItemSpecification[] = ItemRequirementDetails;
    const [OpenSpecModel, setOpenSpecModel] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<ItemSpecification | null>(null);
    function ViewSpecification(id: number) {
        const item = dummyItemDetails.find(item => item.id === id);
        setSelectedItem(item || null);
        setOpenSpecModel(!OpenSpecModel);
    }
    return (
        <div className="w-full lg:p-7 p-2">
            <DashboardStrip title="Pre-sales/Leads: Update Lead" />

            <Card className="lg:p-7 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mt-4 gap-4">
                <div className="flex items-center justify-between">
                    <h4 data-slot="card-title" className="leading-none flex items-center gap-3 text-slate-800">
                        <div className="p-2 bg-blue-50 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-line w-5 h-5 text-blue-600" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"></path></svg></div>Update Lead</h4>
                    <Link to="/dashboard/leads" className={buttonVariants({
                        variant: "ghost",
                        className: "text-sm font-normal bg-slate-300/50 hover:bg-slate-400"
                    })}>Back to Leads List</Link>
                </div>

                <div className="flex flex-row w-full">
                    <p className="px-3 py-2.5 mb-8 bg-blue-50 rounded-lg text-blue-700 text-sm flex flex-row items-center gap-x-1  w-full"><BadgeAlert size="18px" /><span>Use the form below to add a new lead to the system. Please ensure all required fields are filled out accurately before submitting.</span></p>
                </div>

                {/* <Separator className="mt-3 mb-6" /> */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-wrap align-baseline items-start">
                        <div className="flex flex-wrap w-full lg:space-y-0 space-y-3   items-start">
                            <FormField
                                control={form.control}
                                name="clientType"
                                render={({ field }) => (
                                    <FormItem className="lg:w-1/4 md:w-1/3 w-full px-2">
                                        <Label className="text-slate-700 font-medium">Client Type<span className="text-red-500">*</span></Label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full min-h-[40px]">
                                                    <SelectValue placeholder="Select Client Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    ClientTypes.map((leadType) => (
                                                        <SelectItem key={leadType.id} value={leadType.value}>{leadType.label}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="InstrumentType"
                                render={({ field }) => (
                                    <FormItem className="lg:w-1/4 md:w-1/3 w-full px-2">
                                        <Label className="text-slate-700 font-medium">Instrument Type<span className="text-red-500">*</span></Label>
                                        <Select onValueChange={(value) => {
                                            field.onChange(value);
                                            InstrumentChangeHand(value);
                                        }}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full min-h-[40px]">
                                                    <SelectValue placeholder="Select Instrument Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    leadTypes.map((leadType) => (
                                                        <SelectItem key={leadType.id} value={leadType.value}>{leadType.label}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {
                                selectedInstrument === "Existing client" && (<div className="lg:w-1/4 md:w-1/3 w-full mb-4 flex flex-col px-2 gap-2">
                                    <Label className="text-slate-700 font-medium">Select Client<span className="text-red-500">*</span></Label>
                                    <Popover open={open} onOpenChange={setOpen} >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between font-normal h-[40px]"
                                            >
                                                {value
                                                    ? ClientList.find((client) => client.label === value)?.label
                                                    : "Select Client..."}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search Client..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No Client found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {ClientList.map((framework) => (
                                                            <CommandItem
                                                                key={framework.id}
                                                                value={framework.label}
                                                                onSelect={(currentValue) => {
                                                                    setValue(currentValue === value ? "" : currentValue)
                                                                    setOpen(false)
                                                                    handelClientSelect(currentValue)
                                                                }}
                                                            >
                                                                {framework.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        value === framework.label ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>)

                            }

                        </div>

                        <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                                <FormItem className="lg:w-1/4 md:w-1/3 w-full px-2">
                                    <FormLabel className="text-slate-700 font-medium">Customer Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Customer Name" className=" h-[40px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="customerCompanyName"
                            render={({ field }) => (
                                <FormItem className="lg:w-1/4 md:w-1/3 w-full px-2">
                                    <FormLabel className="text-slate-700 font-medium">Customer Company Name  <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Customer Company Name" className=" h-[40px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="customerContactNumber"
                            render={({ field }) => (
                                <FormItem className="lg:w-1/4 md:w-1/3 w-full px-2">
                                    <FormLabel className="text-slate-700 font-medium">Customer Contact Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="Enter Customer Contact Number" className=" h-[40px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="inquiryLocation"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full md:w-1/2 lg:w-1/4 px-2">
                                    <FormLabel className="text-slate-700 font-medium">Inquiry Location <span className="text-red-500">*</span></FormLabel>
                                    <Popover >
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full h-[40px] justify-between font-normal capitalize",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? DataLeads[0].inquiryLocation.includes(field.value)
                                                            ? field.value
                                                            : "Select Inquiry Location"
                                                        : "Select Inquiry Location"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search Location..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No Location found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {DataLeads[0].inquiryLocation.map((location) => (
                                                            <CommandItem
                                                                className="capitalize"
                                                                value={location}
                                                                key={location}
                                                                onSelect={() => {
                                                                    form.setValue("inquiryLocation", location)
                                                                }}
                                                            >
                                                                {location}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        location === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className="lg:w-1/4 md:w-1/3 w-full px-2">
                                    <FormLabel className="text-slate-700 font-medium">Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Category" className=" h-[40px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="requirement"
                            render={({ field }) => (
                                <FormItem className="lg:w-1/4 md:w-1/3 w-full px-2">
                                    <FormLabel className="text-slate-700 font-medium">Requirement<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Requirement" className=" h-[40px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sourceOfLead"
                            render={({ field }) => (
                                <FormItem className="flex flex-col lg:w-1/4 md:w-1/3 w-full px-2">
                                    <FormLabel className="text-slate-700 font-medium">Source Of Lead</FormLabel>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value);
                                        InstrumentChangeHand(value);
                                    }}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full min-h-[40px]">
                                                <SelectValue placeholder="Select Instrument Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                sourceOfLeadContact.map((leadType) => (
                                                    <SelectItem key={leadType} value={leadType}>{leadType}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="enquiryStatus"
                            render={({ field }) => (
                                <FormItem className="flex flex-col lg:w-1/4 md:w-1/3 w-full px-2">
                                    <FormLabel className="text-slate-700 font-medium">Enquiry Status</FormLabel>
                                    <Select onValueChange={(value) => { field.onChange(value); SetCallStatus(value); }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full min-h-[40px]">
                                                <SelectValue placeholder="Select Call Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                ["Call Done", "Call Pending"].map((leadType) => (
                                                    <SelectItem key={leadType} value={leadType}>{leadType}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* callStatus, SetCallStatus */}
                        {
                            callStatus === "Call Done" ? (
                                <FormField
                                    control={form.control}
                                    name="siteVisit"
                                    render={({ field }) => (
                                        <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                            <Label className="text-slate-700 font-medium">Pre Site Visit</Label>
                                            <Select
                                                onValueChange={(value) => { field.onChange(value); SetServiceStatus(value); }} defaultValue={field.value}

                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full min-h-[40px]">
                                                        <SelectValue placeholder="Select Inspection status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        ["Yes", "No"].map((leadType) => (
                                                            <SelectItem key={leadType} value={leadType}>{leadType}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : null
                        }
                        {
                            ServiceStatus == "Yes" ?
                                <>
                                    <FormField
                                        control={form.control}
                                        name="salesManager"
                                        render={({ field }) => (
                                            <FormItem className="w-full lg:w-1/4 md:w-1/3 px-2">
                                                <Label className="text-slate-700 font-medium">Service Manager</Label>
                                                <Select

                                                    onValueChange={(value) => { field.onChange(value); }} defaultValue={field.value}

                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full min-h-[40px]">
                                                            <SelectValue placeholder="Select Service Manager" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            ["Rajesh Kumar", "Sanjay Verma", "Anita Desai", "Vikram Singh"].map((leadType) => (
                                                                <SelectItem key={leadType} value={leadType}>{leadType}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="technicalFieldEngineer"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col w-full md:w-1/2 lg:w-1/4 px-2">
                                                <FormLabel className="text-slate-700 font-medium">Technical Field Engineer <span className="text-red-500">*</span></FormLabel>
                                                <Popover >
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full h-[40px] justify-between font-normal capitalize",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? ["Anil Thakur", "Manoj Singh", "Ranjan Gupta", "Neha Singh"].includes(field.value)
                                                                        ? field.value
                                                                        : "Select Engineer"
                                                                    : "Select Engineer"}
                                                                <ChevronsUpDown className="opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0">
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Search Engineer..."
                                                                className="h-9"
                                                            />
                                                            <CommandList>
                                                                <CommandEmpty>No Location found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {["Anil Thakur", "Manoj Singh", "Ranjan Gupta", "Neha Singh"].map((location) => (
                                                                        <CommandItem
                                                                            className="capitalize"
                                                                            value={location}
                                                                            key={location}
                                                                            onSelect={() => {
                                                                                form.setValue("technicalFieldEngineer", location)
                                                                            }}
                                                                        >
                                                                            {location}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    location === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="inspectionStatus"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                                <Label className="text-slate-700 font-medium">Pre Site Visit status</Label>
                                                <Select

                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}

                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full min-h-[40px]">
                                                            <SelectValue placeholder="Select Inspection status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            ["Pending", "Done"].map((leadType) => (
                                                                <SelectItem key={leadType} value={leadType}>{leadType}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="quoteAttached"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                                <FormLabel className="text-slate-700 font-medium">Upload Pre site Visit Doc.</FormLabel>
                                                <FormControl>
                                                    <Input type="file" placeholder="Upload Pre site Visit Doc" accept=".pdf" className=" h-[40px]" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>

                                : null
                        }
                        <FormField
                            control={form.control}
                            name="quoteAmount"
                            render={({ field }) => (
                                <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                    <FormLabel className="text-slate-700 font-medium">Quote Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Quote Amount" className=" h-[40px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quoteAttached"
                            render={({ field }) => (
                                <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                    <FormLabel className="text-slate-700 font-medium">Upload Quote</FormLabel>
                                    <FormControl>
                                        <Input type="file" placeholder="Select Quote" accept=".pdf" className=" h-[40px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="attachedPO"
                            render={({ field }) => (
                                <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                    <FormLabel className="text-slate-700 font-medium">Attached PO</FormLabel>
                                    <FormControl>
                                        <Input type="file" placeholder="Select PO" accept=".pdf" className=" h-[40px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="attachedPI"
                            render={({ field }) => (
                                <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                    <FormLabel className="text-slate-700 font-medium">Attached PI</FormLabel>
                                    <FormControl>
                                        <Input type="file" placeholder="Select PI" accept=".pdf" className=" h-[40px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="remark"
                            render={({ field }) => (
                                <FormItem className="w-full px-2">
                                    <FormLabel className="text-slate-700 font-medium">Remarks</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit"
                                            className="resize-none h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full px-2">
                            <Card className="rounded shadow-none p-4 ">
                                <CardTitle>Item Order Detail</CardTitle>
                                <CardDescription>
                                    {
                                        dummyItemDetails.map((item, i) =>
                                            <Card className="rounded shadow-none p-4 mb-2" key={item.id}>
                                                <CardTitle>Item #{i + 1}</CardTitle>
                                                <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-3">
                                                    <div className="flex flex-col space-y-2">
                                                        <FormLabel className="text-slate-700 font-medium">Item Name</FormLabel>
                                                        <div className="px-2 py-2.5 border rounded text-[#0a0a0a]">{item.itemName}</div>
                                                    </div>
                                                    <div className="flex flex-col space-y-2">
                                                        <FormLabel className="text-slate-700 font-medium">Quantity</FormLabel>
                                                        <div className="px-2 py-2.5 border rounded text-[#0a0a0a]">{item.quantity}</div>
                                                    </div>
                                                    <FormField
                                                        control={form.control}
                                                        name="storeStatus"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col space-y-2">
                                                                <FormLabel className="text-slate-700 font-medium mb-0">Store</FormLabel>
                                                                <Select

                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}

                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger className="w-full min-h-[40px] rounded">
                                                                            <SelectValue placeholder="Select Store" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {
                                                                            ["Available", "Order"].map((leadType) => (
                                                                                <SelectItem key={leadType} value={leadType}>{leadType}</SelectItem>
                                                                            ))
                                                                        }
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormDatePicker
                                                        name="deliveryDate"
                                                        label="Delivery Date"
                                                        description="Select a date"
                                                        required
                                                    />
                                                    <div className="flex flex-col space-y-2">
                                                        <FormLabel className="text-slate-700 font-medium">Specification</FormLabel>
                                                        <div onClick={() => ViewSpecification(item.id)} className="px-2 py-2.5 border rounded text-[#0a0a0a] relative cursor-pointer">
                                                            View All Specifications
                                                            <Button variant={"default"} className="absolute cursor-pointer right-0 top-0 bottom-0 w-[41px] rounded-none h-[41px] border-0"><Eye className="size-5" /></Button>
                                                        </div>
                                                    </div>

                                                </div>
                                            </Card>
                                        )
                                    }


                                </CardDescription>
                            </Card>

                        </div>

                        <div className="w-full flex flex-col items-end justify-end">
                            <Button type="submit" className="cursor-pointer">Update</Button>

                        </div>
                    </form>
                </Form>
            </Card>
            <AlertDialog open={OpenSpecModel} onOpenChange={setOpenSpecModel}>
                <AlertDialogContent style={{ maxWidth: "768px", width: "90%" }} className="max-w-none ml-auto mr-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Item #1</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div className="grid lg:grid-cols-4 md:grid-cols-1 grid-cols-1 gap-4 mt-4 mb-3">
                                <div className="flex flex-col space-y-2">
                                    <Label className="text-slate-700 font-medium">Item Name</Label>
                                    <div className="px-3 py-2 border rounded">{selectedItem?.itemName}</div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label className="text-slate-700 font-medium">Quantity</Label>
                                    <div className="px-3 py-2 border rounded">{selectedItem?.quantity}</div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label className="text-slate-700 font-medium">Urgency</Label>
                                    <div className="px-3 py-2 border rounded">{selectedItem?.urgency}</div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label className="text-slate-700 font-medium">Budget</Label>
                                    <div className="px-3 py-2 border rounded">{selectedItem?.budget?.estimatedCost}</div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 mb-4">
                                <Label className="text-slate-700 font-medium">Remark</Label>
                                <div className="px-3 py-2 border rounded">{selectedItem?.remark}</div>
                            </div>
                            <CardTitle className="mb-3">Specifications</CardTitle>
                            <ScrollArea className="md:max-w-[768px] max-w-[300px] w-[100%]">
                                <Table className="border w-full">
                                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Model Number</TableHead>
                                            <TableHead>Capacity</TableHead>
                                            <TableHead>Dimensions</TableHead>
                                            <TableHead>Material</TableHead>
                                            <TableHead>Voltage</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                {selectedItem?.specifications.modelNumber}
                                            </TableCell>
                                            <TableCell>
                                                {selectedItem?.specifications.capacity}
                                            </TableCell>
                                            <TableCell>
                                                {selectedItem?.specifications.dimensions}
                                            </TableCell>
                                            <TableCell>
                                                {selectedItem?.specifications.material}
                                            </TableCell>
                                            <TableCell>
                                                {selectedItem?.specifications.voltage}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
