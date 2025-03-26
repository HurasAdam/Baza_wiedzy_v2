import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { UserType } from "../../../../types/api.types";

import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";

export const getColumns = (projectId?: string): ColumnDef<UserType>[] => {
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "nazwa tagu",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Nazwa tagu" />,
            // Używamy właściwego klucza z danymi, czyli "name"
            cell: ({ row }) => <span>{row.original.name}</span>,
        },
        {
            accessorKey: "isUsed",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Czy użyty w artykule" />,
            cell: ({ row }) => {
                const isUsed = row.original.isUsed;
                return isUsed ? (
                    <Badge className="hover:bg-green-600 w-fit text-xs bg-emerald-600/80 text-foreground">Tak</Badge>
                ) : (
                    <Badge className="w-fit text-xs text-foreground bg-rose-700/80">Nie</Badge>
                );
            },
        },
        {
            id: "actions",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Akcje" />,
            cell: ({ row }) => <DataTableRowActions row={row} />,
        },
    ];

    return columns;
};
