const ProductCardSkeleton = () => {
    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-muted bg-card shadow-lg animate-pulse">
            {/* Banner skeleton */}
            <div className="h-40 w-full bg-muted dark:bg-gray-700" />

            {/* Content skeleton */}
            <div className="p-4 flex flex-col flex-1 space-y-3">
                {/* Title */}
                <div className="h-6 w-1/2 rounded bg-muted dark:bg-gray-700" />

                {/* Tag badge */}
                <div className="h-4 w-1/4 rounded bg-muted dark:bg-gray-700" />

                {/* Stats (icon + text) */}
                <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full bg-muted dark:bg-gray-700" />
                    <div className="h-4 w-8 rounded bg-muted dark:bg-gray-700" />
                </div>

                {/* Actions */}
                <div className="mt-auto flex justify-end space-x-2 pt-4 border-t border-muted dark:border-gray-700">
                    <div className="h-6 w-16 rounded bg-muted dark:bg-gray-700" />
                    <div className="h-6 w-16 rounded bg-muted dark:bg-gray-700" />
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
