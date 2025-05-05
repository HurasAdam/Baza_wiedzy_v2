import { Row } from "@tanstack/react-table";
import { AlertTriangle, CheckCircle, MoreHorizontal, XCircle } from "lucide-react";
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
import { Alert } from "@/components/alert/Alert";
import { useAlert } from "@/components/alert/hooks/useAlert";
import { is } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin.api";
import toast from "react-hot-toast";
import { FaKey } from "react-icons/fa";

interface DataTableRowActionsProps {
    row: Row<TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const queryClient = useQueryClient();
    const { isOpen, openAlert, closeAlert } = useAlert();
    const {
        isOpen: isResetPasswordAlertOpen,
        openAlert: openResetPasswordAlert,
        closeAlert: closeResetPasswordAlert,
    } = useAlert();
    const userId = row.original._id;
    const taskId = row.original._id as string;
    const isEnabled = row.original.isActive;

    const name = row.original.name;
    const surname = row.original.surname;

    const { mutate: disableUserAccountMutation, isLoading } = useMutation({
        mutationFn: (id) => {
            return adminApi.disableUserAccount(id);
        },
        onSuccess: () => {
            toast.success(`Konto użytkownika ${name} ${surname} zostało wyłączone `);
            closeAlert();
            queryClient.invalidateQueries(["all-users"]);
        },
        onError: ({ status }) => {
            // const status = error.response?.status;
            if (status === 400) {
                closeAlert();
                return toast.error("Wystąpił błąd - Nieprawidłowy identyfikator użytkownika");
            }
            if (status === 404) {
                closeAlert();
                return toast.error("Wystąpił błąd - Nie znaleziono użytkownika");
            }
            closeAlert();
            toast.error("Coś poszło nie tak. Spróbuj ponownie.");
        },
    });

    const { mutate: enableUserAccountMutation } = useMutation({
        mutationFn: (id) => {
            return adminApi.enableUserAccount(id);
        },
        onSuccess: () => {
            toast.success(`Konto użytkownika ${name} ${surname} zostało włączone `);
            closeAlert();
            queryClient.invalidateQueries(["all-users"]);
        },
        onError: ({ status }) => {
            if (status === 400) {
                closeAlert();
                return toast.error("Wystąpił błąd - Nieprawidłowy identyfikator użytkownika");
            }
            if (status === 404) {
                closeAlert();
                return toast.error("Wystąpił błąd - Nie znaleziono użytkownika");
            }
            closeAlert();
            toast.error("Coś poszło nie tak. Spróbuj ponownie.");
        },
    });

    const { mutate: resetUserPasswordMutation } = useMutation({
        mutationFn: (id) => {
            return adminApi.resetUserPassword(id);
        },
        onSuccess: () => {
            toast.success(`Ustationo domyślne hasło dla konta użytkownika ${name} ${surname}  `);
            closeAlert();
            queryClient.invalidateQueries(["all-users"]);
        },
        onError: ({ status }) => {
            if (status === 400) {
                closeAlert();
                return toast.error("Wystąpił błąd - Nieprawidłowy identyfikator użytkownika");
            }
            if (status === 404) {
                closeAlert();
                return toast.error("Wystąpił błąd - Nie znaleziono użytkownika");
            }
            closeAlert();
            toast.error("Coś poszło nie tak. Spróbuj ponownie.");
        },
    });

    const onDisableConfirm = (id) => {
        disableUserAccountMutation(id);
    };

    const onEnableConfirm = (id) => {
        enableUserAccountMutation(id);
    };

    const onConfirmHandler = (id) => {
        if (isEnabled) {
            return onDisableConfirm(id);
        } else {
            return onEnableConfirm(id);
        }
    };

    const onConfirmPasswordReset = (id) => {
        resetUserPasswordMutation(id);
    };

    const openDeleteAlert = () => {
        openAlert();
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
                    <DropdownMenuItem className="cursor-pointer">Otwórz</DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="cursor-pointer">Zarządzaj</DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className={`cursor-pointer ${taskId}`} onClick={openResetPasswordAlert}>
                        Zresetuj hasło
                        <DropdownMenuShortcut>
                            <FaKey className="w-4 h-4 " />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className={`${isEnabled ? "text-rose-600" : "text-green-600"} cursor-pointer ${taskId}`}
                        onClick={openDeleteAlert}
                    >
                        {isEnabled ? "Wyłącz konto" : "Włącz konto"}
                        <DropdownMenuShortcut>
                            {isEnabled ? (
                                <XCircle className="w-4 h-4 text-rose-600" />
                            ) : (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

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
            <Alert
                requireConfirmation={true}
                isOpen={isOpen}
                onCancel={closeAlert}
                onConfirm={() => onConfirmHandler(userId)}
                isLoading={isLoading}
            >
                {isEnabled ? (
                    <div className="flex items-center  space-x-3">
                        <AlertTriangle className="w-5 h-5 mt-1 text-rose-600" />
                        <p className="text-sm text-primary-foreground dark:text-gray-200">
                            Czy na pewno chcesz <span className="font-semibold text-rose-600">wyłączyć</span> konto
                            użytkownika&nbsp;
                            <span className="font-semibold text-primary">
                                {name} {surname}
                            </span>{" "}
                            ?
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center  space-x-3">
                        <AlertTriangle className="w-5 h-5 mt-1 text-rose-600" />
                        <p className="text-sm text-primary-foreground dark:text-gray-200">
                            Czy na pewno chcesz <span className="font-semibold text-green-600">Włączyć</span> konto
                            użytkownika&nbsp;
                            <span className="font-semibold text-primary ">
                                {name} {surname}
                            </span>{" "}
                            ?
                        </p>
                    </div>
                )}
            </Alert>

            <Alert
                requireConfirmation={true}
                isOpen={isResetPasswordAlertOpen}
                onCancel={closeResetPasswordAlert}
                onConfirm={() => onConfirmPasswordReset(userId)}
                isLoading={isLoading}
            >
                <div className="flex items-center  space-x-3">
                    <AlertTriangle className="w-5 h-5 mt-1 text-rose-600" />
                    <p className="text-sm text-primary-foreground dark:text-gray-200">
                        Czy na pewno chcesz <span className="font-semibold text-rose-600">Zresetować</span> hasło
                        użytkownika&nbsp;
                        <span className="font-semibold text-primary">
                            {name} {surname}
                        </span>{" "}
                        ?
                    </p>
                </div>
            </Alert>
        </>
    );
}
