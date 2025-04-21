import { useState } from "react";
import { IssueReportCard } from "./IssueReportCard";
import { useModal } from "@/components/modal/hooks/useModal";
import { Input } from "@/components/ui/input";
import { TbMessageReportFilled } from "react-icons/tb";
import IssueReportDetails from "../../IssueReportDetails";
import { Modal } from "@/components/modal/Modal";
import { issueReportApi } from "@/lib/issue-report.api";
import { useQuery } from "@tanstack/react-query";
import { IssueReportCardSkeleton } from "./IssueReportCardSkeleton";
import EmptyState from "@/components/EmptyState";
import { Switch } from "@/components/ui/switch";

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

const ListView = () => {
    // Ładowanie zgłoszeń

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
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Szukaj po tytule..."
                                className="h-9 lg:w-[300px] text-sm"
                            />
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Zawartość */}

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <IssueReportCardSkeleton key={i} />)
                ) : issueReports.length === 0 ? (
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
                    issueReports.map((report: IReport) => (
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

export default ListView;
