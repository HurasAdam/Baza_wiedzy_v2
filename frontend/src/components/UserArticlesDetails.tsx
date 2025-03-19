import { articlesApi } from "@/lib/articlesApi";
import { formatDate } from "@/utils/format-date";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MdArticle } from "react-icons/md";
import Pagination from "./Pagination";
import UserCreatedArticleDetails from "./UserCreatedArticleDetails";

const UserArticlesDetails = ({ userId, queryParams }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [page, setPage] = useState(1);

    const searchParams = {
        ...queryParams,
        limit: 20,
        page,
    };

    const { data: userArticles } = useQuery({
        queryKey: ["articlesCreatedByUser", userId, page],
        queryFn: () => {
            return articlesApi.getArticlesCreatedByUser({ userId, searchParams: searchParams });
        },
    });

    const handleSelectItem = (itemId) => {
        setSelectedItem(itemId);
    };

    const changePageHandler = (page) => {
        setPage(page);
    };

    return (
        <div className="grid grid-cols-[6fr_14fr] h-full gap-1.5 max-h-full">
            {/* Lewa kolumna - lista zmian */}
            <div className="border-r overflow-y-auto max-h-[88vh] scrollbar-custom   ">
                <div className="px-4 py-2  flex flex-col justify-between border-b">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 flex justify-center items-center rounded-md bg-amber-500/70">
                            <MdArticle className="w-5 h-5 text-yellow-50" />
                        </div>
                        <h3 className="font-semibold text-gray-700 text-lg">Historia dodanych artykułów</h3>
                    </div>
                    <div className="flex gap-1 justify-end  text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                        Strona <span className="text-indigo-600 font-bold">{userArticles?.pagination?.page}</span> z{" "}
                        <span className="font-bold">{userArticles?.pagination?.pages}</span>
                    </div>
                </div>

                <ul className="p-2 space-y-2">
                    {userArticles?.data?.map((article) => (
                        <li
                            key={article._id}
                            className={`p-3 rounded-lg cursor-pointer shadow-sm border ${
                                selectedItem === article._id ? "bg-blue-100 border-blue-500" : "bg-white"
                            }`}
                            onClick={() => handleSelectItem(article._id)}
                        >
                            <div className="font-semibold text-gray-800">{article.title}</div>
                            <div className={`text-sm ${article.isVerified ? "text-green-600" : "text-red-600"}`}>
                                {article.isVerified ? "Zweryfikowany" : "Niezweryfikowany"}
                            </div>
                            <div className="text-sm text-gray-500">{formatDate(article.createdAt)}</div>
                        </li>
                    ))}
                </ul>
                {userArticles?.data && (
                    <Pagination
                        onPageChange={changePageHandler}
                        currentPage={parseInt(userArticles?.pagination?.page)} // Używaj page z paginacji
                        totalPageCount={parseInt(userArticles?.pagination?.pages)} // Używaj pages z paginacji
                    />
                )}
            </div>

            {/* Prawa kolumna - może być pusta */}
            <div className=" overflow-y-auto h-full max-h-[88vh] min-h-[88vh]  break-words w-full box-border scrollbar-custom ">
                <UserCreatedArticleDetails articleId={selectedItem} />
            </div>
        </div>
    );
};

export default UserArticlesDetails;
