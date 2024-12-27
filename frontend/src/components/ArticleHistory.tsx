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
    <div className="grid grid-cols-[4fr_12fr] h-full gap-1.5 ">
      {/* Lewa kolumna - lista zmian */}
      <div className="border-r overflow-y-auto max-h-[80vh] scrollbar-custom  ">
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
        {selectedItem?.eventType === "created" ? (
          <div className="max-h-[82vh]   ">
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
          <div className=" flex flex-col max-h-[82vh] ">
            {selectedItem?.changes?.map((change, index) => {
              const { leftText, rightText } = highlightChanges(
                change.oldValue,
                change.newValue
              );

              // Określenie klasy tła na podstawie pola (field)
              const backgroundClass =
                change?.field === "title" ||
                change?.field === "clientDescription"
                  ? "bg-transparent" // Pomarańczowe tło dla tych pól
                  : "bg-transparent"; // Inny kolor tła dla pozostałych, np. brak tła

              return (
                <div key={index} className=" mb-4 ">
                  {" "}
                  {/* Dodajemy odstęp między poszczególnymi zmianami */}
                  {/* Wyświetlanie zmian w dwóch kolumnach */}
                  <div
                    className={`grid grid-cols-2 gap-6 my-4 h-auto pr-2 pl-1 ${backgroundClass}`}
                  >
                    {/* Lewa kolumna - tekst przed zmianą */}
                    <div className="h-auto ">
                      <h3 className="text-indigo-700/80 font-title text-lg flex items-center gap-2 px-2 mb-2">
                        <FaClockRotateLeft />
                        <span>
                          {
                            change?.field === "title"
                              ? "Tytuł"
                              : change?.field === "employeeDescription"
                              ? "Uwagi"
                              : change?.field === "clientDescription"
                              ? "Odpowiedź dla klienta"
                              : "Nieznane pole" // Domyślna wartość, jeśli `change?.field` nie pasuje do żadnego z przypadków
                          }
                        </span>
                      </h3>
                      <div
                        className="text-slate-600 mt-3 leading-6 text-sm p-4 h-auto "
                        dangerouslySetInnerHTML={{ __html: leftText }}
                      />
                    </div>
                    {/* Prawa kolumna - tekst po zmianie */}
                    <div className="min-h-auto">
                      <h3 className="text-indigo-700/80 font-title text-lg flex items-center gap-2 px-2 mb-2">
                        <MdDone />
                        <span>
                          {
                            change?.field === "title"
                              ? "Tytuł"
                              : change?.field === "employeeDescription"
                              ? "Uwagi"
                              : change?.field === "clientDescription"
                              ? "Odpowiedź dla klienta"
                              : "Nieznane pole" // Domyślna wartość, jeśli `change?.field` nie pasuje do żadnego z przypadków
                          }
                        </span>
                      </h3>
                      <div
                        className="text-slate-600 mt-3 leading-6 text-sm p-4 h-auto "
                        dangerouslySetInnerHTML={{ __html: rightText }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleHistory;
