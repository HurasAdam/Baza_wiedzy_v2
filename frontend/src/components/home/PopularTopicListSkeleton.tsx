type SkeletonTopicListProps = {
    count?: number;
};

export const HomeListSkeleton = ({ count = 5 }: SkeletonTopicListProps) => {
    return (
        <ul className="space-y-5">
            {Array.from({ length: count }).map((_, index) => (
                <li key={index} className="flex justify-between items-center text-sm animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4" />

                    <div className="h-4 w-14 bg-muted-foreground/30 rounded" />
                </li>
            ))}
        </ul>
    );
};
