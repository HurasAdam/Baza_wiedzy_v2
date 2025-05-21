import { TabKey } from "../../pages/StatisticsPage";

const TABS = [
    { key: "topics", label: "Odnotowane tematy rozmów" },
    { key: "addedArticles", label: "Dodane artykuły" },
    { key: "editedArticles", label: "Edytowane artykuły" },
];

export const TabNavigation = ({ activeTab, onChange }: { activeTab: TabKey; onChange: (key: TabKey) => void }) => {
    return (
        <nav className="flex border-b border-border mb-6">
            {TABS.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => onChange(key as TabKey)}
                    className={`py-2 px-6 -mb-px border-b-2 font-semibold text-sm ${activeTab === key ? "border-primary/85 text-primary/85" : "border-transparent text-gray-600 hover:text-primary/85"}`}
                >
                    {label}
                </button>
            ))}
        </nav>
    );
};
