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
}

export function Alert({ isOpen, onCancel, onConfirm, children, requireConfirmation = false }: Props) {
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
                    <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
                    <AlertDialogDescription>{children}</AlertDialogDescription>
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
                    <AlertDialogCancel onClick={onCancel}>Anuluj</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={requireConfirmation && !isChecked}>
                        Potwierdź
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
