import { useState } from "react";
import { issueReportApi } from "@/lib/issue-report.api";
import { useQuery } from "@tanstack/react-query";
import { TbLayout, TbMessageReportFilled } from "react-icons/tb";
import { Grid, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal/Modal";
import IssueReportDetails from "./IssueReportDetails";
import { useModal } from "@/components/modal/hooks/useModal";
import GridView from "./views/grid/GridView";
import ListView from "./views/list/ListView";

const IssueLayout = () => {
    const [view, setView] = useState<"tiles" | "modern">("tiles");

    // Ładowanie zgłoszeń
    const {
        data: issueReports = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["allIssues"],
        queryFn: issueReportApi.find,
    });

    const { closeModal, openModal, isOpen } = useModal();
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const showReportDetailsHandler = (id: string) => {
        setSelectedReportId(id);
        openModal();
    };

    if (isLoading) return <Loader className="mx-auto" />;
    if (isError) return <div className="text-red-500">Wystąpił błąd podczas ładowania zgłoszeń.</div>;

    return (
        <div className="mx-auto space-y-4 bg-background w-full h-full px-6">
            {/* Nagłówek */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="flex flex-col">
                        <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-1">
                            <TbMessageReportFilled className="w-5.5 h-5.5" />
                            Zgłoszenia
                        </h2>
                        <Input placeholder="Znajdź zgłoszenie" className="h-8 w-full lg:w-[250px] bg-inherit" />
                    </div>
                </div>

                <div className="pb-4 flex justify-end">
                    {/* Przewijanie widoków */}
                    <div className="flex gap-3 px-6 w-max">
                        <div
                            onClick={() => setView("tiles")}
                            className={`cursor-pointer py-2 my-auto mx-auto px-2  rounded-lg transition-all duration-300 ease-in-out 
            ${view === "tiles" ? "bg-primary text-white" : "bg-secondary/10 text-primary"}`}
                        >
                            <Grid size={18} />
                        </div>
                        <div
                            onClick={() => setView("modern")}
                            className={`cursor-pointer py-2 my-auto mx-auto px-2 rounded-lg transition-all duration-300 ease-in-out 
            ${view === "modern" ? "bg-primary text-white" : "bg-secondary/10 text-primary"}`}
                        >
                            <TbLayout size={18} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Zawartość */}
            {view === "tiles" ? (
                <GridView items={issueReports} onClick={showReportDetailsHandler} />
            ) : (
                <ListView items={issueReports} onClick={showReportDetailsHandler} />
            )}
            <Modal width="sm" isOpen={isOpen} onClose={closeModal}>
                {selectedReportId && <IssueReportDetails id={selectedReportId} />}
            </Modal>
        </div>
    );
};

export default IssueLayout;
