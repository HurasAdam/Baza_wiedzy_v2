import clsx from "clsx";
import { useModalSettings } from "../contexts/ModalSettingsContext";

const modalWidthOptions = [
    { value: "sm", label: "Mały", previewClass: "w-[50%]" },
    { value: "md", label: "Średni", previewClass: "w-[60%]" },
    { value: "lg", label: "Duży", previewClass: "w-[70%]" },
    { value: "xl", label: "Bardzo duży", previewClass: "w-[85%]" },
] as const;

export const ToggleWidthModalButton = ({}) => {
    const { modalWidth, changeModalWidth } = useModalSettings();

    return (
        <div className="flex flex-wrap gap-5">
            {modalWidthOptions.map((option) => (
                <div key={option.value}>
                    <div className="mb-1.5 px-1 text-center">{option.label}</div>
                    <button
                        onClick={() => changeModalWidth(option.value)}
                        className={clsx(
                            "relative w-48 h-32 rounded-lg border-4 overflow-hidden shadow-md flex flex-col items-center justify-center",
                            {
                                "border-blue-500 ring-2 ring-blue-300": modalWidth === option.value,
                                "border-muted": modalWidth !== option.value,
                            }
                        )}
                    >
                        <ModalWidthPreview previewClass={option.previewClass} />
                        {modalWidth === option.value && (
                            <div className="absolute inset-0 flex items-center justify-center text-foreground font-bold text-sm">
                                Wybrano
                            </div>
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
};

const ModalWidthPreview = ({ previewClass }: { previewClass: string }) => {
    return (
        <div className="w-full h-full flex flex-col">
            {/* NAVBAR */}
            <div className="h-1/5 bg-card" />
            <div className="flex h-full bg-card">
                {/* SIDEBAR*/}
                <div className="w-[10px] flex flex-col justify-between" />

                {/* MAIN CONTENT*/}
                <div className="h-full flex flex-col gap-2 items-center justify-center w-full bg-background">
                    <div className={clsx("h-3/4 bg-card border border-muted rounded-md", previewClass)}></div>
                </div>
            </div>
        </div>
    );
};
