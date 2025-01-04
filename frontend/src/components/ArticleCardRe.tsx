import React from "react";
import { FaStar, FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

const ArticleCard = ({ article, onFavouriteToggle, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header - Logo and Title */}
      <div className="p-5 flex items-center gap-4">
        <img
          src={article.companyLogo}
          alt="Company Logo"
          className="w-12 h-12 object-cover rounded-md"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {article.companyName} - {article.location}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {article.employeeDescription}
        </p>
      </div>

      {/* Footer - Tags and Actions */}
      <div className="flex items-center justify-between p-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onFavouriteToggle(article.id)}
            className={`p-2 rounded-full transition cursor-pointer ${
              article.isFavourite
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <FaStar size={16} />
          </div>

          {article.isVerified ? (
            <IoCheckmarkCircle className="text-green-500" size={20} />
          ) : (
            <IoCloseCircle className="text-red-500" size={20} />
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onEdit(article.id)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => onDelete(article.id)}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
