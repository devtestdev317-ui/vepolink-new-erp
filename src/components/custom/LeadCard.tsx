import { Card, CardTitle } from "@/components/ui/card";
import { SalesManagerLeadData } from "@/dummy-data/SalesManagerDummyLeadData";
import { BadgeAlert, Plus, Check, ChevronsUpDown, Eye, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { BadgeCheckIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { STATUSLEAD } from "@/dashboard/list-leads/page";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";

interface LeadCardProps {
    data: STATUSLEAD[];
}

interface FrameworkItem {
    id: string;
    value: string;
    label: string;
}

interface TemplateItem {
    id: string;
    itemName: string;
    quantity: string;
}

interface LeadItem {
    leadId: string;
    companyAddress: string;
    requirement: string;
}

const frameworks: FrameworkItem[] = [
    {
        id: "1",
        value: "IOT Device",
        label: "IOT Device",
    },
    {
        id: "2",
        value: "Analyzer",
        label: "Analyzer",
    },
    {
        id: "3",
        value: "Translater",
        label: "Translater",
    }
];

const initialTemplate: TemplateItem = {
    id: "1",
    itemName: "",
    quantity: ""
};

export default function LeadCard({ data }: LeadCardProps) {
    return (
        <div className="flex flex-wrap">
            {SalesManagerLeadData.map((item) => (
                <LeadCardItem
                    key={item.leadId}
                    item={item}
                    data={data}
                />
            ))}
        </div>
    );
}

interface LeadCardItemProps {
    item: LeadItem;
    data: STATUSLEAD[];
}

function LeadCardItem({ item, data }: LeadCardItemProps) {
    const [templates, setTemplates] = React.useState<TemplateItem[]>([initialTemplate]);

    const addNewTemplate = () => {
        const newTemplate: TemplateItem = {
            id: Date.now().toString(),
            itemName: "",
            quantity: ""
        };
        setTemplates(prev => [...prev, newTemplate]);
    };

    const removeTemplate = (id: string) => {
        if (templates.length > 1) {
            setTemplates(prev => prev.filter(template => template.id !== id));
        }
    };

    const updateTemplate = (id: string, field: keyof TemplateItem, value: string) => {
        setTemplates(prev => prev.map(template =>
            template.id === id ? { ...template, [field]: value } : template
        ));
    };

    const renderStatusBadge = (statusItem: STATUSLEAD, index: number) => {
        const badgeClass = statusItem.status
            ? "bg-blue-500 text-white dark:bg-blue-600"
            : "bg-gray-200 text-black";

        const badgeContent = (
            <Badge variant="secondary" className={cn(badgeClass, !statusItem.link && "cursor-pointer")}>
                {statusItem.status ? <BadgeCheckIcon className="size-3" /> : <BadgeAlert className="size-3" />}
                {statusItem.name}
            </Badge>
        );

        if (statusItem.link) {
            return (
                <Link
                    to={`${statusItem.link}${item.leadId}`}
                    key={`${item.leadId}-${index}`}
                >
                    {badgeContent}
                </Link>
            );
        }

        return (
            <Dialog key={`${item.leadId}-${index}`}>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto">
                        {badgeContent}
                    </Button>
                </DialogTrigger>
                <DialogContent style={{ maxWidth: '992px' }} className="max-w-none w-full max-h-[90vh] overflow-y-auto borde">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Add Item <Badge variant="secondary">{item.leadId}</Badge>
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh]">
                        <DialogDescription>
                            <div className="rounded border p-4 space-y-4">
                                {templates.map((template) => (
                                    <TemplateForm
                                        key={template.id}
                                        template={template}
                                        onItemSelect={(templateId, value) => updateTemplate(templateId, 'itemName', value)}
                                        onQuantityChange={updateTemplate}
                                        onRemove={removeTemplate}
                                        leadId={item.leadId}
                                        canRemove={templates.length > 1}
                                    />
                                ))}

                                <div className="flex flex-wrap justify-end items-center gap-2 pt-4">
                                    <Button
                                        onClick={addNewTemplate}
                                        variant="outline"
                                        className="rounded cursor-pointer"
                                        aria-label="Add new template"
                                    >
                                        <Plus className="size-4 mr-1" />
                                        Add Item
                                    </Button>
                                    <DialogTrigger asChild>

                                        <Button variant="outline" className="rounded cursor-pointer">
                                            Close
                                        </Button>
                                    </DialogTrigger>
                                    <Button className="rounded cursor-pointer bg-blue-500 hover:bg-blue-600 text-white">
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </DialogDescription>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="w-full md:w-1/2 lg:p-2 p-0">
            <Card className="p-4 rounded hover:shadow-md transition-shadow">
                <Link to={`/dashboard/leads/update/${item.leadId}`} className="block overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-xl">
                            <Avatar className="rounded size-20 bg-white/20 backdrop-blur-sm">
                                <AvatarImage
                                    src="/assets/images/office-building.png"
                                    alt="Company building"
                                    className="object-contain p-2"
                                />
                                <AvatarFallback className="bg-transparent text-white">
                                    {item.companyAddress.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-semibold mb-2">
                                <span className="text-gray-500">Lead ID: </span>
                                <Badge variant="secondary" className="ml-1 text-xs font-mono">
                                    {item.leadId}
                                </Badge>
                            </CardTitle>
                            <div className="space-y-2">
                                <div>
                                    <span className="block text-gray-500 text-sm mb-1">Company Name</span>
                                    <p className="text-sm font-medium truncate">{item.companyAddress}</p>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-sm mb-1">Requirement</span>
                                    <p className="text-sm font-medium line-clamp-2">{item.requirement}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                    {data.map((statusItem, index) => renderStatusBadge(statusItem, index))}
                </div>
            </Card>
        </div>
    );
}

interface TemplateFormProps {
    template: TemplateItem;
    onItemSelect: (templateId: string, value: string) => void;
    onQuantityChange: (id: string, field: keyof TemplateItem, value: string) => void;
    onRemove: (id: string) => void;
    leadId: string;
    canRemove: boolean;
}

function TemplateForm({
    template,
    onItemSelect,
    onQuantityChange,
    onRemove,
    leadId,
    canRemove
}: TemplateFormProps) {
    const [open, setOpen] = React.useState(false);

    const handleItemSelect = (currentValue: string) => {
        onItemSelect(template.id, currentValue);
        setOpen(false);
    };

    return (
        <div className=" flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px] flex flex-col space-y-2">
                <Label htmlFor={`item-${template.id}`} className="text-sm font-medium">
                    Item Name
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between font-normal h-9"
                        >
                            <span className="truncate">{template.itemName || "Select Item..."}</span>
                            <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search item..." className="h-9" />
                            <CommandList>
                                <CommandEmpty>No item found.</CommandEmpty>
                                <CommandGroup>
                                    {frameworks.map((framework) => (
                                        <CommandItem
                                            key={framework.id}
                                            value={framework.value}
                                            onSelect={handleItemSelect}
                                        >
                                            {framework.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto size-4",
                                                    template.itemName === framework.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex-1 min-w-[150px] flex flex-col space-y-2">
                <Label htmlFor={`quantity-${template.id}`} className="text-sm font-medium">
                    Quantity
                </Label>
                <Input
                    id={`quantity-${template.id}`}
                    type="number"
                    placeholder="Enter Quantity"
                    className="h-9 font-normal"
                    min="1"
                    value={template.quantity}
                    onChange={(e) => onQuantityChange(template.id, 'quantity', e.target.value)}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <Link to={`/dashboard/leads/update/${leadId}`}
                    aria-label="View Specification"
                    className="flex flex-col items-center rounded justify-center h-[38px] w-[45px] bg-blue-500 hover:bg-blue-600"
                >
                    <Eye className="size-5 text-white" />
                </Link>
            </div>
            <div className="flex flex-col space-y-2">
                <Button
                    onClick={() => onRemove(template.id)}
                    className="h-[38px] w-[45px] bg-red-500 hover:bg-red-600 rounded"
                    disabled={!canRemove}
                    type="button"
                >
                    <Trash2 className="size-5" />
                </Button>
            </div>

        </div>
    );
}