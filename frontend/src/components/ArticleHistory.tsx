import { articleApi } from "@/lib/article.api";
import { useQuery } from "@tanstack/react-query";
import { diff_match_patch } from "diff-match-patch";
import { useState } from "react";
import { FaFileSignature, FaTrashCan } from "react-icons/fa6";
import { IoIosCheckmark } from "react-icons/io";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { MdOutlineQuestionMark, MdOutlineSettingsBackupRestore } from "react-icons/md";
import EVENT_TYPE_TRANSLATIONS from "../enums/articleEventTypeTranslations";
import ArticleHistoryDetails from "./articles/history/ArticleHistoryDetails";

const ArticleHistory = ({ articleId, showBackwardArrow = false, closeArticleHistory, onBackward }) => {
    const [activeTab, setActiveTab] = useState("personalization");
    const [selectedItem, setSelectedItem] = useState(null);
    const [showArticleDetails, setShowArticleDetails] = useState(false);
    const { data: history } = useQuery({
        queryKey: ["articleHistory", articleId],
        queryFn: () => {
            return articleApi.getArticleHistory({ id: articleId });
        },
    });

    const { data: historyItem, isLoading: isLoadingDetails } = useQuery({
        queryKey: ["historyItem", selectedItem],
        queryFn: () => {
            return articleApi.getArticleHistoryItem({ id: selectedItem });
        },
        enabled: !!selectedItem,
    });

    const showDetails = ({ id }) => {
        setSelectedItem(id);
    };

    const stripHTML = (text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        return doc.body.textContent || doc.body.innerText || "";
    };

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
            <div className="w-8 h-8  rounded-full bg-sky-700 flex items-center justify-center text-white">
                <LiaExchangeAltSolid size={18} />
            </div>
        ),
    };
    const showHistoryDetails = (selected) => {
        setSelectedItem(selected);
    };

    const closeArticleHistoryView = (articleId) => {};

    return (
        <div className="flex w-full h-full pt-2">
            {/* Sidebar - lewa część */}
            <div className="min-w-[320px] py-4 pl-6 pr-5 border-r bg-card shadow-sm h-full overflow-auto scrollbar-custom">
                <ul className="relative space-y-5">
                    {history?.map((historyItem, index) => {
                        const isActive = historyItem._id === selectedItem;
                        return (
                            <li
                                key={index}
                                className={`relative flex gap-4 items-center `}
                                onClick={() => showDetails({ id: historyItem._id })}
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-foreground shadow-md z-10">
                                    {TASKTYPEICON[historyItem?.eventType]}
                                </div>
                                {index !== history.length - 1 && (
                                    <div className="absolute top-12 left-4 w-0.5 h-full bg-muted"></div>
                                )}
                                <div
                                    className={`bg-background px-4 py-3 rounded-xl shadow-md  border w-full cursor-pointer ${isActive && "border-primary border bg-muted/80"}`}
                                >
                                    <h4 className="font-semibold text-foreground text-sm tracking-wide">
                                        {EVENT_TYPE_TRANSLATIONS[historyItem?.eventType]}
                                    </h4>
                                    <p className="text-xs text-gray-500 ">
                                        {new Date(historyItem?.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {/* Treść zakładki - prawa część */}
            <div className="flex-1 p-4 px-5 bg-background w-full h-full overflow-y-auto scrollbar-custom">
                <div className="flex-1 flex flex-col h-full">
                    {selectedItem && !isLoadingDetails && historyItem ? (
                        <ArticleHistoryDetails historyItem={historyItem} />
                    ) : isLoadingDetails ? (
                        <div className="flex-1 px-4 py-6 overflow-y-auto max-h-full">
                            <div className="flex flex-col items-center justify-center h-full text-center  rounded-2xl shadow-lg p-6">
                                <div className="relative w-16 h-16 mb-6  animate-spin-slow">
                                    {/* Obracający się pierścień */}
                                    <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary  animate-spin-slow" />

                                    {/* Static inner glow */}
                                    <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner  animate-spin-slow" />

                                    {/* Centralna kulka jako core-logo */}
                                    <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10  animate-pulse" />
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-2">Ładowanie...</h2>
                                <p className="text-sm text-muted-foreground max-w-md">Trwa pobieranie danych...</p>
                            </div>
                        </div>
                    ) : (
                        // <div className="flex-1 p-4 px-5 bg-background w-full h-full flex justify-center items-center">
                        //     <div className="text-center">
                        //         <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse mx-auto mb-4"></div>
                        //         <h3 className="text-xl font-semibold text-foreground/85">Wybierz element z listy</h3>
                        //         <p className="text-sm text-foreground/75 mt-2">
                        //             Aby zobaczyć szczegóły historii, kliknij w jedną z pozycji po lewej stronie.
                        //         </p>
                        //     </div>
                        // </div>
                        <div className="flex flex-col items-center justify-center h-full text-center border border-border rounded-2xl shadow-lg p-6">
                            <div className="relative w-16 h-16 mb-6">
                                {/* Obracający się pierścień */}
                                <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary" />

                                {/* Static inner glow */}
                                <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner" />

                                {/* Centralna kulka jako core-logo */}
                                <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground/85">Wybierz element z listy</h2>
                            <p className="text-sm text-foreground/75 mt-2">
                                Aby zobaczyć szczegóły historii, kliknij w jedną z pozycji po lewej stronie.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleHistory;
