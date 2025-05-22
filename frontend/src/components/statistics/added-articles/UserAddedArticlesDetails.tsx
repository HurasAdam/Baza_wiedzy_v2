import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { articleApi } from "../../../lib/article.api";
import { pluralizeResult } from "../../../utils/pluralize-result";
import EmptyState from "../../EmptyState";
import UserTopicReportDetailsSkeleton from "../topics-report/UserTopicReportDetailsSkeleton";

export interface User {
    _id: string;
    name?: string;
    surname?: string;
}

interface Props {
    user: User;
    startDate?: Date;
    endDate?: Date;
    onClick: (articleId: string) => void;
}

export default function UserAddedArticlesDetails({ user, startDate, endDate, onClick }: Props) {
    const { _id, name, surname } = user;
    const {
        data = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["user-added-articles", _id, startDate, endDate],
        queryFn: () =>
            articleApi.findByUser(_id, {
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
            }),
        enabled: !!_id && !!startDate && !!endDate,
    });

    if (isLoading) {
        return <UserTopicReportDetailsSkeleton rows={5} />;
    }
    if (isError) {
        return <div className="text-destructive text-center mt-8">Błąd ładowania artykułów.</div>;
    }
    if (!data.length) {
        return (
            <div className="text-muted-foreground text-center rounded-lg pb-40 flex items-center justify-center bg-background h-full">
                <EmptyState description="Nie znaleziono artykułów dodanych w wybranym okresie czasu" />
            </div>
        );
    }

    return (
        <section className="space-y-4 max-w-7xl mx-auto p-4 bg-background h-full flex flex-col rounded-lg">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-lg font-semibold">
                        Artykuły dodane przez{" "}
                        <span className="text-primary">
                            {name} {surname}
                        </span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {data.length} {pluralizeResult(data.length)}
                    </p>
                </div>
            </header>
            <Separator />
            <ScrollArea className="flex-1  pr-6">
                <div className="space-y-3">
                    {data.map((article) => (
                        <Card
                            key={article._id}
                            className="hover:shadow-lg transition-shadow relative bg-card/60"
                            onClick={() => onClick(article?._id)}
                        >
                            <CardContent className="px-4 pt-4 pb-2.5 ">
                                <time
                                    dateTime={new Date(article.createdAt).toISOString()}
                                    className="absolute top-3 right-4 text-xs text-muted-foreground"
                                >
                                    {format(new Date(article.createdAt), "dd.MM.yyyy")}
                                </time>

                                <h3 className="text-base font-semibold truncate">{article.title}</h3>

                                <div className="flex justify-between text-sm text-muted-foreground mt-6">
                                    <div className="flex gap-5 min-w-0">
                                        <span className="truncate text-xs">
                                            <strong>Produkt:</strong> {article.product?.name ?? "—"}
                                        </span>
                                        <span className="truncate text-xs">
                                            <strong>Kategoria:</strong> {article.category?.name ?? "—"}
                                        </span>
                                    </div>
                                    <Badge
                                        className={`px-2 py-1 text-xs font-semibold select-none flex items-center gap-1 self-end ${
                                            article.isVerified
                                                ? "bg-green-800/80 text-primary-foreground"
                                                : "bg-amber-800/80 text-primary-foreground"
                                        }`}
                                    >
                                        {article.isVerified ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Zweryfikowany
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="w-4 h-4" />
                                                Wymaga weryfikacji
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </section>
    );
}
