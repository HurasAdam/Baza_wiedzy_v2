import React from "react";
import { HiMiniXMark } from "react-icons/hi2";
import QuickArticleDetails from "./QuickArticleDetails";
import { Button } from "./ui/button";
import { IMAGES } from "@/constants/images";
import { X } from "lucide-react";
import ArticleDetailsCard from "./ArticleDetailsCard";
import { articlesApi } from "@/lib/articlesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaHistory, FaRegStar, FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { TiArrowBack } from "react-icons/ti";
import ArticleHistory from "./ArticleHistory";
import { useNavigate } from "react-router-dom";
import { useModalContext } from "@/contexts/ModalContext";
import { toast } from "@/hooks/use-toast";
import ArticleDetailsCardLite from "./ArticleDetailsCardLite";
import useMarkArticleAsFavourite from "@/hooks/useMarkArticleAsFavourite";
import EditArticle from "@/pages/EditArticle";

interface IProps {
  articleId: string;
  onClose: () => void;
}

const QuickViewSection: React.FC<IProps> = ({ articleId, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openContentModal, closeContentModal, openModal } = useModalContext();
  const { mutate: markAsFavouriteHandler } = useMarkArticleAsFavourite();
  const {
    data: article,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => {
      return articlesApi.getArticle({ id: articleId });
    },
  });

  const { mutate } = useMutation({
    mutationFn: ({ id, isVerified }) => {
      return articlesApi.verifyArticle({ id, isVerified });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["article", articleId]);
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

  const deleteArticleHandler = ({ article }) => {
    openModal(
      "Czy jestes pewien?",
      "Czy jesteś pewien, że chcesz usunąć ten artykuł? Potwierdź, aby kontynuować.",
      () => {
        deleteArticleMutation({ id: article?._id || articleId });
      }
    );
  };

  const verifyArticleHandler = ({ article, isVerified }) => {
    const modalTitle = !isVerified
      ? "Cofnięcie weryfikacji artykułu"
      : "Potwierdzenie weryfikacji artykułu";

    const modalDescription = !isVerified
      ? "Czy na pewno chcesz cofnąć weryfikację tego artykułu? To może wpłynąć na jego wiarygodność."
      : "Czy na pewno chcesz zweryfikować ten artykuł? Zweryfikowany artykuł będzie oznaczony jako wiarygodny.";
    openModal(modalTitle, modalDescription, () => {
      mutate({ id: article?._id || articleId, isVerified });
    });
  };

  const EditArticleHandler = (article) => {
    openContentModal({
      closeOnOutsideClick: false,
      title: "Edytuj Artykuł",
      description:
        "Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.",
      content: <EditArticle type="view" article={article} />,
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
      actionHandler: (article) => markAsFavouriteHandler({ id: article?._id }),
    },
    {
      label: "Edytuj",
      icon: <FaEdit />,
      actionHandler: (article) => EditArticleHandler(article),
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

            actionHandler: (article) => {
              verifyArticleHandler({ id: article?._id, isVerified: true });
            },

            icon: <IoMdCheckmarkCircleOutline />,
          },
        ]),
    {
      label: "Historia modyfikacji",
      icon: <FaHistory />,
      actionHandler: (article) => showArticleHistory(article),
      tooltip: "Zobacz historię modyfikacji",
    },

    // {label:"Zweryfikuj", icon: article?.isVerified ?<IoArrowBackCircleSharp/>:<FaCheckCircle/> , actionHandler:()=>mutate({id, isVerified: true }) },
    {
      label: "Usuń",
      icon: <MdDelete />,
      actionHandler: (article) => {
        deleteArticleHandler({ id: article?._id });
      },
    },
  ];

  if (!articleId) {
    return (
      <div className="  rounded-xl  min-h-[82vh] max-h-[82vh] sticky top-16 right-0 overflow-hidden ">
        <img
          className="object-contain w-full h-[94vh] "
          src={IMAGES.data_placeholder}
          alt=""
        />
      </div>
    );
  }

  return (
    <div className=" bg-white border shadow  rounded-xl overflow-y-auto min-h-[80vh] max-h-[80vh] sticky top-16 right-0 scrollbar-custom">
      <div className="flex justify-end absolute top-0 right-0">
        <button
          onClick={onClose}
          className="hover:bg-slate-700 px-1.5 py-1.5 rounded-lg  group"
        >
          <X className="w-5 h-5 text-slate-500 group-hover:text-neutral-50" />
        </button>
      </div>
      {/* <QuickArticleDetails articleId={articleId} /> */}
      <ArticleDetailsCardLite
        actionOptions={articleDropdownOptions}
        article={article}
      />
    </div>
  );
};

export default QuickViewSection;
