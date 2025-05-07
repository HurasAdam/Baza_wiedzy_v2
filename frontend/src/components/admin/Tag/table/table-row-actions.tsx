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

import { tagApi } from "@/lib/tag.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskType } from "../../../../types/api.types";
import { Alert } from "../../../alert/Alert";
import { useAlert } from "../../../alert/hooks/useAlert";
import TagForm from "../../../forms/TagForm";
import { useModal } from "../../../modal/hooks/useModal";
import { Modal } from "../../../modal/Modal";
import toast from "react-hot-toast";

interface DataTableRowActionsProps {
    row: Row<TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const queryClient = useQueryClient();
    const [openDeleteDialog, setOpenDialog] = useState(false);
    const { openModal, isOpen, closeModal } = useModal();
    const { openAlert, isOpen: isDeleteAlertOpen, closeAlert } = useAlert();
    const taskId = row.original._id as string;
    const taskCode = row.original.taskCode;

    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            return tagApi.deleteOne(taskId);
        },
        onSuccess: () => {
            closeAlert();
            queryClient.invalidateQueries(["all-tags"]);
            toast.success("Tag został pomyślnie usunięty");
        },
    });

    const handleDeleteTag = (): void => {
        mutate();
    };

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

                    <DropdownMenuItem className={`!text-destructive cursor-pointer ${taskId}`} onClick={openAlert}>
                        Usuń
                        <DropdownMenuShortcut>🗑️</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal isOpen={isOpen} onClose={closeModal} height="" width="sm">
                <TagForm tagId={taskId} />
            </Modal>

            <Alert
                isLoading={isPending}
                isOpen={isDeleteAlertOpen}
                onCancel={closeAlert}
                requireConfirmation={true}
                onConfirm={handleDeleteTag}
            >
                <div className="flex gap-2 ">
                    Jesteś pewien że chcesz usunąć produkt :
                    <span className="text-rose-600 font-semibold ">{row.original.name}</span>
                </div>
            </Alert>
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
