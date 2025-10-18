import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    FilterFn,
} from "@tanstack/react-table"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search, MoveLeft, MoveRight, ChevronsUpDown, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { rankItem } from "@tanstack/match-sorter-utils"
import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { DashboardStrip } from "@/components/custom/DashboardStrip"
import { toast } from "sonner"


const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank,
    })
    return itemRank.passed
};

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SalesManagerLeadData } from "@/dummy-data/SalesManagerDummyLeadData"
import type { SalesManagerLead } from "@/schema/SalesManagerLeadSchema"
import { SalesManagerLeadSchema } from "@/schema/SalesManagerLeadSchema"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
const data = SalesManagerLeadData;
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export default function SalesManagerLeadsPage() {

    const [modelOpen, setModelOpen] = React.useState(false);

    const columns: ColumnDef<SalesManagerLead>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },

        {
            accessorKey: "leadId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Lead ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase"><Link to={`/dashboard/leads/view/${row.getValue("leadId")}`} className="hover:text-blue-600">{String(row.getValue("leadId")).toUpperCase()}</Link></div>,
        },
        {
            id: "modelColumn",
            header: () => (
                <Button
                    variant="ghost"
                    className="w-8 p-0 "
                    title="Toggle All"
                >
                    Update
                </Button>
            ),
            cell: ({ row }) => (
                <Button
                    onClick={() => HandleModel(row.original.leadId)} variant="outline" size="sm" className="h-8 bg-blue-500 text-white border-0 text-[12px] font-normal hover:bg-blue-600 hover:text-white" data-id={row.original.leadId}>
                    Add Details
                </Button>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "clientType",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Client Type
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("clientType")).toUpperCase()}</div>,
        },
        {
            accessorKey: "sourceOfLead",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Source of Lead
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("sourceOfLead")).toUpperCase()}</div>,
        },
        {
            accessorKey: "customerName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Customer Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("customerName")).toUpperCase()}</div>,
        },
        {
            accessorKey: "customerCompanyName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Company Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("customerCompanyName")).toUpperCase()}</div>,
        },
        {
            accessorKey: "customerContactNumber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Customer Contact
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("customerContactNumber")).toUpperCase()}</div>,
        },
        {
            accessorKey: "inquiryLocation",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Inquiry Location
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("inquiryLocation")).toUpperCase()}</div>,
        },
        {
            accessorKey: "category",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("category")).toUpperCase()}</div>,
        },
        {
            accessorKey: "requirement",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Requirement
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("requirement")).toUpperCase()}</div>,
        },
        {
            accessorKey: "remark",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Remark
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("remark")).toUpperCase()}</div>,
        },

        {
            accessorKey: "salesManager",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Sales Manager
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("salesManager")).toUpperCase()}</div>,
        },

        {
            accessorKey: "enquiryStatus",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Enquiry Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="uppercase">{String(row.getValue("enquiryStatus")).toUpperCase()}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const lead = row.original


                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(lead.leadId)}
                            >
                                Copy Lead ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to={`/dashboard/leads/add-details/${lead.leadId}`} className="w-full">Add Details</Link>
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [open, setOpen] = React.useState(false)
    const [leadToDelete, setLeadToDelete] = React.useState<string | null>(null)
    // Listen for delete events from dropdown menu
    React.useEffect(() => {
        const handleOpenDeleteDialog = (event: CustomEvent) => {
            setLeadToDelete(event.detail)
            setOpen(true)
        }

        document.addEventListener('openDeleteDialog', handleOpenDeleteDialog as EventListener)

        return () => {
            document.removeEventListener('openDeleteDialog', handleOpenDeleteDialog as EventListener)
        }
    }, [])

    const handleDelete = () => {
        if (leadToDelete) {
            // Implement actual delete logic here
            toast.success(`Lead ${leadToDelete} deleted successfully`)
            setOpen(false)
            setLeadToDelete(null)
        }
    }

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        globalFilterFn: fuzzyFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
            rowSelection,
        },
    })

    // Calculate page numbers to display
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pageCount = table.getPageCount();
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const form = useForm<z.infer<typeof SalesManagerLeadSchema>>({
        resolver: zodResolver(SalesManagerLeadSchema),
        defaultValues: {
            leadId: "",
            clientType: "",
            InstrumentType: "",
            customerName: "",
            customerCompanyName: "",
            customerContactNumber: "",
            inquiryLocation: "",
            category: "",
            requirement: "",
            sourceOfLead: "",
            salesManager: "",
            remark: "",
            enquiryStatus: "",
            closeRemark: "",
            companyAddress: "",
            technicalFieldEngineer: "",
            inspectionStatus: "Pending",
            quoteAmount: 15200,
            quoteAttached: "",
            attachedPO: "",
            poDate: "",
            attachedPI: "",
            status: true

        },
    })
    function HandleModel(leadId: string) {
        form.setValue("leadId", leadId);
        setModelOpen(true);
    }
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof SalesManagerLeadSchema>) {
        console.log(values)
    }

    const companyAddress = ["Raju Kumar", "Komal Verma", "Avnish Desai", "Rashi Singh"];
    const EnquiryStatus = ["Pending", "Call Done", "Close"];
    const TechnicalEngineer = ["Anil Thakur", "Manoj Singh", "Ranjan Gupta", "Neha Singh"];
    const InspectionData = ["Pending", "Progress", "Done"]
    return (


        <>
            <div className="w-full p-7">
                <DashboardStrip title="Pre-sales/Leads: List" />
                <Card className="w-full p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative">
                            <Input
                                placeholder="Search across all fields..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="max-w-sm h-[40px] w-[320px] pl-[40px]"
                            />
                            <Search className="size-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-[40px] ml-auto">
                                        Table Columns <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="max-h-[220px] overflow-y-auto">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize cursor-pointer"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                >
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            )
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div className="text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <MoveLeft className="h-4 w-4" />
                            </Button>

                            {pageNumbers.map(page => (
                                <Button
                                    key={page}
                                    variant="outline"
                                    size="sm"
                                    className={`w-8 h-8 p-0 ${currentPage === page ? "bg-blue-100 border-blue-600 text-blue-600" : ""}`}
                                    onClick={() => table.setPageIndex(page - 1)}
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <MoveRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>

                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete lead {leadToDelete}
                                and remove the data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setLeadToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Delete Lead
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <Dialog open={modelOpen} onOpenChange={setModelOpen}  >
                <DialogContent className="w-full max-w-full bg-gray-200" style={{ maxWidth: '90vw', height: '90vh' }}>
                    <div className="flex flex-wrap gap-x-4 gap-y-4">
                        <div className="w-full md:w-[380px] bg-white p-4 rounded-lg shadow">
                            <DialogHeader className="w-full max-w-full">
                                <div className="flex flex-col items-center justify-center mb-7">
                                    <Avatar className="w-[80px] h-[80px] mb-4">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback >CN</AvatarFallback>
                                    </Avatar>
                                    <DialogTitle className="font-bold">JOHN SMITH (LD-007)</DialogTitle>
                                </div>
                                <DialogDescription>
                                    <div className="mb-3">
                                        <p className=" text-gray-500 text-sm font-semibold">Contact Number</p>
                                        <p className="font-medium text-sm text-black/80">+91-985-9851-123</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className=" text-gray-500 text-sm font-semibold">Company Name</p>
                                        <p className="font-medium text-sm text-black/80">Mercy General Hospital</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className=" text-gray-500 text-sm font-semibold">Client Type</p>
                                        <p className="font-medium text-sm text-black/80">New Client</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className=" text-gray-500 text-sm font-semibold">Instrument Type</p>
                                        <p className="font-medium text-sm text-black/80">Project</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className=" text-gray-500 text-sm font-semibold">Category</p>
                                        <p className="font-medium text-sm text-black/80">Sterilization Equipment</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className=" text-gray-500 text-sm font-semibold">Requirement</p>
                                        <p className="font-medium text-sm text-black/80">Large capacity autoclave for operation theater</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className=" text-gray-500 text-sm font-semibold">Date of Enquiry</p>
                                        <p className="font-medium text-sm text-black/80">Tuesday 30 September 2025 at 13:10:41</p>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="w-full md:flex-1 bg-white p-4 pt-6 rounded-lg shadow">
                            <DialogTitle className="font-semibold mb-4">Update Service Report</DialogTitle>
                            <Separator className="mb-6" />

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-wrap align-baseline items-start">
                                    <div className="flex flex-wrap w-full space-y-4 md:space-y-5 md:space-x-0 items-start">
                                        <FormField
                                            control={form.control}
                                            name="companyAddress"
                                            render={({ field }) => (
                                                <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                                    <Label className="text-slate-700 font-medium">Service Manager</Label>
                                                    <Select

                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}

                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full min-h-[40px]">
                                                                <SelectValue placeholder="Select Service Manager" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                companyAddress.map((leadType) => (
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
                                                <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                                    <Label className="text-slate-700 font-medium">Enquiry Status</Label>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}

                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full min-h-[40px]">
                                                                <SelectValue placeholder="Select Enquiry Status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                EnquiryStatus.map((leadType) => (
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
                                            name="closeRemark"
                                            render={({ field }) => (
                                                <FormItem className="w-full px-2">
                                                    <FormLabel className="text-slate-700 font-medium">Close Remarks For Future Reference </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Tell us a little bit about"
                                                            className="resize-none h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
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
                                                                        ? TechnicalEngineer.includes(field.value)
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
                                                                        {TechnicalEngineer.map((location) => (
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
                                        {/* InspectionData */}
                                        <FormField
                                            control={form.control}
                                            name="inspectionStatus"
                                            render={({ field }) => (
                                                <FormItem className="w-full md:w-1/2 lg:w-1/4 px-2">
                                                    <Label className="text-slate-700 font-medium">Inspection status</Label>
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
                                                                InspectionData.map((leadType) => (
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


                                        <div className="w-full flex flex-row gap-x-5 justify-end items-end">
                                            <Button onClick={() => setModelOpen(false)} className="bg-gray-300 text-black hover:bg-black hover:text-white cursor-pointer">Close</Button>
                                            <Button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 hover:text-white cursor-pointer">Update</Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}