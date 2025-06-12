import { Loader } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { ConfirmationCheckbox } from "../core/ConfirmationCheckbox";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

interface Props {
    isOpen: boolean;
    children: ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
    requireConfirmation?: boolean;
    type?: "warning" | "info";
    isLoading: boolean;
}
const titleColors = {
    warning: "text-rose-600",

    info: "text-blue-600",
    success: "text-green-600",
};
export function Alert({
    isOpen,
    onCancel,
    onConfirm,
    children,
    requireConfirmation = false,
    type = "warning",
    isLoading,
}: Props) {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsChecked(false);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className={`${titleColors[type]} text-lg font-bold`}>
                        Czy na pewno chcesz kontynuować?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="pt-1.5 pb-0.5">{children}</AlertDialogDescription>
                </AlertDialogHeader>
                {requireConfirmation && (
                    <ConfirmationCheckbox
                        onChange={setIsChecked}
                        checked={isChecked}
                        label="Rozumiem"
                        id="confirmation"
                    />
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-muted" onClick={onCancel}>
                        Anuluj
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={requireConfirmation && !isChecked}>
                        {isLoading && <Loader className="animate-spin" />}
                        Potwierdź
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
