interface Props {
    tabsCount: number;
}

export const DepartmentTabsSkeleton = ({ tabsCount }: Props) => {
    return Array.from({ length: tabsCount }).map((_, idx) => <DepartmentTabCardSkeleton key={idx} />);
};

const DepartmentTabCardSkeleton = () => {
    return <div className="h-9 w-32 rounded-t-md bg-card animate-pulse" />;
};
