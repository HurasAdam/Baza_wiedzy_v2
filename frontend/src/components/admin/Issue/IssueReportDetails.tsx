import { issueReportApi } from "@/lib/issue-report.api";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Spinner from "@/components/core/Spinner";
import { User, CalendarClock, Tag, AlertCircle, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallbackText } from "@/utils/avatar";

const statusColor = {
    pending: "bg-yellow-400 text-black",
    resolved: "bg-green-500 text-white",
    rejected: "bg-red-500 text-white",
};

const IssueReportDetails = ({ id }: { id: string }) => {
    const {
        data: issueReport,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["issueReport", id],
        queryFn: () => issueReportApi.findOne(id),
    });

    const initials = getAvatarFallbackText(issueReport?.createdBy?.name);

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-full py-20">
                <Spinner />
            </div>
        );

    if (isError) return <div className="text-red-500 text-center py-20">Wystąpił błąd podczas ładowania danych.</div>;

    if (!issueReport)
        return (
            <div className="text-center text-lg font-semibold text-gray-600 py-20">Brak zgłoszenia o podanym ID.</div>
        );

    return (
        <Card className="shadow-lg rounded-lg h-full bg-background transition-all">
            <CardHeader className="p-6 border-b">
                <CardTitle className="text-2xl font-semibold text-foreground">{issueReport.title}</CardTitle>
                <CardDescription className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-sm">
                    <span className="flex items-center gap-2">
                        <CalendarClock size={16} />
                        Zgłoszone {formatDistanceToNow(new Date(issueReport.createdAt), { addSuffix: true })}
                    </span>
                    <span className="ml-6 text-xs text-muted-foreground">
                        {new Date(issueReport.createdAt).toLocaleString("pl-PL")}
                    </span>
                </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
                {/* Status, typ, kategoria */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/10 p-4 rounded-xl border">
                    <DetailItem
                        icon={<Tag size={18} />}
                        label="Typ"
                        content={
                            <Badge className="rounded-full px-3 py-1 bg-indigo-500 text-white shadow-sm">
                                {capitalize(issueReport.type)}
                            </Badge>
                        }
                    />

                    <DetailItem
                        icon={<Tag size={18} />}
                        label="Kategoria"
                        content={
                            <Badge className="rounded-full px-3 py-1 bg-purple-500 text-white shadow-sm">
                                {issueReport.category}
                            </Badge>
                        }
                    />
                    <DetailItem
                        icon={<AlertCircle size={18} />}
                        label="Status"
                        content={
                            <Badge
                                className={`rounded-full px-3 py-1 shadow-sm ${statusColor[issueReport.status as keyof typeof statusColor]}`}
                            >
                                {capitalize(issueReport.status)}
                            </Badge>
                        }
                    />
                </section>

                {/* Opis */}
                <section className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                        <ClipboardList size={18} />
                        Opis zgłoszenia
                    </div>
                    <Separator />
                    <p className="text-primary-foreground prose max-w-none px-4 py-4 bg-muted/30 min-h-[360px] max-h-[360px] overflow-auto  rounded-lg border">
                        {issueReport.description}
                    </p>
                </section>

                {/* Zgłaszający */}
                <section className="pt-4">
                    <DetailItem
                        icon={<User size={18} />}
                        label="Zgłoszone przez"
                        content={
                            <div className="flex items-center gap-2">
                                <Avatar className="h-[34px] w-[34px] bg-primary">
                                    <AvatarImage src={issueReport.createdBy?.name} alt={issueReport.createdBy?.name} />
                                    <AvatarFallback className="text-base font-sembibold bg-primary text-secondary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                    <span className="text-foreground font-medium">
                                        {issueReport.createdBy?.name} {issueReport.createdBy?.surname}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        {issueReport.createdBy?.email}
                                    </span>
                                </div>
                            </div>
                        }
                    />
                </section>
            </CardContent>
        </Card>
    );
};

const DetailItem = ({ icon, label, content }: { icon: React.ReactNode; label: string; content: React.ReactNode }) => {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                {icon}
                {label}
            </div>
            <div>{content}</div>
        </div>
    );
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default IssueReportDetails;
