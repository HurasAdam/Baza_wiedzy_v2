import IssueReportCard from "@/components/admin/Issue/views/grid/IssueReportCard";
import IssueReportDetails from "@/components/admin/Issue/IssueReportDetails";
import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { issueReportApi } from "@/lib/issue-report.api";

import { useQuery } from "@tanstack/react-query";

import { Plus } from "lucide-react";
import { useState } from "react";
import { TbMessageReportFilled } from "react-icons/tb";

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

const IssueReportsPage = () => {
    const [name, setFilterParams] = useState("");

    const { data: issueReports = [] } = useQuery({
        queryKey: ["allIssues", title],
        queryFn: () => {
            return issueReportApi.find();
        },
    });

    const { closeModal, openModal, isOpen } = useModal();
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const showReportDetailsHandler = (id: string) => {
        setSelectedReportId(id);
        openModal();
    };

    return (
        <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex flex-col">
                    <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-1">
                        <TbMessageReportFilled className="w-5.5 h-5.5" />
                        Zgłoszenia
                    </h2>
                    <Input
                        value={title}
                        onChange={(e) => setFilterParams(e.target.value)}
                        placeholder="Znajdź zgłoszenie"
                        className="h-8 w-full lg:w-[250px] bg-inherit"
                    />
                </div>

                <Button className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-primary/75 rounded-md hover:bg-primary/80 transition">
                    <Plus className="w-4 h-4" /> Dodaj produkt
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {issueReports?.map((report: IReport) => {
                    return <IssueReportCard report={report} onClick={showReportDetailsHandler} />;
                })}
            </div>
            <Modal width="sm" isOpen={isOpen} onClose={closeModal}>
                <IssueReportDetails id={selectedReportId} />
            </Modal>
        </div>
    );
};

export default IssueReportsPage;
