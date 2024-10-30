import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

 
export function ContentModal({isOpen,children, onClose,title,description,enableOutsideClickClose, size }) {

  const modalSizeHandler = (size) => {
    switch (size) {
      case "sm":
        return "md:max-w-[40vw] min-w-[40vw]"; // Mały modal na md i większych ekranach
      case "md":
        return "md:max-w-[80vw] md:min-w-[80vw]"; // Średni modal na md i większych ekranach
      case "lg":
        return "xl:max-w-[70vw] lg:min-w-[70vw] md:max-w-[85vw] md:min-w-[90vw]"; // Duży modal na lg i większych ekranach, a na md większy
      default:
        return "max-w-[50vw] min-w-[50vw]"; // Domyślny rozmiar na dużych ekranach
    }
  };



  console.log(size)

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >

      <DialogContent 
        className={`
          ${modalSizeHandler(size)}  // Szerokość zależna od propsa size
         filter-none 
      
          min-h-[90vh] max-h-[90vh] 
          overflow-y-auto scrollbar-custom`}
        onInteractOutside={(e) => {
          if (!enableOutsideClickClose) e.preventDefault();
        }}
             onInteractOutside={(e) => {
              if(!enableOutsideClickClose)
              e.preventDefault();
            }}
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl ">{title}</DialogTitle>
          <DialogDescription className="text-sm">
          {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
        <div className="w-full gap-4 py-4 filter-none h-screen">
     {children}
        </div>
    
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}