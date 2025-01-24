import ARTICLE_HISTORY_FIELD_TRANSLATIONS from '@/enums/articleHistoryFieldTranslations'
import { articlesApi } from '@/lib/articlesApi'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { FaFileSignature, FaTrashCan } from 'react-icons/fa6'
import { IoIosCheckmark } from 'react-icons/io'
import { LiaExchangeAltSolid } from 'react-icons/lia'
import { MdDone, MdOutlineQuestionMark, MdOutlineSettingsBackupRestore } from 'react-icons/md'
import ArticleHistoryActivityCard from './ArticleHistoryActivityCard'
import { IMAGES } from '@/constants/images'
import { formatDate } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'




const UserArticleChangesDetails = ({userId,queryParams}) => {

  const [selectedItem, setSelectedItem] = useState(null);
  const [showArticleDetails, setShowArticleDetails] = useState(false);
  
const {data:userUpdatedArticles} = useQuery({
  queryKey:["articlesUpdatedByUser",userId],
  queryFn:()=>{
      return articlesApi.getArticlesHistoryByUser({userId,searchParams:queryParams})
  }
})


const showHistoryDetails = (selected) => {
  setSelectedItem(selected);
};

const closeArticleHistoryView = (articleId) => {

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
  return (
    <div className="grid grid-cols-[4fr_14fr] h-full gap-1.5 max-h-[88vh] ">
    {/* Lewa kolumna - lista zmian */}
    <div className="border-r overflow-y-auto max-h-[88vh] scrollbar-custom   ">

      {userUpdatedArticles?.map((historyItem, index) => (
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
          <div className="h-full min-h-[88vh] flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md border border-indigo-200 ">
            <div className="flex items-center  gap-4 pb-4 border-b border-gray-200 w-ful">
              <div>
                <div className="w-12 h-12 bg-sky-700 text-white flex items-center justify-center rounded-full">
                  <LiaExchangeAltSolid size={24} />
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <h2 className="text-2xl font-semibold text-sky-700">
                  Artykuł został zaktualizowany
                </h2>
                <span className="text-slate-600 text-base font-semibold ">
                  {formatDate(selectedItem?.createdAt, true)}
                </span>
              </div>
            </div>
            <div className="text-center mt-10 mb-14">
              <p className="text-lg text-gray-600 flex justify-center gap-2 font-semibold">
                Artykuł został zaktualizowany przez:
                <p className="text-indigo-700">
                  {selectedItem?.updatedBy?.name}{" "}
                  {selectedItem?.updatedBy?.surname}
                </p>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6  h-auto pr-2 pl-1 ">
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
              <div className="min-h-[88vh] flex flex-col gap-2 ">
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
          </div>
        </div>
      )}
      {selectedItem?.eventType === "verified" && (
        <div className="min-h-[88vh] h-full flex flex-col gap-7 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
          {/* Header */}
          <div className="flex items-center  gap-4 pb-4 border-b border-gray-200 w-ful">
            <div>
              <div className="w-12 h-12 bg-emerald-600 text-white flex items-center justify-center rounded-full">
                <MdDone size={24} />
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-semibold text-emerald-700">
                Artykuł został zweryfikowany
              </h2>
              <span className="text-slate-600 text-base font-semibold ">
                {formatDate(selectedItem?.createdAt, true)}
              </span>
            </div>
          </div>
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 flex justify-center gap-2 font-semibold">
              Artykuł został pomyślnie zweryfikowany i zatwierdzony przez
              <p className="text-green-500">
                {selectedItem?.updatedBy?.name}{" "}
                {selectedItem?.updatedBy?.surname}
              </p>
            </p>
          </div>
          {/* Placeholder Image */}
          <div className="flex justify-center items-center  rounded-lg p-6  ">
            <img
              src={IMAGES.verifiedImage}
              alt="Artykuł zweryfikowany"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>

          {/* Informacja o weryfikacji */}
        </div>
      )}
      {selectedItem?.eventType === "unverified" && (
        <div className="min-h-[88vh] h-full flex flex-col gap-7 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
          {/* Header */}
          <div className="flex items-center  gap-4 pb-4 border-b border-gray-200 w-ful">
            <div>
              <div className="w-12 h-12 bg-slate-600 text-white flex items-center justify-center rounded-full">
                <MdOutlineQuestionMark size={24} />
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-semibold text-slate-700">
                Weryfikacja artykułu została cofnięta
              </h2>
              <span className="text-slate-600 text-base font-semibold ">
                {formatDate(selectedItem?.createdAt, true)}
              </span>
            </div>
          </div>
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 flex justify-center gap-2 font-semibold">
              Status artykułu został ustawiony jako 'Do zweryfikowania'
              <p className="text-slate-800">
                {selectedItem?.updatedBy?.name}{" "}
                {selectedItem?.updatedBy?.surname}
              </p>
            </p>
          </div>
          {/* Placeholder Image */}
          <div className="flex justify-center items-center  rounded-lg p-6  ">
            <img
              src={IMAGES.unverifiedImage}
              alt="Artykuł zweryfikowany"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>

          {/* Informacja o weryfikacji */}
        </div>
      )}
      {selectedItem?.eventType === "trashed" && (
        <div className="min-h-[88vh] h-full flex flex-col gap-7 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
          {/* Header */}
          <div className="flex items-center  gap-4 pb-4 border-b border-gray-200 w-ful">
            <div>
              <div className="w-12 h-12 bg-rose-600/90 text-white flex items-center justify-center rounded-full">
                <FaTrashCan size={24} />
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-semibold text-red-700">
                Artykuł został przeniesiony do kosza
              </h2>
              <span className="text-slate-600 text-base font-semibold ">
                {formatDate(selectedItem?.createdAt, true)}
              </span>
            </div>
          </div>
          <div className="text-center mt-16 mb-14">
            <p className="text-lg text-gray-600 flex justify-center gap-2 font-semibold">
              Artykuł został przeniesiony do kosza przez:
              <p className="text-red-500">
                {selectedItem?.updatedBy?.name}{" "}
                {selectedItem?.updatedBy?.surname}
              </p>
            </p>
          </div>
          {/* Placeholder Image */}
          <div className="flex justify-center items-center mt-8 rounded-lg  ">
            <div className="border  bg-rose-200/60 w-[60%] rounded-2xl flex justify-center pt-20 ">
              <img
                src={IMAGES.trashedImage}
                alt="Artykuł zweryfikowany"
                className="w-full h-full max-w-xs sm:max-w-sm md:max-w-md scale-150"
              />
            </div>
          </div>
          {/* Informacja o weryfikacji */}
        </div>
      )}
      {selectedItem?.eventType === "restored" && (
        <div className="min-h-[88vh] h-full flex flex-col gap-7 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
          {/* Header */}
          <div className="flex items-center  gap-4 pb-4 border-b border-gray-200 w-ful">
            <div>
              <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
                <MdOutlineSettingsBackupRestore size={24} />
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-semibold text-amber-700">
                Artykuł został przywrócony
              </h2>
              <span className="text-slate-600 text-base font-semibold ">
                {formatDate(selectedItem?.createdAt, true)}
              </span>
            </div>
          </div>
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 flex justify-center gap-2 font-semibold">
              Artykuł został przywrócony z usuniętych przez:
              <p className="text-amber-500">
                {selectedItem?.updatedBy?.name}{" "}
                {selectedItem?.updatedBy?.surname}
              </p>
            </p>
          </div>
          {/* Placeholder Image */}
          <div className="flex justify-center items-center  rounded-lg p-6 mt-12 ">
            <img
              src={IMAGES.restoredImage}
              alt="Artykuł zweryfikowany"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md scale-125"
            />
          </div>

          {/* Informacja o weryfikacji */}
        </div>
      )}
    </div>
  </div>
  )
}

export default UserArticleChangesDetails