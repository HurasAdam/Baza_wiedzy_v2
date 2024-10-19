import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
 
export function ContentModal({isOpen,children, onClose,title,description}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} >

      <DialogContent className=" min-w-[50vw] max-w-fit max-h-[90vh]  overflow-y-auto scrollbar-custom  ">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl ">{title}</DialogTitle>
          <DialogDescription className="text-sm">
          {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 filter-none backdrop-blur-sm">
     {children}
        </div>
        <DialogFooter>

           <Button type="button" onClick={onClose}>Anuluj</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}