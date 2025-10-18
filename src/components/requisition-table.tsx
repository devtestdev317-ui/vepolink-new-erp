import { useState } from 'react';
import type{
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ManpowerRequisition } from '@/types/recruitment';
import { Edit, Trash2, FileText } from 'lucide-react';

interface RequisitionTableProps {
  data: ManpowerRequisition[];
  onEdit: (requisition: ManpowerRequisition) => void;
  onDelete: (id: string) => void;
  onGenerateOffer: (requisition: ManpowerRequisition) => void;
}

export function RequisitionTable({
  data,
  onEdit,
  onDelete,
  onGenerateOffer,
}: RequisitionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<ManpowerRequisition>[] = [
    {
      accessorKey: 'requisitionId',
      header: 'Requisition ID',
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'positionTitle',
      header: 'Position Title',
    },
    {
      accessorKey: 'numberOfOpenings',
      header: 'Openings',
    },
    {
      accessorKey: 'experience',
      header: 'Experience',
    },
    {
      accessorKey: 'budgetedCTC',
      header: 'Budgeted CTC',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('budgetedCTC'));
        const formatted = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(amount);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'hiringManager',
      header: 'Hiring Manager',
    },
    {
      accessorKey: 'requestDate',
      header: 'Request Date',
      cell: ({ row }) => {
        return new Date(row.getValue('requestDate')).toLocaleDateString();
      },
    },
    {
      accessorKey: 'approvalStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('approvalStatus') as string;
        const variant = {
          approved: 'default',
          pending: 'secondary',
          rejected: 'destructive',
          draft: 'outline',
        }[status] as 'default' | 'secondary' | 'destructive' | 'outline';

        return (
          <Badge variant={variant}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const requisition = row.original;

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(requisition)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateOffer(requisition)}
              disabled={requisition.approvalStatus !== 'approved'}
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(requisition.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
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
                  data-state={row.getIsSelected() && 'selected'}
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
                  No requisitions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{' '}
          {data.length} requisitions
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}