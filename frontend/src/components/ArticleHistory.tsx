import { articlesApi } from "@/lib/articlesApi";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import ArticleHistoryActivityCard from "./ArticleHistoryActivityCard";
import { MdOutlineDoneAll, MdOutlineMessage } from "react-icons/md";
import { FaBug, FaThumbsUp, FaUser } from "react-icons/fa6";
import { MdBookmarkAdded } from "react-icons/md";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { IoIosAdd } from "react-icons/io";

const ArticleHistory = ({ articleId }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { data: history } = useQuery({
    queryKey: ["articleHistory", articleId],
    queryFn: () => {
      return articlesApi.getArticleHistory({ id: articleId });
    },
  });

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
    <div className="grid grid-cols-[3fr_8fr] h-full gap-1.5 ">
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
          selectedItem?.changes?.map((change, index) => {
            return (
              <div key={index} className="max-h-[82vh]">
                <div>
                  <strong>{change.field}</strong>
                </div>
                <div
                  className="my-2"
                  dangerouslySetInnerHTML={{
                    __html: change.oldValue,
                  }}
                />
                <div
                  className="my-2"
                  dangerouslySetInnerHTML={{
                    __html: change.newValue,
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ArticleHistory;
