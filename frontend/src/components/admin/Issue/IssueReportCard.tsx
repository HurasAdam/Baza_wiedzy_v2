import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IReport } from "@/pages/admin/IssueReportsPage";

import { format } from "date-fns";
import { Bug, Lightbulb } from "lucide-react";

interface Props {
    report: IReport;
}

const IssueReportCard = ({ report, onClick }: Props) => {
    const getStatusLabel = (status: IReport["status"]) => {
        switch (status) {
            case "pending":
                return "Oczekujące";
            case "in-progress":
                return "W trakcie";
            case "resolved":
                return "Rozwiązane";
            default:
                return status;
        }
    };

    const date = format(new Date(report.createdAt), "dd MMM yyyy");
    const isBug = report.type === "bug";
    const statusLabel = getStatusLabel(report.status);
    const isUnread = report.isUnread;

    return (
        <Card
            onClick={() => onClick(report?._id)}
            key={report._id}
            className="cursor-pointer transition-transform duration-200 hover:shadow-lg bg-card/60  rounded-lg overflow-hidden hover:bg-card"
        >
            <CardHeader className="p-4">
                <div className="flex justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">{date}</span>
                    {isUnread && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-custom"></div>}
                </div>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-semibold leading-tight text-primary-foreground/90 py-2 break-all min-h-20 max-h-20">
                            {report.title}
                        </CardTitle>
                        <CardDescription></CardDescription>
                    </div>
                </div>
            </CardHeader>

            {/* Report TYPE and STATUS*/}
            <Separator className="my-2" />
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Badge
                    className={`flex items-center space-x-1 uppercase text-xs px-2 py-1 ${isBug ? "bg-rose-600/80" : "bg-amber-600/80"}`}
                >
                    {isBug ? <Bug size={16} /> : <Lightbulb size={16} />}
                    <span>{isBug ? "Błąd" : "Propozycja"}</span>
                </Badge>

                <Badge variant="outline" className="text-xs">
                    {statusLabel}
                </Badge>
            </CardFooter>
        </Card>
    );
};

export default IssueReportCard;
