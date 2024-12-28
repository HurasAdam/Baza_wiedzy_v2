import { articlesApi } from "@/lib/articlesApi";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import ArticleHistoryActivityCard from "./ArticleHistoryActivityCard";
import { MdOutlineDoneAll, MdOutlineMessage } from "react-icons/md";
import { FaBug, FaThumbsUp, FaUser } from "react-icons/fa6";
import { MdBookmarkAdded } from "react-icons/md";
import { FaClockRotateLeft } from "react-icons/fa6";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { IoIosAdd } from "react-icons/io";
import { MdDone } from "react-icons/md";

import { diff_match_patch } from "diff-match-patch";
import ARTICLE_HISTORY_FIELD_TRANSLATIONS from "@/enums/articleHistoryFieldTranslations";

const ArticleHistory = ({ articleId }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { data: history } = useQuery({
    queryKey: ["articleHistory", articleId],
    queryFn: () => {
      return articlesApi.getArticleHistory({ id: articleId });
    },
  });

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
    commented: (
      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
        <MdOutlineMessage />,
      </div>
    ),
    created: (
      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
        <IoIosAdd size={26} />
      </div>
    ),
    verified: (
      <div className="w-8 h-8  flex items-center justify-center rounded-full bg-gray-500 text-white">
        <FaUser size={21} />
      </div>
    ),
    trashed: (
      <div className="text-red-600">
        <FaBug size={21} />
      </div>
    ),
    updated: (
      <div className="w-8 h-8  rounded-full bg-sky-700 flex items-center justify-center text-white">
        <LiaExchangeAltSolid size={20} />
      </div>
    ),
  };
  const showHistoryDetails = (selected) => {
    setSelectedItem(selected);
  };
  return (
    <div className="grid grid-cols-[4fr_14fr] h-full gap-1.5 ">
      {/* Lewa kolumna - lista zmian */}
      <div className="border-r overflow-y-auto max-h-[88vh] scrollbar-custom  ">
        {history?.map((historyItem, index) => (
          <ArticleHistoryActivityCard
            onClick={showHistoryDetails}
            item={historyItem}
            taskTypeIcons={TASKTYPEICON}
            selectedItem={selectedItem}
          />
        ))}
      </div>

      {/* Prawa kolumna - może być pusta */}
      <div className=" overflow-y-auto h-full  break-words w-full box-border scrollbar-custom ">
        {!selectedItem ? (
          <div className="pt-5 h-full">
            <div className=" shadow bg-neutral-100 h-full rounded-lg p-6  ">
              <span className="text-xl font-base text-blue-950">
                {" "}
                Wybierz element historii, aby zobaczyć szczegóły.
              </span>
            </div>
          </div>
        ) : selectedItem?.eventType === "created" ? (
          <div className="max-h-[88vh]    ">
            {/* Title */}
            <div className="bg-indigo-600/80  rounded    px-6 py-2">
              <span className="text-xs text-slate-200">Tytuł:</span>
              <div className="text-neutral-50 font-inter text-lg ">
                {selectedItem?.articleDetails?.title}
              </div>
            </div>

            {/* Employee Description */}
            <div className="   px-6 py-5">
              <div className="my-10">
                <span>Uwagi:</span>
                <div
                  className="my-2"
                  dangerouslySetInnerHTML={{
                    __html: selectedItem?.articleDetails?.employeeDescription,
                  }}
                />
              </div>

              {/* Client Description */}
              <div>
                <strong>Odpowiedź dla klienta:</strong>
                <div
                  className="my-2"
                  dangerouslySetInnerHTML={{
                    __html: selectedItem?.articleDetails?.clientDescription,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6  h-auto pr-2 pl-1">
            <div className="max-h-[88vh] flex flex-col gap-2 ">
              <h2 className="px-1.5 py-1.5 font-inter text-slate-700">
                Poprzednia wersja
              </h2>
              {selectedItem?.changes?.map((change) => {
                const { leftText } = highlightChanges(
                  change.oldValue,
                  change.newValue
                );
                return (
                  <div className="">
                    <div className="bg-slate-400 text-neutral-50 text-base font-inter border px-3.5 py-2 shadow  rounded-t-lg  ">
                      {" "}
                      {
                        ARTICLE_HISTORY_FIELD_TRANSLATIONS[
                          change?.field || change?.field
                        ]
                      }
                    </div>
                    <div
                      className="text-slate-600  leading-6 text-sm p-4 h-auto border p-3 shadow bg-white rounded-b-lg  "
                      dangerouslySetInnerHTML={{ __html: leftText }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="max-h-[88vh] flex flex-col gap-2 ">
              <h2 className="px-1.5 py-1.5 font-inter text-emerald-700/90">
                Wersja po zmianach
              </h2>
              {selectedItem?.changes?.map((change) => {
                const { rightText } = highlightChanges(
                  change.oldValue,
                  change.newValue
                );
                return (
                  <div>
                    <div className="bg-emerald-500/90 text-neutral-50 text-base font-inter border px-3.5 py-2 shadow  rounded-t-lg">
                      {" "}
                      {
                        ARTICLE_HISTORY_FIELD_TRANSLATIONS[
                          change?.field || change?.field
                        ]
                      }
                    </div>
                    <div
                      className="text-slate-600 leading-6 text-sm p-4 h-auto border p-3 shadow bg-white rounded-b-lg  "
                      dangerouslySetInnerHTML={{ __html: rightText }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleHistory;
