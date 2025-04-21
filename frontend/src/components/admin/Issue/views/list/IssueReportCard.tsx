import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle } from "lucide-react"; // Dodanie ikon do statusu
import { IReport } from "./ListView";

const getStatusLabel = (status: string) => {
    switch (status) {
        case "pending":
            return "Oczekujące";
        case "resolved":
            return "Zrealizowane ";
        case "rejected":
            return "Odrzucone";
        default:
            return status;
    }
};

interface Props {
    report: IReport;
    onClick: (id: string) => void;
    hideStatus?: boolean;
}

export const IssueReportCard = ({ report, onClick, hideStatus = false }: Props) => {
    return (
        <Card
            onClick={() => onClick(report?._id)}
            className="bg-card/50 border-border  cursor-pointer hover:shadow-lg transition-shadow border hover:border-blue-500"
        >
            <CardHeader className="flex flex-row justify-between items-center py-2">
                <h3 className="text-lg font-semibold text-primary-foreground/90">{report.title}</h3>
                <div className="flex items-center gap-2">
                    {!hideStatus && (
                        <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
    ${
        report.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : report.status === "resolved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
    }`}
                        >
                            {report.status === "pending" && <Clock className="w-4 h-4 text-amber-900" />}
                            {report.status === "resolved" && <CheckCircle className="w-3.5 h-3.5 text-teal-700" />}
                            {report.status === "rejected" && <XCircle className="w-3.5 h-3.5" />}
                            {getStatusLabel(report.status)}
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between text-xs text-primary-foreground/80 mt-2">
                    <span className="flex items-center">
                        <span className="font-semibold">{report.type}</span> / {report.category}
                    </span>
                    <span>
                        {new Date(report.createdAt).toLocaleDateString("pl-PL", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};
