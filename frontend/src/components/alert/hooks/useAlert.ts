import { useState } from "react";
import { UseAlert } from "../types";

export const useAlert = (): UseAlert => {
    const [isOpen, setOpen] = useState(false);

    const openAlert = () => setOpen(true);
    const closeAlert = () => setOpen(false);

    return {
        isOpen,
        openAlert,
        closeAlert,
    };
};
