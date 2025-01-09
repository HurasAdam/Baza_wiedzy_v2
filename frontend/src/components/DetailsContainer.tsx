import { articlesApi } from "@/lib/articlesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { IoClose } from "react-icons/io5";
import ArticleDetailsCardLite from "./ArticleDetailsCardLite";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { useModalContext } from "@/contexts/ModalContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import ArticleHistory from "./ArticleHistory";
import useMarkArticleAsFavourite from "@/hooks/useMarkArticleAsFavourite";
import EditArticle from "@/pages/EditArticle";
import { FaEdit, FaHistory } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const DetailsContainer: React.FC = ({ id, onClose }) => {
  const { openModal, openContentModal, closeContentModal } = useModalContext();
  const queryClient = useQueryClient();
  const { mutate: markAsFavouriteHandler } = useMarkArticleAsFavourite();
  const navigate = useNavigate();
  const { data: article } = useQuery({
    queryKey: ["article", id],
    queryFn: () => {
      return articlesApi.getArticle({ id });
    },
  });

  const { mutate } = useMutation({
    mutationFn: ({ id, isVerified }) => {
      return articlesApi.verifyArticle({ id, isVerified });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["article", id]);
      toast({
        title: "Sukces",
        description: data.message,
        variant: "success",
        duration: 3550,
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
      label: `${
        article?.isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
      }`,
      icon: article?.isFavourite ? <FaStar /> : <FaRegStar />,
      actionHandler: () => markAsFavouriteHandler({ id }),
    },
    {
      label: "Edytuj",
      icon: <FaEdit />,
      actionHandler: () => EditArticleHandler(article),
    },

    ...(article?.isVerified
      ? [
          {
            label: "Cofnij weryfikację",

            actionHandler: () => {
              verifyArticleHandler({ id: article?._id, isVerified: false });
            },
            icon: <TiArrowBack />,
          },
        ]
      : [
          {
            label: "Zweryfikuj",

            actionHandler: () => {
              verifyArticleHandler({ id: article?._id, isVerified: true });
            },

            icon: <IoMdCheckmarkCircleOutline />,
          },
        ]),
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
    <div className="border-2 p-4 rounded-lg max-h-[94vh] overflow-y-auto bg-white scrollbar-custom ">
      <div className="flex justify-end">
        <button
          className="border p-0.5 rounded-md border-transparent hover:bg-gray-800 hover:text-white"
          onClick={onClose}
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>
      {article ? (
        <ArticleDetailsCardLite
          article={article}
          actionOptions={articleDropdownOptions}
        />
      ) : (
        <p>Wybierz komentarz, aby zobaczyć szczegóły.</p>
      )}
    </div>
  );
};

export default DetailsContainer;
