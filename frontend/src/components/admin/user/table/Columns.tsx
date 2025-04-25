import { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { UserType } from "../../../../types/api.types";

import { CheckCircle, XCircle } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "../../../../utils/avatar";
import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { formatDate } from "@/utils/format-date";

export const getColumns = (projectId?: string): ColumnDef<UserType>[] => {
    const columns: ColumnDef<UserType>[] = [
        {
            accessorKey: "Imie i naziwsko",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Imię i nazwisko" />,
            cell: ({ row }) => {
                const avatarColor = getAvatarColor(row.original.name);
                const initials = getAvatarFallbackText(row.original.name);
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className={`h-8 w-8 ${avatarColor}`}>
                            <AvatarImage src={row.original.profilePicture || ""} alt={row.original.name} />
                            <AvatarFallback className={`h-8 w-8 ${avatarColor}`}>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col ">
                            <span>{row.original.name}</span>
                            <span>{row.original.surname}</span>
                        </div>
                    </div>
                );
            },
        },

        {
            accessorKey: "Rola",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Rola" />,
            cell: ({ row }) => (
                <span className="uppercase text-xs font-medium text-primary-foreground">{row.original.role}</span>
            ),
        },
        {
            accessorKey: "isActive",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const isActive = row.original.isActive;

                // pełne wypełnienie vs outline
                const baseClasses =
                    "inline-flex items-center gap-1 text-xs font-medium rounded-lg px-2 py-1 border transition-colors duration-150";
                const activeClasses = "bg-emerald-700/70 border-transparent text-white hover:bg-emerald-700/80";
                const frozenClasses = "bg-rose-700 border-transparent text-white hover:bg-gray-100";

                return (
                    <Badge
                        // opcjonalnie możesz usunąć `variant` i zawsze bazować na klasach
                        className={`${baseClasses} ${isActive ? activeClasses : frozenClasses}`}
                    >
                        {isActive ? (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Aktywne
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4" />
                                Nieaktywne
                            </>
                        )}
                    </Badge>
                );
            },
        },

        {
            accessorKey: "Ostatnie logowanie",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ostatnie logowanie" />,
            cell: ({ row }) => <span>{row.original.lastLogin ? formatDate(row.original.lastLogin) : "N/A"}</span>,
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
