import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { UserType } from "../../../../types/api.types";

import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";

export const getColumns = (projectId?: string): ColumnDef<UserType>[] => {
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "temat rozmowy",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Temat rozmowy" />,
            cell: ({ row }) => <span>{row.original.title}</span>,
        },

        {
            accessorKey: "produkt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Produkt" />,
            cell: ({ row }) => {
                const product = row.original.product;
                return (
                    <Badge
                        style={{ backgroundColor: product.labelColor }}
                        className="w-fit text-[10px] border-none flex items-center gap-1 text-white uppercase rounded-lg"
                    >
                        {product.name}
                    </Badge>
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
