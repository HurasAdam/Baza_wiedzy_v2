import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  
  interface AlertModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onCancel: () => void;
    onConfirm: () => void;
    isUsed?:boolean;
  }
  
  export function AlertModal({
    isOpen,
    title,
    description,
    onCancel,
    onConfirm,
    isUsed,
    isChecked
  }: AlertModalProps) {


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
          <div>
            <label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onCheckChange(e.target.checked)}
              />
              Potwierdź, że chcesz usunąć tag, który jest już używany w artykule.
            </label>
          </div>
        )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Potwierdź</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  