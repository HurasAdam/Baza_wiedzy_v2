import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { useCallback, useState } from "react";
import { Input } from "../ui/input";
  
  interface AlertModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onCancel: () => void;
    onConfirm: () => void;

  }
  
  export function AlertModal({
    isOpen,
    title,
    description,
    onCancel,
    onConfirm,
    isUsed,
 
  }: AlertModalProps) {

    const [isChecked, setIsChecked] = useState<boolean>(false)

    const handleCheckboxConfirmation = useCallback(()=>{
setIsChecked((prev)=>!prev)
    },[])

console.log("isUsed")
console.log(isUsed)

    if (!isOpen) return null; // Jeśli modal jest zamknięty, nie renderuj go
  
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          {isUsed && (
          <div className="">
            <label className="flex items-center gap-1.5  cursor-pointer">
              <Input
          className="w-4 h-4 cursor-pointer "
                type="checkbox"
                checked={isChecked}
                onChange={ handleCheckboxConfirmation}
              />
              Rozumiem <span className="text-gray-400 text-sm">(wymagane)</span>
            </label>
          </div>
        )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Anuluj</AlertDialogCancel>
            <AlertDialogAction 
            disabled={isUsed && !isChecked}
            onClick={onConfirm}>Potwierdź</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  