import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useModalSettings } from "@/contexts/PreferencesSettingsContext";
import { ModalProps, WidthModal } from "./types";

const modalSizes = {
  sm: "sm:max-w-[480px] md:max-w-[600px] lg:max-w-[640px] xl:max-w-[700px] 2xl:max-w-[760px] p-2",
  md: "sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1080px] px-5",
  lg: "sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1300px] p-4",
  xl: "sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1300px] xl:max-w-[1400px] 2xl:max-w-[1500px] p-6",
}

const modalHeightes = {
  sm: 20,
  md: 50,
  lg: 80
}

export const Modal = ({
  isOpen,
  children,
  onClose,
  width,
  height = 'md',
  closeOnOutsideClick = true,
}: ModalProps) => {
  const { modalSize } = useModalSettings();

  const heightValue = modalHeightes[height];
  const widthValue = width ?? modalSize;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => {
          if (!closeOnOutsideClick) {
            e.preventDefault();
          }
        }}
        className={clsx(
          `filter-none scrollbar-custom bg-card scrollbar-custom w-full`, 
          modalSizes[widthValue as WidthModal],
          `h-[${heightValue}vh]`
        )}
      >
        <div className="mt-6 overflow-auto">
            {children}
        </div>
      </DialogContent>
      <DialogOverlay />
    </Dialog>
  );
}
