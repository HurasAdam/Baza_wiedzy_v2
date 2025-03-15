import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useModalSettings } from "@/contexts/ModalSettingsContext";
import clsx from "clsx";
import type { ModalProps } from "./types";

const typesWidthModal = {
    sm: "sm:max-w-[480px] md:max-w-[600px] lg:max-w-[640px] xl:max-w-[700px] 2xl:max-w-[760px] p-0",
    md: "sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1080px] p-0 ",
    lg: "sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1300px] p-0",
    xl: "sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1300px] xl:max-w-[1400px] 2xl:max-w-[1500px] p-0",
} as const;

const modalHeightes = {
    sm: "h-[50vh]",
    md: "h-[78vh]",
    lg: "h-[92vh]",
} as const;

export const Modal = ({ isOpen, children, onClose, width, height = "lg", closeOnOutsideClick = true }: ModalProps) => {
    const { modalWidth } = useModalSettings();

    const heightValue = modalHeightes[height];
    const widthValue = typesWidthModal[width ?? modalWidth];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                onInteractOutside={(e) => {
                    if (!closeOnOutsideClick) {
                        e.preventDefault();
                    }
                }}
                className={clsx("filter-none scrollbar-custom bg-card w-full", widthValue, heightValue)}
            >
                <div className=" overflow-auto scrollbar-custom">{children}</div>
            </DialogContent>
            <DialogOverlay />
        </Dialog>
    );
};
