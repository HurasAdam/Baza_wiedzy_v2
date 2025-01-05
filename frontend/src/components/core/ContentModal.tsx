import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

export function ContentModal({
  isOpen,
  scrollable = true,
  children,
  onClose,
  title = "",
  description = "",
  size,
  height,
  closeOnOutsideClick,
}) {
  console.log("closeOnOutsideClick");
  console.log(closeOnOutsideClick);

  const modalSizeHandler = (size) => {
    switch (size) {
      case "sm":
        return " md:max-w-[38vw] min-w-[38vw]  "; // Mały modal na md i większych ekranach
      case "md":
        return "max-w-[80vw] min-w-[80vw] sm:max-w-[70vw] sm:min-w-[70vw]  md:max-w-[80vw] md:min-w-[80vw] lg:max-w-[60vw] lg:min-w-[60vw]  xl:max-w-[38vw] xl:min-w-[38vw]"; // Średni modal na md i większych ekranach
      case "lg":
        return "xl:max-w-[70vw] lg:min-w-[70vw] md:max-w-[85vw] md:min-w-[90vw]"; // Duży modal na lg i większych ekranach, a na md większy
      case "xl":
        return "max-w-[90vw] min-w-[90vw] xl:max-w-[72vw] lg:min-w-[70vw] md:max-w-[85vw] md:min-w-[90vw]"; // Duży modal na lg i większych ekranach, a na md większy
      default:
        return "max-w-[90vw] min-w-[90vw] lg:min-w-[60vw] lg:max-w-[84vw] xl:min-w-[50vw] xl:max-w-[61vw] "; // Domyślny rozmiar na dużych ekranach
    }
  };

  const modalHeightHandler = (height) => {
    return height ? `min-h-[${height}vh]` : "min-h-[60vh]";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
           ${scrollable ? "overflow-y-auto" : "overflow-hidden"} 
         scrollbar-custom
         
           
         `}
      >
        <DialogHeader>
          <DialogTitle className=" "></DialogTitle>
          {/* <DialogDescription>
       {description}
        </DialogDescription> */}
        </DialogHeader>

        {/* <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter> */}
        <div
          className={`h-full   mt-1    ${modalHeightHandler(height)} ${
            !scrollable && "overflow-y-auto "
          }`}
        >
          {children}
        </div>
      </DialogContent>
      <DialogOverlay closeOnOutsideClick={true} />
    </Dialog>
  );
}
