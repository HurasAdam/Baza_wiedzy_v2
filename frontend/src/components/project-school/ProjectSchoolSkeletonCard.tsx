interface Props {
    itemsCount: number;
}

const ProjectSchoolSkeletonCard = ({ itemsCount }: Props) => {
    return Array.from({ length: itemsCount }).map((_, idx) => <DepartmentMemberCardSkeleton key={idx} />);
};

const DepartmentMemberCardSkeleton = () => {
    return (
        <div className="border rounded-xl p-4 shadow-sm bg-card animate-pulse min-h-[110px]">
            <div className="flex flex-col space-y-2.5 h-full justify-center">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-3/4" />
            </div>
        </div>
    );
};

export default ProjectSchoolSkeletonCard;
