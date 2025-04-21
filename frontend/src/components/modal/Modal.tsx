import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useModalSettings } from "@/contexts/ModalSettingsContext";
import clsx from "clsx";
import React from "react";
import type { ModalProps } from "./types";

const typesWidthModal = {
    sm: "sm:max-w-[98%] md:max-w-[84%] lg:max-w-[75%px] xl:max-w-[65%] 2xl:max-w-[1050px] p-0",
    md: "sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1190px] p-0 ",
    lg: "sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1400px] p-0",
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

    const content = React.isValidElement(children) ? React.cloneElement(children, { modalWidth, onClose }) : children;

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
                <div className=" overflow-auto scrollbar-custom">{content}</div>
            </DialogContent>
            <DialogOverlay />
        </Dialog>
    );
};
