import { useEffect, useState } from "react";
import { HiMiniPresentationChartBar } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { AddedArticlesReport } from "../components/statistics/AddedArticlesReport";
import { EditedArticlesReport } from "../components/statistics/EditedArticlesReport";
import { FilterPanel } from "../components/statistics/FilterPanel";
import { TabNavigation } from "../components/statistics/TabNavigation";
import { TopicsReport } from "../components/statistics/TopicsReport";

export type TabKey = "topics" | "addedArticles" | "editedArticles";
export type DateTypePicker = Date | undefined;

export const StatisticsPage = () => {
    const [activeTab, setActiveTab] = useState<TabKey>("topics");
    const [params, setParams] = useSearchParams();
    const [startDate, setStartDate] = useState<DateTypePicker>(
        params.get("startDate") ? new Date(params.get("startDate")!) : undefined
    );
    const [endDate, setEndDate] = useState<DateTypePicker>(
        params.get("endDate") ? new Date(params.get("endDate")!) : undefined
    );
    const filtersSelected = !!(startDate && endDate);

    useEffect(() => {
        const newParams = new URLSearchParams(params);

        if (startDate) {
            newParams.set("startDate", startDate.toISOString().split("T")[0]);
        } else {
            newParams.delete("startDate");
        }

        if (endDate) {
            newParams.set("endDate", endDate.toISOString().split("T")[0]);
        } else {
            newParams.delete("endDate");
        }

        setParams(newParams);
    }, [startDate, endDate]);

    return (
        <div className="p-5 h-full flex flex-col w-full max-w-[1580px] mx-auto">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-8 text-foreground">
                <HiMiniPresentationChartBar className="w-8 h-8 text-foreground" />
                Statystyki użytkowników
            </h2>

            <TabNavigation activeTab={activeTab} onChange={setActiveTab} />

            <FilterPanel startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />

            {activeTab === "topics" && (
                <TopicsReport startDate={startDate} endDate={endDate} filtersSelected={filtersSelected} />
            )}
            {activeTab === "addedArticles" && (
                <AddedArticlesReport startDate={startDate} endDate={endDate} filtersSelected={filtersSelected} />
            )}
            {activeTab === "editedArticles" && (
                <EditedArticlesReport startDate={startDate} endDate={endDate} filtersSelected={filtersSelected} />
            )}
        </div>
    );
};
