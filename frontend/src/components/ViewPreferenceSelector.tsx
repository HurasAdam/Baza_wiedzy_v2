import { LayoutGrid, Mail, Table } from "lucide-react"; // Uwaga: zmiana z `List` na `Table` dla jasności
import { useViewPref } from "../contexts/ViewPreferenceContext";

const ViewPreferenceSelector = () => {
    const { viewPreference, setViewPreference } = useViewPref();

    const options = [
        {
            label: "Kafelkowy",
            value: "default",
            icon: LayoutGrid,
        },
        {
            label: "Mailingowy",
            value: "mailing",
            icon: Mail,
        },
        {
            label: "Tabelaryczny",
            value: "table",
            icon: Table,
        },
    ];

    return (
        <div className="flex flex-col gap-2 mt-6">
            <label className="text-sm font-medium text-foreground mb-2">Widok artykułów</label>
            <div className="flex border border-muted rounded-lg overflow-hidden w-fit shadow-sm">
                {options.map(({ value, label, icon: Icon }) => (
                    <button
                        key={value}
                        onClick={() => setViewPreference(value)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors
                            ${
                                viewPreference === value
                                    ? "bg-primary text-white"
                                    : "bg-background hover:bg-muted text-foreground"
                            }`}
                        aria-pressed={viewPreference === value}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ViewPreferenceSelector;
