import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import TableSkeleton from "../../../skeleton-loaders/table-skeleton";
import { DataTablePagination } from "./table-pagination";

interface PaginationProps {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    filtersToolbar?: React.ReactNode;
    pagination?: PaginationProps;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    setFilters: () => void;
}

export function DataTable<TData, TValue>({
    setFilters,
    columns,
    data,
    isLoading,
    filtersToolbar,
    pagination,
    onPageChange,
    onPageSizeChange,
}: DataTableProps<TData, TValue>) {
    const { totalCount = 0, pageNumber = 1, pageSize = 10 } = pagination || {};

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: { pageIndex: pageNumber - 1, pageSize },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
    });

    return (
        <div className="w-full space-y-2">
            <div className="block w-full lg:flex lg:items-center lg:justify-between">
                {filtersToolbar && <div className="flex-1"> {filtersToolbar}</div>}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto w-full lg:w-auto bg-card text-xs">
                            Kolumny <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card" align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-lg border ">
                {isLoading ? (
                    <TableSkeleton columns={6} rows={10} />
                ) : (
                    <Table className="">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-muted/20">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="text-foreground/80  h-fit py-0.5 ">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className=" text-foreground hover:bg-card   "
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell className="px-3.5 py-2 " key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="hover:bg-background">
                                    <TableCell colSpan={columns.length} className="h-24 text-center ">
                                        <div className="h-[580px] p-0 m-0 flex justify-center items-start">
                                            <EmptyState
                                                onReset={() => {
                                                    setFilters({
                                                        name: null,
                                                        keyword: null,
                                                        isActive: null,
                                                        role: null,
                                                        priority: null,
                                                        projectId: null,
                                                        assigneeId: null,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
            <DataTablePagination
                table={table}
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />
        </div>
    );
}
