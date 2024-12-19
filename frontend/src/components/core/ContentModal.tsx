import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog"

 
export function ContentModal({isOpen,children, onClose,title ="",description = "", size, height,closeOnOutsideClick   }) {

console.log("closeOnOutsideClick")
console.log(closeOnOutsideClick)

  const modalSizeHandler = (size) => {
    switch (size) {
      case "sm":
        return " md:max-w-[38vw] min-w-[38vw]  "; // Mały modal na md i większych ekranach
      case "md":
        return "md:max-w-[66vw] md:min-w-[66vw]"; // Średni modal na md i większych ekranach
      case "lg":
        return "xl:max-w-[70vw] lg:min-w-[70vw] md:max-w-[85vw] md:min-w-[90vw]"; // Duży modal na lg i większych ekranach, a na md większy
      default:
        return "max-w-[80vw] min-w-[80vw] lg:min-w-[60vw] lg:max-w-[60vw] xl:min-w-[50vw] xl:max-w-[50vw] "; // Domyślny rozmiar na dużych ekranach
    }
  };


  const modalHeightHandler = (height) => {
    return height ? `min-h-[${height}vh]` : "min-h-[60vh]";
  };


  return (

    <Dialog open={isOpen} onOpenChange={onClose} >
    {/* <DialogTrigger asChild>
      <Button variant="outline">Edit Profile</Button>
    </DialogTrigger> */}
    <DialogContent 
        onInteractOutside={(e) => {
          // Zatrzymujemy zamknięcie modalu tylko wtedy, gdy closeOnOutsideClick jest true
          if (!closeOnOutsideClick) {
            e.preventDefault(); // Zatrzymuje zamknięcie po kliknięciu na overlay
          }
        }}

    className={`
      ${modalHeightHandler(height)}
            ${modalSizeHandler(size)}  // Szerokość zależna od propsa size
         filter-none 
        bg-neutral-100
        h-fit max-h-[92vh]
         overflow-y-auto scrollbar-custom
         
         `}
    
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-0.5 ">
       
          {title && title}</DialogTitle>
        <DialogDescription>
       {description}
        </DialogDescription>
        <div className="h-9"></div>
     <div className="">
     {children}
     </div>
      </DialogHeader>
      
      {/* <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter> */}
    </DialogContent >
    <DialogOverlay closeOnOutsideClick={true} />
  </Dialog>
  )
}