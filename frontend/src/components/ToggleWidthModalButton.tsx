// ModalWidthToggleButton.jsx
import { Home } from "lucide-react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { ImStatsBars2 } from "react-icons/im";
import { PiArticleMediumFill } from "react-icons/pi";
import { useModalSettings } from "../contexts/ModalSettingsContext";
import useTheme from "../hooks/useTheme";

const modalWidthOptions = [
    { value: "sm", label: "Mały", previewClass: "w-[48%]" },
    { value: "md", label: "Średni", previewClass: "w-[62%]" },
    { value: "lg", label: "Duży", previewClass: "w-[72%]" },
    { value: "xl", label: "Bardzo duży", previewClass: "w-[85%]" },
];
const primaryMenuItems = [
    { icon: <Home size={7} /> },
    { icon: <PiArticleMediumFill size={7} /> },
    { icon: <ImStatsBars2 size={7} /> },
    { icon: <FaPhoneSquareAlt size={7} /> },
];

const ToggleWidthModalButton = ({}) => {
    const { modalWidth, changeModalWidth } = useModalSettings();

    return (
        <div className="flex flex-wrap gap-4 p-4 justify-between  shadow">
            {modalWidthOptions.map((option) => (
                <div key={option.value}>
                    <div className="mb-1.5 px-1">
                        <span className="text-xs text-foreground">{option.label}</span>
                    </div>
                    <button
                        onClick={() => changeModalWidth(option.value)}
                        className={`relative w-52 h-36 rounded-lg border-2 overflow-hidden shadow-md flex flex-col items-center justify-center
    ${modalWidth === option.value ? "border-blue-500 ring-2 ring-blue-300" : "border-muted"}
  `}
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

const ModalWidthPreview = ({ previewClass }) => {
    const { theme, changeTheme } = useTheme();

    return (
        <div className={` w-full h-full flex flex-col`}>
            {/* NAVBAR */}
            <div className={`h-1/5  bg-card`} />

            <div className="flex h-full bg-card">
                {/* SIDEBAR*/}
                <div className={`w-[10px]    flex flex-col justify-between `}>
                    {primaryMenuItems?.map((item) => {
                        return <div className={` `}>{item.icon}</div>;
                    })}
                </div>

                {/* MAIN CONTENT*/}
                <div className={`h-full flex flex-col gap-2 items-center justify-center w-full bg-background  `}>
                    <div className={`$ bg-card border border-muted rounded-md ${previewClass} h-3/4`}></div>
                </div>
            </div>
        </div>
    );
};

export default ToggleWidthModalButton;
