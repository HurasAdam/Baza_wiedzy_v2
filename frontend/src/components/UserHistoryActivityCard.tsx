import { formatDate } from "@/lib/utils";

const UserHistoryActivityCard = ({
  item,
  taskTypeIcons,
  onClick,
  selectedItem,
}) => {
  return (
    <div
      className={ `p-3 rounded-lg cursor-pointer shadow-sm border ${selectedItem?._id === item?._id
          ? "bg-blue-100 border-blue-500"
          : "bg-white"
        } hover:bg-slate-200` }
      onClick={ () => onClick(item) }
    >
      <div className="flex space-x-4">
        {/* Ikona typu zadania */ }
        <div className="w-12 h-12 flex items-center justify-center">
          { taskTypeIcons[item?.eventType] }
        </div>

        {/* Szczegóły artykułu */ }
        <div className="flex flex-col justify-between w-full">
          <div className="font-semibold text-gray-800 text-base">
            { item?.articleId?.title || "Artykuł usunięty" }
          </div>
          <p className="text-sm text-slate-600">{ formatDate(item?.createdAt, true) }</p>
        </div>
      </div>
    </div>
  );
};

export default UserHistoryActivityCard;
