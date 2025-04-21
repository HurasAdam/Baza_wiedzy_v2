import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const IssueReportCardSkeleton = () => {
    return (
        <Card className="bg-card/30 border-border animate-pulse border rounded-lg">
            <CardHeader className="flex flex-row justify-between items-center py-2">
                {/* Title placeholder */}
                <div className="h-4 bg-muted w-3/4 rounded" />
                {/* Status badge placeholder */}
                <div className="h-5 w-20 bg-muted/60 rounded-full" />
            </CardHeader>

            <CardContent className="space-y-2">
                {/* Subtitle line */}
                <div className="h-3 bg-muted w-1/2 rounded" />

                {/* Date + type/category line */}
                <div className="flex justify-between text-xs text-muted-foreground mt-4">
                    <div className="h-3 w-24 bg-muted/50 rounded" />
                    <div className="h-3 w-20 bg-muted/40 rounded" />
                </div>
            </CardContent>
        </Card>
    );
};
