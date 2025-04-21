import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const IssueReportCardSkeleton = () => {
    return (
        <Card className="bg-card/60 rounded-lg overflow-hidden animate-pulse shadow-sm">
            {/* HEADER */}
            <CardHeader className="p-4 space-y-3">
                {/* Górny pasek z datą i unread dotem */}
                <div className="flex justify-between items-center">
                    <div className="h-3 w-24 bg-muted-foreground/20 rounded" />
                    {/* <div className="w-2.5 h-2.5 rounded-full bg-primary/30" /> */}
                </div>

                {/* Tytuł */}
                <div className="space-y-2 min-h-20 max-h-20">
                    <div className="h-4 w-11/12 bg-muted-foreground/20 rounded" />
                    <div className="h-4 w-9/12 bg-muted-foreground/20 rounded" />
                </div>
            </CardHeader>

            {/* LINIA */}
            <Separator className="my-2" />

            {/* FOOTER */}
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                {/* Typ (badge) */}
                <div className="h-6 w-20 rounded-full bg-muted-foreground/20" />

                {/* Status (badge) */}
                <div className="h-6 w-24 rounded-full bg-muted-foreground/20" />
            </CardFooter>
        </Card>
    );
};

export default IssueReportCardSkeleton;
