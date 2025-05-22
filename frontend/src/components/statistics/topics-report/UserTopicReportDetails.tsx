import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { conversationReportApi } from "@/lib/conversation-report.api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MessageSquare, Phone } from "lucide-react";
import { pluralizeResult } from "../../../utils/pluralize-result";
import UserTopicReportDetailsSkeleton from "./UserTopicReportDetailsSkeleton";

export interface User {
    _id: string;
    name?: string;
    surname?: string;
}

interface Props {
    user: User;
    startDate?: Date;
    endDate?: Date;
}

const typeTranslationMap: Record<string, { label: string; icon: React.ReactNode }> = {
    call: { label: "Rozmowa", icon: <Phone className="w-3.5 h-3.5 mr-1" /> },
    message: { label: "Wiadomość", icon: <MessageSquare className="w-3.5 h-3.5 mr-1" /> },
};

const UserTopicReportDetails = ({ user, startDate, endDate }: Props) => {
    const { _id, name, surname } = user;
    const { data, isLoading, isError } = useQuery({
        queryKey: ["user-topic-reports", _id, startDate, endDate],
        queryFn: () =>
            conversationReportApi.findByUser(_id, {
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
            }),
        enabled: !!_id && !!startDate && !!endDate,
    });

    if (isLoading) {
        return <UserTopicReportDetailsSkeleton />;
    }

    if (isError) {
        return <div className="text-destructive text-center font-medium mt-8">Błąd podczas ładowania danych.</div>;
    }

    if (!data?.length) {
        return (
            <div className="text-muted-foreground text-center text-sm mt-8">
                Brak odnotowanych tematów rozmów dla tego użytkownika.
            </div>
        );
    }

    return (
        <section className="space-y-3 px-5 py-4  max-w-7xl mx-auto bg-background h-full  overflow-hidden">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Odnotowane tematy użytkownika{" "}
                <span className="text-primary font-bold">
                    {name} {surname}
                </span>
            </h2>

            <p className="text-xs text-muted-foreground">
                Znaleziono {data.length} {pluralizeResult(data.length)}
            </p>
            <Separator />
            <ScrollArea className="h-[calc(100%-50px)] flex-1 pr-6">
                <div className="space-y-3">
                    {data.map((report: any) => (
                        <Card
                            key={report._id}
                            className="bg-card/60 text-card-foreground border border-border hover:shadow-lg transition-shadow duration-300 rounded-[var(--radius)]"
                            aria-label={`Raport na temat ${report.topic?.title}`}
                        >
                            <CardContent className="p-5 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium text-base truncate" title={report.topic?.title}>
                                        {report.topic?.title}
                                    </h3>
                                    <Badge
                                        variant="secondary"
                                        className="capitalize bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold select-none"
                                    >
                                        {typeTranslationMap[report.type]?.icon}
                                        {typeTranslationMap[report.type]?.label ?? report.type}
                                    </Badge>
                                </div>
                                <time
                                    className="text-xs text-muted-foreground self-end"
                                    dateTime={new Date(report.createdAt).toISOString()}
                                >
                                    {format(new Date(report.createdAt), "dd.MM.yyyy HH:mm")}
                                </time>
                            </CardContent>
                        </Card>
                    ))}
                    <div className="h-6" />
                </div>
            </ScrollArea>
        </section>
    );
};

export default UserTopicReportDetails;
