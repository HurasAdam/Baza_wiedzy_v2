import { IMAGES } from "@/constants/images";
import { useModalContext } from "@/contexts/ModalContext";
import useScrollToTop from "@/hooks/useScrollToTop";
import { conversationReportApi } from "@/lib/conversation-report.api";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import Pagination from "./Pagination";

type UserReportDetailsProps = {
    userId: string;
    queryParams: {
        startDate?: string | null;
        endDate?: string | null;
    };
};
const UserReportDetails: React.FC<UserReportDetailsProps> = ({ userId, queryParams }) => {
    const [page, setPage] = useState(1);

    const params = { ...queryParams, limit: 20, page };
    useScrollToTop(page);
    const { closeContentModal } = useModalContext();
    const { data: userConversationReports, isLoading } = useQuery({
        queryKey: ["userReportStats", userId, page],
        queryFn: () => {
            return conversationReportApi.getUserConversationReportStats({ userId, params });
        },
    });

    const changePageHandler = (page) => {
        setPage(page);
    };

    const SkeletonItem = () => (
        <li className="py-6 px-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center space-x-4 ">
            <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
            <div className="flex flex-col gap-2 w-24">
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
        </li>
    );

    return (
        <div className="px-2 py-2">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FaHistory className="text-sky-700" size={20} />
                    <h2 className="font-semibold text-gray-700 text-lg">Historia odnotowanych rozmów</h2>
                </div>
                <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    Strona{" "}
                    <span className="text-indigo-600 font-bold">{userConversationReports?.pagination?.page}</span> z{" "}
                    <span className="font-bold">{userConversationReports?.pagination?.pages}</span>
                </div>
            </div>

            <ul className="space-y-4">
                {isLoading ? (
                    Array(7)
                        .fill(0)
                        .map((_, index) => <SkeletonItem key={index} />) // Wyświetlamy 3 szkielety dla przykładu
                ) : userConversationReports?.data?.length <= 0 ? (
                    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
                        <div className="w-60 h-60 mb-4">
                            <img src={IMAGES.notFoundImage} alt="Brak historii" className="object-contain" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-4">
                            Nie znaleziono historii rozmów spełniających kryteria.
                        </p>
                        <button
                            onClick={closeContentModal}
                            className="px-8 py-2 bg-indigo-400 text-neutral-50 rounded hover:bg-indigo-500 transition"
                        >
                            Wróć
                        </button>
                    </div>
                ) : (
                    userConversationReports?.data?.map((report) => (
                        <li
                            key={report._id}
                            className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {report.topic?.title || "Temat został usunięty"}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {report.description || "Brak dodatkowego opisu."}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <p className="text-xs text-gray-600 font-semibold">
                                    {new Intl.DateTimeFormat("pl-PL", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }).format(new Date(report.createdAt))}
                                </p>
                                <p
                                    style={{
                                        backgroundColor: report.topic?.product?.labelColor || "#e0e0e0",
                                        padding: "5px 5px",
                                        borderRadius: "4px",
                                        color: "white",
                                    }}
                                    className="text-xs text-center text-gray-500"
                                >
                                    {report.topic?.product?.name}
                                </p>
                            </div>
                        </li>
                    ))
                )}
            </ul>
            {userConversationReports?.data && (
                <Pagination
                    onPageChange={changePageHandler}
                    currentPage={parseInt(userConversationReports?.pagination?.page)} // Używaj page z paginacji
                    totalPageCount={parseInt(userConversationReports?.pagination?.pages)} // Używaj pages z paginacji
                />
            )}
        </div>
    );
};

export default UserReportDetails;
