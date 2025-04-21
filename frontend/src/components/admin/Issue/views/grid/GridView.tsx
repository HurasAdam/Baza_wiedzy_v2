import { useState } from "react";
import IssueReportCard from "./IssueReportCard";
import { TbMessageReportFilled } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal/Modal";
import IssueReportDetails from "../../IssueReportDetails";
import { issueReportApi } from "@/lib/issue-report.api";
import { useModal } from "@/components/modal/hooks/useModal";

import { useQuery } from "@tanstack/react-query";
import IssueReportCardSkeleton from "./IssueReportCardSkeleton";
import EmptyState from "@/components/EmptyState";

export interface IReport {
    _id: string;
    title: string;
    description: string;
    createdBy: {};
    status: "in-progress" | "resolved" | "pending";
    isUnread: boolean;
    type: "bug" | "proposal";
    category: string;
    createdAt: string;
    updatedAt: string;
}

const GridView = () => {
    const [title, setTitle] = useState("");
    // Ładowanie zgłoszeń
    const {
        data: issueReports = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["allIssues", title],
        queryFn: () => {
            return issueReportApi.find({ title });
        },
    });

    const { closeModal, openModal, isOpen } = useModal();
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const showReportDetailsHandler = (id: string) => {
        setSelectedReportId(id);
        openModal();
    };

    // if (isLoading) return <Loader className="mx-auto" />;
    if (isError) return <div className="text-red-500">Wystąpił błąd podczas ładowania zgłoszeń.</div>;

    return (
        <div className="mx-auto space-y-3.5 bg-background w-full h-full px-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="flex flex-col">
                        <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-1">
                            <TbMessageReportFilled className="w-5.5 h-5.5" />
                            Zgłoszenia
                        </h2>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Znajdź zgłoszenie"
                            className="h-8 w-full lg:w-[250px] bg-inherit"
                        />
                    </div>
                </div>
            </div>

            {/* Zawartość */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {isLoading ? (
                    // Skeleton loader
                    Array.from({ length: 5 }).map((_, idx) => <IssueReportCardSkeleton key={idx} />)
                ) : issueReports.length === 0 ? (
                    // Empty State - Brak zgłoszeń
                    <EmptyState
                        icon={<TbMessageReportFilled className="w-10 h-10 text-muted" />}
                        onReset={() => setTitle("")}
                        resetLabel="Wyczyść filtry"
                        description="Nie znaleziono zgłoszeń spełniających wybrane kryteria wyszukiwania."
                    />
                ) : (
                    // Normalne wyświetlanie zgłoszeń
                    issueReports?.map((report: IReport) => (
                        <IssueReportCard onClick={showReportDetailsHandler} key={report._id} report={report} />
                    ))
                )}
            </div>
            <Modal width="sm" isOpen={isOpen} onClose={closeModal}>
                {selectedReportId && <IssueReportDetails id={selectedReportId} />}
            </Modal>
        </div>
    );
};

export default GridView;
