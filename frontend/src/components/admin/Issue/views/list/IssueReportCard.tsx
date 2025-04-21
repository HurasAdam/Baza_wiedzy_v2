import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Bug, CheckCircle, Clock, Lightbulb, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IReport } from "./ListView";

const getStatusLabel = (status: string) => {
    switch (status) {
        case "pending":
            return "Oczekujące";
        case "resolved":
            return "Zrealizowane";
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
    hideIsReadStatus?: boolean;
}

export const IssueReportCard = ({ report, onClick, hideStatus = false, hideIsReadStatus = false }: Props) => {
    const isBug = report.type === "bug";

    return (
        <Card
            onClick={() => onClick(report._id)}
            className=" bg-card/60 border border-border hover:border-primary/40 transition-all hover:shadow-md cursor-pointer px-4 py-3 space-y-3"
        >
            <CardHeader className="p-0 flex flex-col space-y-1">
                <div
                    className={`flex justify-between ${hideIsReadStatus && "justify-end"} items-center text-xs text-muted-foreground`}
                >
                    <span>
                        {new Date(report.createdAt).toLocaleDateString("pl-PL", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    {!hideIsReadStatus && report.isUnread && (
                        <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-medium">Nowe</span>
                        </div>
                    )}
                </div>

                <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2">{report.title}</h3>
            </CardHeader>

            <CardContent className="p-0 flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Badge
                            className={`flex items-center gap-1 text-[10px] font-medium uppercase px-2 py-0.5 ${
                                isBug ? "bg-rose-600/80" : "bg-amber-600/80"
                            }`}
                        >
                            {isBug ? <Bug size={12} /> : <Lightbulb size={12} />}
                            {isBug ? "Błąd" : "Propozycja"}
                        </Badge>
                        <span>{report.category}</span>
                    </div>

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
                            {report.status === "pending" && <Clock className="w-3.5 h-3.5" />}
                            {report.status === "resolved" && <CheckCircle className="w-3.5 h-3.5" />}
                            {report.status === "rejected" && <XCircle className="w-3.5 h-3.5" />}
                            {getStatusLabel(report.status)}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
