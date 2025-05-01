import { DOTS, usePagination } from "../hooks/usePagination";

interface PaginationProps {
    onPageChange: (page: number) => void;
    currentPage: number;
    siblingCount?: number;
    totalPageCount: number;
}

const Pagination = ({ onPageChange, currentPage, siblingCount = 1, totalPageCount }: PaginationProps) => {
    const paginationRange = usePagination({ currentPage, siblingCount, totalPageCount });

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => onPageChange(currentPage + 1);
    const onPrevious = () => onPageChange(currentPage - 1);
    const lastPage = paginationRange[paginationRange.length - 1];

    return (
        <nav aria-label="Pagination" className="flex justify-center my-6">
            <ul className="inline-flex items-center space-x-1">
                <li>
                    <button
                        onClick={onPrevious}
                        disabled={currentPage === 1}
                        className="flex items-center p-2 rounded-md border border-border bg-card text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition"
                        aria-label="Previous Page"
                    >
                        <span className="sr-only">Previous</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                </li>
                {paginationRange.map((pageNumber, idx) => (
                    <li key={idx}>
                        {pageNumber === DOTS ? (
                            <span className="px-3 py-1 text-muted-foreground">&hellip;</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(Number(pageNumber))}
                                className={`px-3 py-1 rounded-md border transition focus:outline-none   ${
                                    pageNumber === currentPage
                                        ? "bg-primary/85 text-primary-foreground "
                                        : "bg-card text-foreground border-border hover:bg-muted"
                                }`}
                                aria-current={pageNumber === currentPage ? "page" : undefined}
                            >
                                {pageNumber}
                            </button>
                        )}
                    </li>
                ))}
                <li>
                    <button
                        onClick={onNext}
                        disabled={currentPage === lastPage}
                        className="flex items-center p-2 rounded-md border border-border bg-card text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition"
                        aria-label="Next Page"
                    >
                        <span className="sr-only">Next</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
