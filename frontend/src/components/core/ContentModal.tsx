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
import useModalSize from "@/hooks/useModalSize";

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



  const modalSizeHandler = (size: string) => {
    switch (size) {
      case "sm":
        return "w-full max-w-[90vw] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[640px] xl:max-w-[700px] 2xl:max-w-[760px]";
      case "md":
        return "w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1080px]";
      case "lg":
        return "w-full max-w-[90vw] sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1300px]";
      case "xl":
        return "w-full max-w-[90vw] sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1300px] xl:max-w-[1400px] 2xl:max-w-[1500px]";
      default:
        return "w-full max-w-[90vw]";
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
       
        bg-card
        max-h-fit
        min-h-[55vh]
        border-0
         
        scrollbar-custom
        p-0
         
         
           
         `}
      >


        {/* <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter> */}
        <div
          className={`h-full   mt-1    ${modalHeightHandler(height)} ${!scrollable && "overflow-y-auto "
            }`}
        >
          {children}
        </div>
      </DialogContent>
      <DialogOverlay closeOnOutsideClick={true} />
    </Dialog>
  );
}
