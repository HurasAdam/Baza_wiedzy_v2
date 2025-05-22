import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    rows?: number;
}

const UserTopicReportDetailsSkeleton = ({ rows = 5 }: Props) => {
    return (
        <section className="flex flex-col h-full overflow-hidden bg-background px-5 py-4 max-w-7xl mx-auto">
            <div className="shrink-0 space-y-4">
                <Skeleton className="h-6 w-1/2 bg-card rounded-base animate-pulse" />
                <Skeleton className="h-4 w-1/4 rounded-base bg-card animate-pulse" />
                <Separator className="opacity-20 bg-card" />
            </div>

            <ScrollArea className="flex-1 pr-6">
                <div className="space-y-3">
                    {[...Array(rows)].map((_, i) => (
                        <Card
                            key={i}
                            className="bg-card/60 text-card-foreground border border-border rounded-[var(--radius)]"
                        >
                            <CardContent className="p-4 flex flex-col gap-2">
                                {/* Skeleton tytułu */}
                                <Skeleton className="h-5 w-3/4 bg-card rounded-[var(--radius)] animate-pulse" />
                                {/* Skeleton dla typu */}
                                <div className="flex items-center space-x-2">
                                    <Skeleton className="h-4 w-4 bg-card rounded-full animate-pulse" />
                                    <Skeleton className="h-4 w-20 bg-card rounded-[var(--radius)] animate-pulse" />
                                </div>
                                {/* Skeleton dla daty */}
                                <Skeleton className="h-4 w-16 rounded-base bg-card self-end animate-pulse" />
                            </CardContent>
                        </Card>
                    ))}
                    <div className="h-6" />
                </div>
            </ScrollArea>
        </section>
    );
};

export default UserTopicReportDetailsSkeleton;
