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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { FiX } from "react-icons/fi";

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
    const [type, setType] = useState<string | null>(null);
    const [isUnread, setIsUndread] = useState(false);
    // Ładowanie zgłoszeń
    const {
        data: issueReports = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["allIssues", title, type, isUnread],
        queryFn: () => {
            return issueReportApi.find({ title, type, isUnread });
        },
    });

    const { closeModal, openModal, isOpen } = useModal();
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const showReportDetailsHandler = (id: string) => {
        setSelectedReportId(id);
        openModal();
    };
    const hasNonInputFilters = Boolean(type) || isUnread;
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
                        <div className="flex gap-4 items-center">
                            <div className="relative w-full lg:w-[300px]">
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Szukaj po tytule..."
                                    className="h-9 w-full pr-10 text-sm rounded-lg border border-border focus:ring-1 focus:ring-primary transition"
                                />
                                {title && (
                                    <button
                                        aria-label="Wyczyść wyszukiwanie"
                                        onClick={() => setTitle("")}
                                        className="absolute inset-y-1.5 right-2 flex items-center justify-center w-6 h-6 bg-muted/50 hover:bg-muted rounded-full transition"
                                    >
                                        <FiX className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                            <div className="inline-flex items-center justify-center rounded-md bg-background border border-border p-1 space-x-1">
                                {[
                                    { label: "Wszystkie", value: null },
                                    { label: "Błąd", value: "bug" },
                                    { label: "Propozycja", value: "proposal" },
                                ].map(({ label, value }) => (
                                    <button
                                        key={label}
                                        onClick={() => setType(value)}
                                        className={`px-4 py-1.5 text-sm rounded-md transition-all font-medium 
              ${
                  type === value
                      ? "bg-primary/55 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch id="new-reports-toggle" checked={isUnread} onCheckedChange={setIsUndread} />
                                <label htmlFor="new-reports-toggle" className="text-sm text-muted-foreground">
                                    Tylko nowe zgłoszenia
                                </label>
                            </div>
                            {/* Przycisk Resetowania Wszystkich Filtrów */}
                            {hasNonInputFilters && (
                                <button
                                    onClick={() => {
                                        setType(null);
                                        setIsUndread(false);
                                        setTitle("");
                                    }}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent border border-border px-3 py-1.5 rounded-md transition-all ease-in-out duration-200 hover:scale-105"
                                >
                                    <FiX className="w-4 h-4" />
                                    <span>Wyczyść filtry</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Zawartość */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {isLoading ? (
                    // Skeleton loader
                    Array.from({ length: 8 }).map((_, idx) => <IssueReportCardSkeleton key={idx} />)
                ) : issueReports.length === 0 ? (
                    // Empty State - Brak zgłoszeń
                    <EmptyState
                        icon={<TbMessageReportFilled className="w-10 h-10 text-muted" />}
                        onReset={() => {
                            setTitle("");
                            setIsUndread(false);
                            setType("");
                        }}
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
