
const DocumentCardSkeleton = () => {
    return (
        <div className="flex flex-wrap gap-4 w-full">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse w-[200px] border border-gray-200 rounded-lg p-3"
                >
                    <div className="h-[150px] bg-gray-200 rounded mb-3" />

                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
};

export default DocumentCardSkeleton;
