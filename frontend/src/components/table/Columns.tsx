import { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { UserType } from "../../types/api.types";

import { CheckCircle, XCircle } from "lucide-react";
import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";

export const getColumns = (projectId?: string): ColumnDef<UserType>[] => {
    const columns: ColumnDef<UserType>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={row.original.profilePicture || ""} alt={row.original.name} />
                        <AvatarFallback>{row.original.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col ">
                        <span>{row.original.name}</span>
                        <span>{row.original.surname}</span>
                    </div>
                </div>
            ),
        },

        {
            accessorKey: "role",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
            cell: ({ row }) => <span>{row.original.role}</span>,
        },
        {
            accessorKey: "lastLogin",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Last Login" />,
            cell: ({ row }) => <span>{row.original.lastLogin ? row.original.lastLogin : "N/A"}</span>,
        },
        {
            accessorKey: "isActive",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const isActive = row.original.isActive;
                return (
                    <Badge
                        variant={isActive ? "success" : "outline"}
                        className={`${isActive ? "bg-emerald-100" : "bg-rose-400"} w-fit text-xs border-none flex items-center gap-1`}
                    >
                        {isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        {isActive ? "Aktywne" : "Nieaktywne"}
                    </Badge>
                );
            },
        },

        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <>
                        <DataTableRowActions row={row} />
                    </>
                );
            },
        },
    ];

    return columns;
};
