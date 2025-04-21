import { Button } from "@/components/ui/button";
import { issueReportApi } from "@/lib/issue-report.api";
import { IssueReportCard } from "../admin/Issue/views/list/IssueReportCard";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TbMessageReportFilled } from "react-icons/tb";
import { Modal } from "../modal/Modal";
import IssueReportDetails from "../admin/Issue/IssueReportDetails";
import { useModal } from "../modal/hooks/useModal";

const MyIssueReports = () => {
    const [filter, setFilter] = useState<"all" | "pending" | "resolved" | "rejected">("all");

    const {
        data: myIssueReports,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["myIssueReports"],
        queryFn: issueReportApi.findMyIssueReports,
    });
    const { closeModal, openModal, isOpen } = useModal();

    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const showReportDetailsHandler = (id: string) => {
        setSelectedReportId(id);
        openModal();
    };

    const filteredReports = myIssueReports?.filter((report) => filter === "all" || report.status === filter);

    return (
        <div className="mx-auto space-y-4  bg-background w-full h-full">
            {/* Nagłówek */}
            <div className="flex justify-between items-center py-4">
                <h2 className="text-2xl font-bold px-8 text-forground flex items-center gap-1.5">
                    <TbMessageReportFilled />
                    Moje zgłoszenia
                </h2>

                {/* Select z filtrami */}
                <div className="w-48 mr-16">
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="w-full p-2 pr-8 border rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        >
                            <option value="all">Wszystkie</option>
                            <option value="pending">Oczekujące</option>
                            <option value="resolved">Rozwiązane</option>
                            <option value="rejected">Odrzucone</option>
                        </select>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
                            <TbMessageReportFilled />
                        </div>
                    </div>
                </div>
            </div>

            {/* Loader i komunikat błędu */}
            {isLoading && <Loader className="mx-auto" />}
            {isError && <span className="text-red-500">Wystąpił błąd podczas ładowania zgłoszeń.</span>}

            {/* Komunikat braku zgłoszeń */}
            {filteredReports?.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 mt-8">Nie masz żadnych zgłoszeń w tej kategorii.</div>
            )}

            {/* Scrollowanie tylko w obszarze zgłoszeń */}
            <div className="overflow-y-auto h-[calc(100vh-175px)] scrollbar-custom px-10 space-y-3">
                {/* Tutaj wstawiamy zgłoszenia */}
                {filteredReports?.map((report) => (
                    <IssueReportCard
                        hideStatus={true}
                        key={report._id}
                        report={report}
                        onClick={showReportDetailsHandler}
                    />
                ))}
            </div>
            <Modal width="sm" isOpen={isOpen} onClose={closeModal}>
                {selectedReportId && <IssueReportDetails id={selectedReportId} />}
            </Modal>
        </div>
    );
};

export default MyIssueReports;
