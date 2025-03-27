import { IMAGES } from "@/constants/images";
import ARTICLE_HISTORY_FIELD_TRANSLATIONS from "@/enums/articleHistoryFieldTranslations";
import { articleApi } from "@/lib/article.api";
import { formatDate } from "@/utils/format-date";
import { useQuery } from "@tanstack/react-query";
import { diff_match_patch } from "diff-match-patch";
import { useState } from "react";
import { FaFileSignature, FaTrashCan } from "react-icons/fa6";
import { IoIosCheckmark } from "react-icons/io";
import { MdArticle, MdEditDocument, MdOutlineQuestionMark, MdOutlineSettingsBackupRestore } from "react-icons/md";
import UserHistoryActivityCard from "./UserHistoryActivityCard";

const UserArticleChangesDetails = ({ userId, queryParams }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showArticleDetails, setShowArticleDetails] = useState(false);

    const { data: userUpdatedArticles } = useQuery({
        queryKey: ["articlesUpdatedByUser", userId],
        queryFn: () => {
            return articleApi.getArticlesHistoryByUser({ userId, params: queryParams });
        },
    });

    const showHistoryDetails = (selected) => {
        setSelectedItem(selected);
    };

    const closeArticleHistoryView = (articleId) => {};
    const highlightChanges = (oldText, newText) => {
        const dmp = new diff_match_patch();

        // Obliczanie różnic między starym i nowym tekstem
        const diffs = dmp.diff_main(oldText, newText);
        dmp.diff_cleanupSemantic(diffs); // Opcjonalnie - poprawia spójność zmian

        // Zmienna do przechowywania HTML dla dwóch kolumn
        let leftText = "";
        let rightText = "";

        diffs.forEach(([op, text]) => {
            if (op === 0) {
                // Brak zmian - zwykły tekst (wyświetlamy w obu kolumnach)
                leftText += text;
                rightText += text;
            } else if (op === 1) {
                // Dodany tekst - kolor zielony (tylko po prawej)
                rightText += `<span style="background-color: #e6f7e6; color: green;">${text}</span>`;
            } else if (op === -1) {
                // Usunięty tekst - przekreślony, kolor czerwony (tylko po lewej)
                leftText += `<span style="background-color: #f8d7da; color: red; text-decoration: line-through;">${text}</span>`;
            }
        });

        return { leftText, rightText };
    };
    const TASKTYPEICON = {
        restored: (
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                <MdOutlineSettingsBackupRestore size={20} />
            </div>
        ),
        created: (
            <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center text-white">
                <FaFileSignature size={16} />
            </div>
        ),
        verified: (
            <div className="w-8 h-8  flex items-center justify-center rounded-full bg-emerald-500 text-white">
                <IoIosCheckmark size={28} />
            </div>
        ),
        unverified: (
            <div className="w-8 h-8  flex items-center justify-center rounded-full bg-slate-500 text-white">
                <MdOutlineQuestionMark size={21} />
            </div>
        ),
        trashed: (
            <div className="w-8 h-8  flex items-center justify-center rounded-full bg-rose-500 text-white">
                <FaTrashCan size={16} />
            </div>
        ),
        updated: (
            <div className="w-8 h-8  rounded-full bg-sky-700/90 flex items-center justify-center text-white">
                <MdEditDocument size={18} />
            </div>
        ),
    };
    return (
        <div className="grid grid-cols-[5fr_15fr] h-full gap-1.5 max-h-[88vh] ">
            {/* Lewa kolumna - lista zmian */}
            <div className="border-r overflow-y-auto max-h-[88vh] scrollbar-custom  space-y-1.5 ">
                {userUpdatedArticles?.map((historyItem, index) => (
                    <UserHistoryActivityCard
                        onClick={showHistoryDetails}
                        item={historyItem}
                        taskTypeIcons={TASKTYPEICON}
                        selectedItem={selectedItem}
                    />
                ))}
            </div>

            {/* Prawa kolumna - może być pusta */}
            <div className=" overflow-y-auto h-full  break-words w-full box-border scrollbar-custom ">
                {!selectedItem && (
                    <div className="pt-5 h-full max-h-[88vh] min-h-[88vh] h-full">
                        <div className=" shadow bg-neutral-100 h-full rounded-lg p-6 text-center py-14  ">
                            <span className="text-xl font-semibold  text-slate-600 ">
                                {" "}
                                Wybierz element historii, aby zobaczyć szczegóły.
                            </span>
                            <div className="flex justify-center items-center  rounded-lg p-6 mt-20 ">
                                <img
                                    src={IMAGES.historyLogImage}
                                    alt="Artykuł zweryfikowany"
                                    className="w-full max-w-xs sm:max-w-sm md:max-w-md scale-125"
                                />
                            </div>
                        </div>
                    </div>
                )}{" "}
                {selectedItem?.eventType === "updated" && (
                    <div className="max-h-[88vh]">
                        <div className="h-full min-h-[88vh] flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md border border-indigo-200">
                            {/* Sekcja o aktualizacji artykułu na samej górze */}
                            <div className="text-center  mb-14">
                                <div className="flex  items-center gap-3 bg-sky-700/10 py-4 px-6 rounded-lg shadow-lg">
                                    {/* Ikona aktualizacji */}

                                    <div className="min-w-12 h-12 bg-sky-600 text-white rounded-full flex items-center justify-center">
                                        <MdEditDocument size={24} />
                                    </div>
                                    {/* Tekst z aktualizacją */}

                                    <div className="flex justify-between w-full items-center">
                                        <div className="flex flex-col items-start gap-0.5">
                                            <p className="text-xl font-semibold text-gray-800">
                                                Artykuł został zaktualizowany
                                            </p>
                                            <p className="text-xs text-gray-600 font-semibold ">
                                                przez:{" "}
                                                <span className="text-blue-700 font-semibold text-sm">
                                                    {selectedItem?.updatedBy?.name} {selectedItem?.updatedBy?.surname}
                                                </span>
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-indigo-900">
                                            {formatDate(selectedItem?.createdAt, true)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tytuł artykułu i data */}
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 w-full">
                                {/* Ikona artykułu */}
                                <div className="min-w-12 h-12 flex items-center justify-center bg-sky-600 text-white rounded-full shadow-lg">
                                    <MdArticle size={24} />
                                </div>

                                {/* Tytuł artykułu */}
                                <div className="flex flex-col justify-between w-full">
                                    <h2 className="text-3xl font-semibold text-gray-800 ">
                                        {selectedItem?.articleId?.title || "Brak tytułu"}
                                    </h2>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Porównanie zmian:</h3>
                            {/* Sekcja porównania zmian */}
                            <div className="grid grid-cols-2 gap-6 h-auto pr-2 pl-1">
                                {/* Poprzednia wersja */}
                                <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
                                    <h3 className="text-xl font-medium text-gray-700 mb-4">Poprzednia wersja</h3>
                                    {selectedItem?.changes?.map((change) => {
                                        const { leftText } = highlightChanges(change.oldValue, change.newValue);
                                        return (
                                            <div key={change.field}>
                                                <div className="bg-slate-200 text-gray-800 text-base font-medium px-3 py-2 rounded-t-lg">
                                                    {ARTICLE_HISTORY_FIELD_TRANSLATIONS[change?.field]}
                                                </div>
                                                <div
                                                    className="bg-white text-gray-600 p-4 border-b border-gray-200 text-sm shadow rounded-b-lg"
                                                    dangerouslySetInnerHTML={{ __html: leftText }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Nowa wersja */}
                                <div className="flex flex-col gap-4 bg-emerald-50 p-4 rounded-lg shadow-md border border-emerald-200">
                                    <h3 className="text-xl font-medium text-emerald-700 mb-4">Wersja po zmianach</h3>
                                    {selectedItem?.changes?.map((change) => {
                                        const { rightText } = highlightChanges(change.oldValue, change.newValue);
                                        return (
                                            <div key={change.field}>
                                                <div className="bg-emerald-200 text-emerald-800 text-base font-medium px-3 py-2 rounded-t-lg">
                                                    {ARTICLE_HISTORY_FIELD_TRANSLATIONS[change?.field]}
                                                </div>
                                                <div
                                                    className="bg-white text-gray-600 p-4 border-b border-gray-200 text-sm shadow rounded-b-lg"
                                                    dangerouslySetInnerHTML={{ __html: rightText }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserArticleChangesDetails;
