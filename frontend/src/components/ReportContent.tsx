import { useState } from "react";
import BugReportForm from "./forms/BugReportForm";
import FeatureReportForm from "./forms/FeatureReportForm";
import ReportSelector from "./ReportSelector";
import { Button } from "./ui/button";
import { IoArrowBack } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { issueReportApi } from "@/lib/issue-report.api";
import toast from "react-hot-toast";

const ReportContent = ({ onClose }: { onClose: () => void }) => {
    const [mode, setMode] = useState<"bug" | "proposal" | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: (formData) => {
            return issueReportApi.sendIssueReport(formData);
        },
        onSuccess: () => {
            onClose();
            toast.success("Dziękujemy! Twoje zgłoszenie zostało przesłane.");
        },
        onError: ({ status }) => {
            console.log(status);
            if (status === 409) {
                return toast.error("Zgłoszenie o tej nazwie już istnieje");
            }
        },
    });

    const onSend = ({ formData }) => {
        console.log(formData, "WYSYŁKA");
        mutate(formData);
    };

    return (
        <div className="w-full h-full">
            {mode === null ? (
                <ReportSelector onSelect={setMode} />
            ) : (
                <div className="space-y-3 bg-background h-full">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setMode(null)}>
                            <IoArrowBack size={19} />
                        </Button>
                    </div>
                    {mode === "bug" ? (
                        <BugReportForm onSend={onSend} isLoading={isPending} />
                    ) : (
                        <FeatureReportForm onSend={onSend} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportContent;
