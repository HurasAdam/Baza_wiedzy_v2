import { useModalContext } from "@/contexts/ModalContext";
import { articlesApi } from "@/lib/articlesApi";
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
    const { openContentModal } = useModalContext();
    const [selectedItem, setSelectedItem] = useState(null);
    const [showArticleDetails, setShowArticleDetails] = useState(false);
    const { data: history } = useQuery({
        queryKey: ["articleHistory", articleId],
        queryFn: () => {
            return articlesApi.getArticleHistory({ id: articleId });
        },
    });

    const { data: historyItem, isLoading: isLoadingDetails } = useQuery({
        queryKey: ["historyItem", selectedItem],
        queryFn: () => {
            return articlesApi.getArticleHistoryItem({ id: selectedItem });
        },
        enabled: !!selectedItem,
    });

    const showDetails = ({ id }) => {
        setSelectedItem(id);
    };

    console.log("historyItem");
    console.log(historyItem);

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

    const closeArticleHistoryView = (articleId) => {
        openContentModal({
            description: "",
            content: <ArticleDetailsInModal type="modal" articleId={articleId} />,
            enableOutsideClickClose: true,
            size: "xl",
        });
    };

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
            <div className="flex-1 p-4 px-5 bg-background w-full h-full">
                <div className="flex-1 flex flex-col h-full">
                    {selectedItem && !isLoadingDetails && historyItem ? (
                        <ArticleHistoryDetails historyItem={historyItem} />
                    ) : isLoadingDetails ? (
                        <div>Ładowanie szczegółów...</div>
                    ) : (
                        <div className="flex-1 p-4 px-5 bg-background w-full h-full flex justify-center items-center">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse mx-auto mb-4"></div>
                                <h3 className="text-xl font-semibold text-foreground/85">Wybierz element z listy</h3>
                                <p className="text-sm text-foreground/75 mt-2">
                                    Aby zobaczyć szczegóły historii, kliknij w jedną z pozycji po lewej stronie.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleHistory;
