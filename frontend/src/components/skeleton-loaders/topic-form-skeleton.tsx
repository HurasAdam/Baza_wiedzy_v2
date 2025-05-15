const TopicFormSkeleton = () => {
    return (
        <div className="space-y-8 min-h-[590px] bg-background pt-12 px-10">
            {/* Header skeleton */}
            <div className="h-8 w-1/3 bg-card rounded animate-pulse"></div>

            {/* Product field skeleton */}
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-card rounded animate-pulse"></div>
                <div className="h-10 bg-cardrounded animate-pulse"></div>
                <div className="h-3 w-1/2 bg-card rounded animate-pulse"></div>
            </div>

            {/* Textarea skeleton */}
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-card rounded animate-pulse"></div>
                <div className="h-24 bg-card rounded animate-pulse"></div>
                <div className="h-3 w-2/3 bg-card rounded animate-pulse"></div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex  space-x-4">
                <div className="h-10 w-full bg-card rounded animate-pulse"></div>
            </div>
        </div>
    );
};

export default TopicFormSkeleton;
