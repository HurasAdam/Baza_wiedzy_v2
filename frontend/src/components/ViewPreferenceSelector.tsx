// ViewPreferenceSelector.tsx
import { LayoutGrid, Mail, Table } from "lucide-react";
import { useViewPref } from "../contexts/ViewPreferenceContext";
import { Button } from "@/components/ui/button";

const ViewPreferenceSelector = () => {
    const { viewPreference, setViewPreference, filterPlacement, setFilterPlacement } = useViewPref();

    const options = [
        { label: "Kafelkowy", value: "default", icon: LayoutGrid },
        { label: "Mailingowy", value: "mailing", icon: Mail },
        { label: "Tabelaryczny", value: "table", icon: Table },
    ];

    return (
        <div className="flex flex-col gap-4 mt-6">
            <label className="text-sm font-medium">Widok artykułów</label>
            <div className="flex space-x-2">
                {options.map(({ value, label, icon: Icon }) => (
                    <Button
                        key={value}
                        variant={viewPreference === value ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setViewPreference(value)}
                        className="flex items-center gap-1"
                    >
                        <Icon size={16} />
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ViewPreferenceSelector;
