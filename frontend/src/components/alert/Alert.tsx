import { ReactNode } from "react";
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

interface AlertModalProps {
    isOpen: boolean;
    children: ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
}

export function Alert({ isOpen, onCancel, onConfirm, children }: AlertModalProps) {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Czy jestes pewien</AlertDialogTitle>
                    <AlertDialogDescription>{children}</AlertDialogDescription>
                </AlertDialogHeader>
                {/* {isUsed && (
                    <div className="">
                        <label className="flex items-center gap-1.5  cursor-pointer">
                            <Input
                                className="w-4 h-4 cursor-pointer "
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxConfirmation}
                            />
                            Rozumiem <span className="text-gray-400 text-sm">(wymagane)</span>
                        </label>
                    </div>
                )} */}
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Anuluj</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Potwierdź</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
