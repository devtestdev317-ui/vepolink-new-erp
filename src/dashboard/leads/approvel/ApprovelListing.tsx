import * as React from "react"
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
import { ArrowUpDown, ChevronDown, Search, MoveLeft, MoveRight, ScrollText, FileText, RotateCw, X, File } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Card } from "@/components/ui/card"
import { DashboardStrip } from "@/components/custom/DashboardStrip"
import { SalesManagerLeadData } from "@/dummy-data/SalesManagerDummyLeadData"
import type { SalesManagerLead } from "@/schema/SalesManagerLeadSchema"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank,
    })
    return itemRank.passed
};



interface UploadedFile {
    id: string;
    file: File;
    previewUrl?: string;
    uploadProgress: number;
}

import { ScrollArea } from "@/components/ui/scroll-area"
import { ApproversForm } from "@/components/custom/ApprovalList"
export default function QuoteApprovelPage() {


    const [modelOpen, setModelOpen] = React.useState(false);
    const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const columns: ColumnDef<SalesManagerLead>[] = [
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
            cell: ({ row }) => <div onClick={() => HandleModel(row.original.leadId)} className="uppercase px-3">{String(row.getValue("leadId")).toUpperCase()}</div>,
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
            cell: ({ row }) => <div onClick={() => HandleModel(row.original.leadId)} className="uppercase px-3">{String(row.getValue("customerName")).toUpperCase()}</div>,
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
            cell: ({ row }) => <div onClick={() => HandleModel(row.original.leadId)} className="uppercase px-3">{String(row.getValue("customerCompanyName")).toUpperCase()}</div>,
        },
        {
            accessorKey: "customerContactNumber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Contact
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div onClick={() => HandleModel(row.original.leadId)} className="uppercase px-3">{String(row.getValue("customerContactNumber")).toUpperCase()}</div>,
        }
    ];

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: SalesManagerLeadData,
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

    function HandleModel(leadId: string) {
        setModelOpen(true);
        return leadId
    }

    const [actTab, setActTab] = React.useState<string | null>(null)

    const processFiles = (files: File[]) => {
        const newFiles: UploadedFile[] = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            uploadProgress: 0,
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);

        // Simulate upload progress
        newFiles.forEach((fileObj) => {
            simulateUploadProgress(fileObj.id);
        });
    };

    const simulateUploadProgress = (fileId: string) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadedFiles(prev =>
                prev.map(file =>
                    file.id === fileId
                        ? { ...file, uploadProgress: Math.min(progress, 100) }
                        : file
                )
            );

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 100);
    };

    const removeFile = (fileId: string) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full lg:p-7 p-2">
            <DashboardStrip title="Request for Approvel" />
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
            <Dialog open={modelOpen} onOpenChange={setModelOpen}  >
                <DialogContent className="w-full max-w-[95%] bg-white">
                    <DialogHeader className="flex space-y-2 flex-row gap-x-3 items-center">
                        <div className="w-[45px] h-[45px] rounded-[6px] bg-[#584ccc] flex flex-col items-center justify-center"><RotateCw size={30} stroke="#fff" /></div>
                        <div>
                            <DialogTitle className="leading-6">Aproval</DialogTitle>
                            <div className="leading-5 text-xs text-gray-500">Create a new approval</div>
                        </div>
                    </DialogHeader>
                    <ScrollArea className="max-h-[360px] mr-[-10px] pr-[10px]">

                        <DialogDescription>
                            <div className="flex flex-wrap gap-x-2 px-1.5">
                                {
                                    actTab === null ?
                                        <>
                                            <div className="w-full mb-2.5 font-medium">Select Approvel For</div>
                                            {
                                                [{ name: "Quote", icon: <ScrollText stroke="#fff" size={30} /> }, { name: "PI", icon: <FileText size={30} stroke="#fff" /> }].map((item) => (
                                                    <Card key={item.name} className="flex-2 flex flex-row gap-3 p-2 items-center rounded-[6px]" onClick={() => setActTab(item.name)}>
                                                        <div className="w-[45px] h-[45px] flex flex-col items-center justify-center rounded-[6px] bg-[#584ccc]">{item.icon}</div>
                                                        <div>
                                                            {item.name}
                                                        </div>
                                                    </Card>
                                                ))
                                            }
                                        </>

                                        : <>
                                            <div className="w-full flex flex-col space-y-4">
                                                <div className="flex flex-col space-y-2.5">
                                                    <Label >Name Of Company</Label>
                                                    <Input type="text" defaultValue="ABC Pharmaceuticals Ltd" className="h-[45px] text-black" readOnly disabled />
                                                </div>

                                                <div className="flex flex-col space-y-2.5">
                                                    <Label >Approvers</Label>
                                                    {/* <TeamMeberApprovalList frameworks={frameworks} /> */}
                                                    <ApproversForm />
                                                </div>
                                                <div className="flex flex-col space-y-2.5">
                                                    <Label >Remarks</Label>
                                                    <Textarea placeholder="If needed, add some extra info that'll help the recipients about the request." />
                                                </div>
                                                <div className="flex flex-col space-y-2.5">
                                                    <Label>Add Attachment</Label>

                                                    {/* File drop zone with button trigger */}
                                                    <div
                                                        className={`border-dashed border-2 p-4 rounded flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                                            }`}
                                                        onDragOver={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(true);
                                                        }}
                                                        onDragLeave={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(false);
                                                        }}
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(false);
                                                            const files = e.dataTransfer.files;
                                                            if (files) {
                                                                processFiles(Array.from(files));
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex flex-col space-y-2 items-center justify-center">
                                                            <img src="/assets/images/upload-file.png" width={55} height={55} alt="Upload file" />
                                                            <div className="text-gray-600 font-medium mt-2">
                                                                {isDragging ? 'Drop files here' : 'Drag File here'}
                                                            </div>

                                                            {/* Use a Button instead of direct click on the div */}
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="text-blue-600 font-normal"
                                                                onClick={() => fileInputRef.current?.click()}
                                                            >
                                                                Or Select a File
                                                            </Button>

                                                            <div className="text-gray-500 text-sm mt-1">
                                                                Supports multiple files
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Hidden file input */}
                                                    <Input
                                                        ref={fileInputRef}
                                                        multiple
                                                        className="hidden"
                                                        type="file"
                                                        onChange={(e) => {
                                                            const files = e.target.files;
                                                            if (files && files.length > 0) {
                                                                processFiles(Array.from(files));
                                                            }
                                                            // Reset the input
                                                            if (e.target) {
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    />

                                                    {/* Uploaded files list */}
                                                    {uploadedFiles.length > 0 && (
                                                        <div className="mt-4 space-y-3">
                                                            <Label className="text-sm font-medium">Selected Files ({uploadedFiles.length})</Label>
                                                            <div className="space-y-2">
                                                                {uploadedFiles.map((fileObj) => (
                                                                    <div key={fileObj.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                                                        <div className="flex items-center space-x-3 flex-1">
                                                                            <File className="h-5 w-5 text-gray-500" />
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="text-sm font-medium truncate">
                                                                                    {fileObj.file.name}
                                                                                </div>
                                                                                <div className="text-xs text-gray-500">
                                                                                    {formatFileSize(fileObj.file.size)}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Upload progress */}
                                                                        <div className="flex items-center space-x-2">
                                                                            {fileObj.uploadProgress < 100 ? (
                                                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                                    <div
                                                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                                        style={{ width: `${fileObj.uploadProgress}%` }}
                                                                                    />
                                                                                </div>
                                                                            ) : (
                                                                                <div className="text-green-600 text-xs font-medium">
                                                                                    Uploaded
                                                                                </div>
                                                                            )}
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                                                                onClick={() => removeFile(fileObj.id)}
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-full flex flex-row justify-between mt-3">
                                                <Button variant="secondary" className="cursor-pointer" type="button" onClick={() => setActTab(null)}>Back</Button>
                                                <Button
                                                    type="button"
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        // Handle form submission with uploaded files
                                                        console.log('Uploaded files:', uploadedFiles);
                                                        setModelOpen(false);
                                                    }}
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        </>
                                }
                            </div>
                        </DialogDescription>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}

