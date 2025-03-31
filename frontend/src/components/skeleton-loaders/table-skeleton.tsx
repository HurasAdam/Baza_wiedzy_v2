import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface TableSkeletonProps {
    columns: number;
    rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 20 }) => {
    return (
        <div className="w-full  rounded-lg">
            {/* Table Header Skeleton */}
            <div className="flex h-10 bg-card rounded-t-lg">
                {[...Array(columns)].map((_, index) => (
                    <div key={`header-col-${index}`} className={`flex-1 px-4 py-2`}>
                        <Skeleton className="h-4 w-full rounded-lg bg-muted" />
                    </div>
                ))}
            </div>

            {/* Table Body Skeleton */}
            <div className="divide-y divide-muted">
                {[...Array(rows)].map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex h-10 ">
                        {[...Array(columns)].map((_, colIndex) => (
                            <div key={`row-${rowIndex}-col-${colIndex}`} className={`flex-1 px-4 py-2`}>
                                <Skeleton className="h-4 w-full rounded-lg bg-muted" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;
