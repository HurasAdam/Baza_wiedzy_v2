import type { ReactNode } from "react";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";

type SizeModal = 'sm' | 'md' | 'lg' | 'xl';
type HeightModal = 'sm' | 'md' | 'lg';

const modalSizes = {
  sm: "sm:max-w-[480px] md:max-w-[600px] lg:max-w-[640px] xl:max-w-[700px] 2xl:max-w-[760px] p-2",
  md: "sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1080px] px-5",
  lg: "sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1300px] p-4",
  xl: "sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1300px] xl:max-w-[1400px] 2xl:max-w-[1500px] p-6",
}

interface ContentModalProps {
  isOpen: true,
  children: ReactNode;
  onClose(): void;
  size?: SizeModal;
  height: HeightModal;
  closeOnOutsideClick?: boolean;
}

const modalHeightes = {
  sm: 20,
  md: 50,
  lg: 80
}

export const ContentModal = ({
  isOpen,
  children,
  onClose,
  size,
  height = 'lg',
  closeOnOutsideClick = true,
}: ContentModalProps) => {

  const heightValue = modalHeightes[height];
  
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
          {
            // "overflow-y-auto": scrollable,
            [modalSizes[size as SizeModal]]: size,
            [`h-[${heightValue}vh]`]: true
          })
        }
      >
        <div className="mt-6 overflow-auto">
          {/* <div className="p-4 overflow-y-auto"> */}
            {children}
          {/* </div> */}
        </div>
      </DialogContent>
      <DialogOverlay />
    </Dialog>
  );
}
