import { DashboardStrip } from "@/components/custom/DashboardStrip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useMemo, useCallback } from "react";
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
import { ArrowUpDown, ChevronDown, Search, MoveLeft, MoveRight, RotateCw } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Types
interface APPROVEDSTATUS {
    id: "director" | "CEO" | "voice president" | "sales manager";
    msg: string;
    status: "Approved" | "Reject" | "Requested";
}

interface DATAAPPINERFACE {
    leadId: string;
    customerCompanyName: string;
    approved: APPROVEDSTATUS[];
    remarks: string;
    attachement: string;
}

// Constants
const STATUS_CONFIG = {
    Approved: { text: "Approved", className: "bg-green-100 text-green-800" },
    Reject: { text: "Rejected", className: "bg-red-100 text-red-800" },
    Partial: { text: "Partial", className: "bg-yellow-100 text-yellow-800" },
} as const;

const APPROVAL_ROLES = ["director", "CEO", "voice president", "sales manager"] as const;

// Sample data
const SAMPLE_DATA: DATAAPPINERFACE[] = [
    {
        leadId: "LD-001",
        customerCompanyName: "ABC Pharmaceuticals Ltd.",
        approved: APPROVAL_ROLES.map(role => ({
            id: role,
            msg: "Approved",
            status: "Approved" as const
        })),
        remarks: "It has survived not only five centuries, but also the leap into electronic typesetting",
        attachement: "file1.png,file2.png"
    },
    {
        leadId: "LD-002",
        customerCompanyName: "XYZ Medical Supplies Inc.",
        approved: APPROVAL_ROLES.map(role => ({
            id: role,
            msg: role === "sales manager" ? "Approved" : "Budget constraints",
            status: role === "sales manager" ? "Approved" : "Reject"
        })),
        remarks: "Project requires additional financial documentation and risk assessment",
        attachement: "budget_report.pdf,risk_analysis.docx"
    },
    {
        leadId: "LD-003",
        customerCompanyName: "Global Healthcare Solutions",
        approved: APPROVAL_ROLES.map(role => ({
            id: role,
            msg: "Approved",
            status: "Approved"
        })),
        remarks: "All technical and legal requirements satisfied. Ready for implementation phase.",
        attachement: "contract_v3.pdf,tech_specs.docx"
    }
];

// Filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
};

// Utility functions
const getInitials = (id: string): string => {
    const words = id.split(' ');
    return words.length === 1
        ? words[0].charAt(0).toUpperCase()
        : words.map(word => word.charAt(0).toUpperCase()).join('');
};

const getStatusInfo = (approvedData: APPROVEDSTATUS[]) => {
    const allApproved = approvedData.every(item => item.status === "Approved");
    const allRejected = approvedData.every(item => item.status === "Reject");

    if (allApproved) return STATUS_CONFIG.Approved;
    if (allRejected) return STATUS_CONFIG.Reject;
    return STATUS_CONFIG.Partial;
};

const getAvatarClass = (status: APPROVEDSTATUS["status"]) => {
    switch (status) {
        case "Approved": return "bg-green-100 text-green-800 border border-green-500";
        case "Reject": return "bg-red-100 text-red-800 border border-red-700";
        default: return "bg-red-100 text-red-800 border border-red-700";
    }
};

// Custom hook for pagination
const usePagination = (table: any, maxVisiblePages = 5) => {
    return useMemo(() => {
        const currentPage = table.getState().pagination.pageIndex + 1;
        const pageCount = table.getPageCount();

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return { currentPage, pageNumbers };
    }, [table.getState().pagination.pageIndex, table.getPageCount()]);
};

// Sortable header component
const SortableHeader: React.FC<{
    column: any;
    children: React.ReactNode;
}> = ({ column, children }) => (
    <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
);

export default function ApprovalList() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [modelOpen, setModelOpen] = React.useState(false);
    function HandleModel(leadId: string) {
        setModelOpen(true);
        return leadId
    }
    const columns = useMemo<ColumnDef<DATAAPPINERFACE>[]>(() => [
        {
            accessorKey: "leadId",
            header: ({ column }) => (
                <SortableHeader column={column}>
                    Lead ID
                </SortableHeader>
            ),
            cell: ({ row }) => (
                <div className="uppercase px-3" onClick={() => HandleModel(row.getValue("leadId"))}>
                    {String(row.getValue("leadId")).toUpperCase()}
                </div>
            ),
        },
        {
            accessorKey: "customerCompanyName",
            header: ({ column }) => (
                <SortableHeader column={column}>
                    Company Name
                </SortableHeader>
            ),
            cell: ({ row }) => (
                <div className="uppercase px-3" onClick={() => HandleModel(row.getValue("leadId"))}>
                    {String(row.getValue("customerCompanyName")).toUpperCase()}
                </div>
            ),
        },
        {
            accessorKey: "approved",
            header: ({ column }) => (
                <SortableHeader column={column}>
                    Status
                </SortableHeader>
            ),
            cell: ({ row }) => {
                const approvedData: APPROVEDSTATUS[] = row.getValue("approved");
                const statusInfo = getStatusInfo(approvedData);

                return (
                    <div className="px-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`} onClick={() => HandleModel(row.getValue("leadId"))}>
                            {statusInfo.text}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "remarks",
            header: ({ column }) => (
                <SortableHeader column={column}>
                    Remarks
                </SortableHeader>
            ),
            cell: ({ row }) => (
                <div
                    onClick={() => HandleModel(row.getValue("leadId"))}
                    className="px-3 max-w-[200px] truncate"
                    title={String(row.getValue("remarks"))}
                >
                    {String(row.getValue("remarks"))}
                </div>
            ),
        },
        {
            id: "approvers",
            header: "Send To",
            cell: ({ row }) => {
                const approvedData: APPROVEDSTATUS[] = row.getValue("approved");
                return (
                    <div className="flex items-center space-x-2">
                        {approvedData.map((item) => (
                            <Avatar key={item.id} className="h-6 w-6 text-xs">
                                <AvatarFallback className={getAvatarClass(item.status)} onClick={() => HandleModel(row.getValue("leadId"))}>
                                    {getInitials(item.id)}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ], []);

    const table = useReactTable({
        data: SAMPLE_DATA,
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
    });

    const { currentPage, pageNumbers } = usePagination(table);

    const handleGlobalFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(event.target.value);
    }, []);


    return (
        <div className="w-full lg:p-7 p-2">
            <DashboardStrip title="Approval List" />
            <Card className="w-full p-4">
                {/* Search and Filter Controls */}
                <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                        <Input
                            placeholder="Search across all fields..."
                            value={globalFilter ?? ""}
                            onChange={handleGlobalFilterChange}
                            className="max-w-sm h-[40px] w-[320px] pl-[40px]"
                        />
                        <Search className="size-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
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
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize cursor-pointer"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
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
                                            <TableCell key={cell.id} className="py-3">
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

                {/* Pagination */}
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
                                className={`w-8 h-8 p-0 ${currentPage === page
                                    ? "bg-blue-100 border-blue-600 text-blue-600"
                                    : ""
                                    }`}
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

            {/* Approval Modal */}
            <Dialog open={modelOpen} onOpenChange={setModelOpen}>
                <DialogContent className="w-full  max-w-[95%] bg-white">
                    <DialogHeader className="flex space-y-2 flex-row gap-x-3 items-center mb-1">
                        <div className="w-[45px] h-[45px] rounded-[6px] bg-[#584ccc] flex flex-col items-center justify-center m-0">
                            <RotateCw size={22} stroke="#fff" />
                        </div>
                        <div>
                            <DialogTitle className="leading-6">Approval</DialogTitle>
                            <div className="leading-5 text-xs text-gray-500">
                                Create a new approval
                            </div>
                        </div>
                    </DialogHeader>

                    <ScrollArea className="max-h-[360px] mr-[-10px] pr-[10px]">
                        <DialogDescription className="p-2">
                            <div className="w-full flex flex-col space-y-4">
                                {/* Company Info */}
                                <div className="flex flex-col space-y-2.5">
                                    <div className="text-[18px] font-medium mb-1 text-black">
                                        ABC Pharmaceuticals Ltd.
                                    </div>
                                    <div className="text-sm font-normal">
                                        Project requires additional financial documentation and risk assessment
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div className="flex flex-wrap gap-2">
                                    <Label className="w-full">Attachments</Label>
                                    {[1, 2].map((item) => (
                                        <div key={item} className="flex-2 min-w-[200px]">
                                            <a
                                                href="/assets/images/icon-at.png"
                                                download
                                                className="w-full flex flex-row bg-indigo-100/50 rounded shadow-none px-2.5 py-1.5 hover:bg-indigo-200/50 transition-colors"
                                            >
                                                <img
                                                    src="/assets/images/icon-at.png"
                                                    className="w-[40px]"
                                                    alt="Attachment"
                                                />
                                                <div className="w-[calc(100%-40px)] pl-2.5">
                                                    <div className="text-ellipsis overflow-hidden whitespace-nowrap text-black">
                                                        ABC-Pharmaceuticals.Ltd
                                                    </div>
                                                    <div className="text-ellipsis overflow-hidden whitespace-nowrap text-[12px]">
                                                        Size: 200kb
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                {/* Approval Action */}
                                <div className="w-full">
                                    <Select>
                                        <SelectTrigger className="w-[70%]">
                                            <SelectValue placeholder="Select Request" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Approved Request</SelectLabel>
                                                {["Approved", "Reject"].map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <div className="mt-3">
                                        <Textarea placeholder="Any Remark" />
                                    </div>
                                    <div className="w-full mt-3 flex flex-col items-end"><Button className="cursor-pointer">Submit</Button></div>
                                </div>

                                {/* Approval Timeline */}
                                <div className="w-full">
                                    <Label className="block mb-6 text-black text-xs">
                                        Status: Requested
                                    </Label>
                                    <div className="pl-5">
                                        <div className="w-full relative border-dotted border-l-2">
                                            {[
                                                { step: 1, role: "Voice President", status: "Pending Request", avatar: "VP", type: "red" },
                                                { step: 2, role: "CEO", status: "Approved by", message: "Technical specifications met", avatar: "C", type: "yellow" },
                                                { step: 3, role: "Sales Manager", status: "Requested by", avatar: "SM", type: "green" },
                                            ].map((item) => (
                                                <div key={item.step} className="w-full pl-6 relative mb-5">
                                                    <Avatar className="h-8 w-8 text-xs absolute left-[-18px] top-0">
                                                        <AvatarFallback className={getAvatarClass(
                                                            item.type === "green" ? "Approved" :
                                                                item.type === "red" ? "Reject" : "Requested"
                                                        )}>
                                                            {item.avatar}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <Label className="mb-1 text-xs">
                                                        Step {item.step}: {item.status}
                                                    </Label>
                                                    <div className="text-gray-600">{item.role}</div>
                                                    {item.message && (
                                                        <div className="text-gray-600 mt-1.5">
                                                            {item.message}
                                                        </div>
                                                    )}
                                                    <div className="absolute right-4 bottom-2 text-xs">
                                                        07/10/2025 02:55:20
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogDescription>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}