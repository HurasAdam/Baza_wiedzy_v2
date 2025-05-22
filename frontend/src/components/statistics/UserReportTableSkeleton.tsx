import React from "react";

type SkeletonProps = {
    rows?: number;
};

export const UserReportTableSkeleton: React.FC<SkeletonProps> = ({ rows = 5 }) => {
    const skeletonRow = (
        <tr className="animate-pulse border-b">
            <td className="py-3 px-6">
                <div className="h-4 w-24 bg-muted rounded" />
            </td>
            <td className="py-3 px-6">
                <div className="h-4 w-28 bg-muted rounded" />
            </td>
            <td className="py-3 px-6">
                <div className="h-5 w-16 bg-muted rounded-lg" />
            </td>
            <td className="py-3 px-6 text-center">
                <div className="h-4 w-8 bg-muted rounded" />
            </td>
            <td className="py-3 px-6 text-center">
                <div className="h-8 w-8 mx-auto bg-muted rounded-lg" />
            </td>
        </tr>
    );

    return (
        <div className="overflow-x-auto rounded-lg shadow-md border">
            <table className="min-w-full table-fixed border-collapse">
                <thead className="bg-muted/30 text-muted-foreground border-b">
                    <tr>
                        <th className="py-2.5 px-6 text-left text-sm font-semibold">Imię</th>
                        <th className="py-2.5 px-6 text-left text-sm font-semibold">Nazwisko</th>
                        <th className="py-2.5 px-6 text-left text-sm font-semibold">Rola</th>
                        <th className="py-2.5 px-6 text-center text-sm font-semibold">Wartość</th>
                        <th className="py-2.5 px-6 text-center text-sm font-semibold">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <React.Fragment key={i}>{skeletonRow}</React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
