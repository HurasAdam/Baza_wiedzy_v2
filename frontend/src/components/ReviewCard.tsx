import { useModalContext } from "@/contexts/ModalContext";
import { toast } from "@/hooks/use-toast";
import useMarkArticleAsFavourite from "@/hooks/useMarkArticleAsFavourite";
import { articlesApi } from "@/lib/articlesApi";
import EditArticle from "@/pages/EditArticle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import ArticleHistory from "./ArticleHistory";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FaEdit, FaHistory } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

const ReviewCard: React.FC = ({
  article,
  selectedArticle,
  handleCloseCard,
}) => {
  const { openModal, openContentModal } = useModalContext();
  const queryClient = useQueryClient();
  const isSelected = article._id === selectedArticle;
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: ({ id, isVerified }) => {
      return articlesApi.verifyArticle({ id, isVerified });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["article"]);
      toast({
        title: "Sukces",
        description: data.message,
        variant: "success",
        duration: 3550,
      });
    },
  });

  const { mutate: restoreDeletedArticleHandler, isLoading } = useMutation({
    mutationFn: ({ id }) => {
      return articlesApi.restoreArticle({ id });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["articles"]);
      handleCloseCard();
      toast({
        title: "Sukces",
        description: data?.message,
        duration: 3600,
        variant: "success",
      });
    },
  });

  const { mutate: deleteArticleMutation } = useMutation({
    mutationFn: ({ id }) => {
      return articlesApi.deleteArticle({ id });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("articles");
      handleCloseCard();
      toast({
        title: "Sukces",
        description: data?.message,
        variant: "success",
        duration: 3550,
      });
    },
  });

  const deleteArticleHandler = ({ id, isUsed }) => {
    openModal(
      "Czy jestes pewien?",
      "Czy jesteś pewien, że chcesz usunąć ten artykuł? Potwierdź, aby kontynuować.",
      () => {
        deleteArticleMutation({ id });
      },
      isUsed
    );
  };

  const restoreArticleHandler = ({ id, isUsed }) => {
    openModal(
      "Czy jestes pewien?",
      "Czy jesteś pewien, że chcesz przwrócić ten artykuł? Potwierdź, aby kontynuować.",
      () => {
        restoreDeletedArticleHandler({ id });
      },
      isUsed
    );
    console.log(isUsed);
  };

  const showArticleHistory = (article, isUsed) => {
    openContentModal({
      title: "Edytuj Artykuł",
      description:
        "Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.",
      content: (
        <ArticleHistory articleId={article?._id} showBackwardArrow={false} />
      ),
      size: "xl",
      height: "82",
      scrollable: false,
    });
  };

  const articleDropdownOptions = [
    {
      label: "Przywróć",
      icon: <MdOutlineSettingsBackupRestore />,
      actionHandler: ({ article, isUsed }) =>
        restoreArticleHandler({ id: article?._id, isUsed }),
    },

    {
      label: "Historia modyfikacji",
      icon: <FaHistory />,
      actionHandler: () => showArticleHistory(article),
      tooltip: "Zobacz historię modyfikacji",
    },

    // {label:"Zweryfikuj", icon: article?.isVerified ?<IoArrowBackCircleSharp/>:<FaCheckCircle/> , actionHandler:()=>mutate({id, isVerified: true }) },
    {
      label: "Usuń",
      icon: <MdDelete />,
      actionHandler: ({ id, isUsed }) => {
        deleteArticleHandler({ id, isUsed });
      },
    },
  ];

  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden cursor-pointer border transition-all transform ${
        isSelected ? "bg-indigo-200" : "bg-white"
      }`}
    >
      {/* Header: Tytuł artykułu */}
      <div
        className={`p-4 border-b ${
          isSelected ? "border-blue-200" : "border-gray-100"
        }`}
      >
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {article.title}
        </h3>
      </div>

      {/* Body: Szczegóły */}
      <div className="p-4 flex justify-between items-center">
        {/* Produkt */}
        <div>
          <span
            className="text-sm font-medium px-3 py-1 rounded-full text-white transition-colors"
            style={{
              backgroundColor: article.product.labelColor || "#9CA3AF", // Domyślny kolor
            }}
          >
            {article.product.name}
          </span>
        </div>

        {/* Akcje */}
        <div className="flex space-x-3">
          {articleDropdownOptions?.map(({ label, icon, actionHandler }) => (
            <button
              key={label}
              className={`p-2 rounded-md flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition duration-200 ${
                label === "Przywróć"
                  ? "hover:bg-amber-500 hover:text-white"
                  : label === "Historia modyfikacji"
                  ? "hover:bg-sky-600 hover:text-white"
                  : label === "Usuń"
                  ? "hover:bg-rose-500 hover:text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                actionHandler({ article, isUsed: true });
              }}
              aria-label={label}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
