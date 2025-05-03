// ViewPreferenceSelector.tsx
import { LayoutGrid, Mail, Table } from "lucide-react";
import { useViewPref } from "../contexts/ViewPreferenceContext";
import { Button } from "@/components/ui/button";
import { ViewPreview } from "./ViewPreview";

const ViewPreferenceSelector = () => {
    const options = ["default", "mailing", "table"] as const;
    const { viewPreference, setViewPreference, filterPlacement, setFilterPlacement } = useViewPref();

    // const options = [
    //     { label: "Kafelkowy", value: "default", icon: LayoutGrid },
    //     { label: "Mailingowy", value: "mailing", icon: Mail },
    //     { label: "Tabelaryczny", value: "table", icon: Table },
    // ];

    return (
        <div className="flex flex-col gap-4 mt-6">
            <label className="text-sm font-medium">Widok artykułów</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                {options.map((opt) => (
                    <button key={opt} type="button" className="w-full" onClick={() => setViewPreference(opt)}>
                        <ViewPreview view={opt} selected={viewPreference === opt} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ViewPreferenceSelector;
