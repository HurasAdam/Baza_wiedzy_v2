import EVENT_TYPE_TRANSLATIONS from "@/enums/articleEventTypeTranslations";
import { formatDate } from "@/utils/format-date";

const ArticleHistoryActivityCard = ({ item, taskTypeIcons, onClick, selectedItem }) => {
    return (
        <div
            className={`flex space-x-4 px-0.5 hover:bg-slate-200 cursor-pointer ${
                selectedItem?._id === item?._id ? "bg-blue-200 rounded-lg hover:bg-blue-200" : ""
            }`}
            onClick={() => onClick(item)}
        >
            <div className="flex flex-col items-center flex-shrink-0 ">
                <div className="w-full flex items-center justify-center h-full">
                    <div className="w-0.5  bg-gray-500 h-[100%]"></div>
                </div>
                <div className="w-10 h-10 flex items-center justify-center ">{taskTypeIcons[item?.eventType]}</div>
                <div className="w-full flex items-center justify-center h-full">
                    <div className="w-0.5  bg-gray-500 h-[100%]"></div>
                </div>
            </div>

            <div className="flex flex-col gap-y-1 p-3 ">
                <span className="text-gray-700 font-semibold text-base">
                    {EVENT_TYPE_TRANSLATIONS[item?.eventType || item?.eventType]}
                </span>

                <p className="text-sm text-slate-600 font-base ">{formatDate(item?.createdAt, true)}</p>
            </div>
        </div>
    );
};

export default ArticleHistoryActivityCard;
