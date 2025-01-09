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

interface IReview {
  id: number;
  content: string;
  author: {
    name: string;
    contactInfo: string;
  };
  volunteer: {
    name: string;
    volunteerId: number;
  };
  date: string;
  rating: number; // Zakres 1-10
  status: "pending" | "approved" | "rejected" | "spam";
}

interface IReviewCardProps {
  review: IReview;
}

const ReviewCard: React.FC = ({ article, selectedArticle }) => {
  const { openModal, openContentModal, closeContentModal } = useModalContext();
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
      return articlesApi.trashArticle({ id });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("articles");
      navigate("/articles");
      if (type === "modal") {
        closeContentModal();
      }

      toast({
        title: "Sukces",
        description: data?.message,
        variant: "success",
        duration: 3550,
      });
    },
  });

  const deleteArticleHandler = ({ id }) => {
    openModal(
      "Czy jestes pewien?",
      "Czy jesteś pewien, że chcesz usunąć ten artykuł? Potwierdź, aby kontynuować.",
      () => {
        deleteArticleMutation({ id: id || articleId });
      }
    );
  };

  const restoreArticleHandler = ({ id }) => {
    openModal(
      "Czy jestes pewien?",
      "Czy jesteś pewien, że chcesz przwrócić ten artykuł? Potwierdź, aby kontynuować.",
      () => {
        restoreDeletedArticleHandler({ id });
      }
    );
  };

  const verifyArticleHandler = ({ id, isVerified }) => {
    const modalTitle = !isVerified
      ? "Cofnięcie weryfikacji artykułu"
      : "Potwierdzenie weryfikacji artykułu";

    const modalDescription = !isVerified
      ? "Czy na pewno chcesz cofnąć weryfikację tego artykułu? To może wpłynąć na jego wiarygodność."
      : "Czy na pewno chcesz zweryfikować ten artykuł? Zweryfikowany artykuł będzie oznaczony jako wiarygodny.";
    openModal(modalTitle, modalDescription, () => {
      mutate({ id: id || articleId, isVerified });
    });
  };

  const EditArticleHandler = (article) => {
    openContentModal({
      closeOnOutsideClick: false,
      title: "Edytuj Artykuł",
      description:
        "Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.",
      content: <EditArticle type={id ? "view" : "modal"} article={article} />,
      size: "xl",
    });
  };

  const showArticleHistory = (article) => {
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
      actionHandler: () => restoreArticleHandler({ id: article?._id }),
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
      actionHandler: () => {
        deleteArticleHandler({ id });
      },
    },
  ];

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all transform cursor-pointer ${
        isSelected ? "bg-indigo-300 border-2  " : "border-2 border-transparent"
      }`}
    >
      {/* Card Header */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4">
        {/* Product Name (left side) */}
        <span
          className="text-sm font-semibold px-3 py-1 rounded-full truncate mb-2 md:mb-0"
          style={{
            backgroundColor: article.product.labelColor,
            color: "#fff",
          }}
        >
          {article.product.name}
        </span>

        {/* Options (right side) */}
        <div className="flex space-x-2 ml-0 md:ml-4">
          {articleDropdownOptions?.map(({ lalbe, icon, actionHandler }) => {
            return (
              <button
                className="p-2 text-gray-600 hover:text-blue-500 hover:bg-gray-100 rounded-full transition duration-200"
                onClick={() => actionHandler(article.id)}
                aria-label="Przywróć"
              >
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Title Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {article.title}
        </h3>
      </div>
    </div>
  );
};

export default ReviewCard;
