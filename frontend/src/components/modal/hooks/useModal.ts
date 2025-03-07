import { useState } from "react";
// import type { UseModal, UseModalProps } from "./types";
import type { UseModal } from "../types";

// export const useModal = (config: UseModalProps): UseModal => {
export const useModal = (): UseModal => {
    const [isOpen, setOpen] = useState(false);

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    return {
        isOpen,
        // config,
        openModal,
        closeModal
    }
}
