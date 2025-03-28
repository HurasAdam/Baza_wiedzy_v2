import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TaskType } from "../../../../types/api.types";
import TopicForm from "../../../forms/TopicForm";
import { Modal } from "../../../modal/Modal";
import { useModal } from "../../../modal/hooks/useModal";

interface DataTableRowActionsProps {
    row: Row<TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const [openDeleteDialog, setOpenDialog] = useState(false);
    const { openModal, isOpen, closeModal } = useModal();
    const taskId = row.original._id as string;
    const taskCode = row.original.taskCode;

    const handleConfirm = () => {
        // mutate(
        //     {
        //         workspaceId,
        //         taskId,
        //     },
        //     {
        //         onSuccess: (data) => {
        //             queryClient.invalidateQueries({
        //                 queryKey: ["all-tasks", workspaceId],
        //             });
        //             toast({
        //                 title: "Success",
        //                 description: data.message,
        //                 variant: "success",
        //             });
        //             setTimeout(() => setOpenDialog(false), 100);
        //         },
        //         onError: (error) => {
        //             toast({
        //                 title: "Error",
        //                 description: error.message,
        //                 variant: "destructive",
        //             });
        //         },
        //     }
        // );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <MoreHorizontal />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem className="cursor-pointer" onClick={openModal}>
                        Edytuj
                        <DropdownMenuShortcut>✏️</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className={`!text-destructive cursor-pointer ${taskId}`}
                        onClick={() => setOpenDialog(true)}
                    >
                        Usuń
                        <DropdownMenuShortcut>🗑️</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Modal isOpen={isOpen} onClose={closeModal} height="" width="sm">
                <TopicForm onClose={closeModal} topicId={taskId} />
            </Modal>

            {/* <ConfirmDialog
                isOpen={openDeleteDialog}
                isLoading={isPending}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleConfirm}
                title="Delete Task"
                description={`Are you sure you want to delete ${taskCode}`}
                confirmText="Delete"
                cancelText="Cancel"
            /> */}
        </>
    );
}
