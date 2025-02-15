import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { articlesApi } from "@/lib/articlesApi";

const ArticleCard: React.FC = ({ article, toggleFavorite, navigateToArticle }) => {
  const queryClient = useQueryClient();
  
  const { mutate: toggleFavoriteMutation } = useMutation({
    mutationFn: () => articlesApi.toggleFavorite(article._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
      toggleFavorite(article._id);
    },
  });

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-5 border border-gray-200 transition-all hover:shadow-xl  flex flex-col gap-4">
      {/* Gwiazdka - ulubione */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 transition"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavoriteMutation();
        }}
      >
        {article.isFavorite ? <FaStar size={22} /> : <FaRegStar size={22} />}
      </button>

      {/* Tytuł artykułu */}
      <h3 className="text-lg font-semibold text-gray-800 truncate w-10/12">{article.title}</h3>
      
      {/* Tag produktu */}
      <span
        className="text-xs font-semibold px-3 py-1 rounded-full text-white self-start"
        style={{ backgroundColor: article.product.labelColor || "#6B7280" }}
      >
        {article.product.name}
      </span>
      
      {/* Strzałka nawigacyjna */}
      <button
        className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-900 transition"
        onClick={() => navigateToArticle(article._id)}
      >
        <HiOutlineArrowRight size={26} />
      </button>
    </div>
  );
};

export default ArticleCard;