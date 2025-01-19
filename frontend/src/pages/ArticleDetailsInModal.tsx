import BadgeLabel from "@/components/core/BadgeLabel";
import { articlesApi } from "@/lib/articlesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdOutlineUpdate } from "react-icons/md";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useOutletContext } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoMdArrowDropright, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { formatDate } from "@/lib/utils";
import { FaCalendarCheck } from "react-icons/fa6";
import { Dropdown } from "@/components/core/Dropdown";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaStar } from "react-icons/fa6";
import { FaEdit, FaHistory } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { toast } from "@/hooks/use-toast";
import { useAlertModal } from "@/hooks/useAlertModal";
import { useModalContext } from "@/contexts/ModalContext";
import ArticleDetailsSkeleton from "@/components/ArticleDetailsSkeleton";
import { ArticleForm } from "@/components/ArticleForm";
import EditArticle from "./EditArticle";
import { FaRegStar } from "react-icons/fa";
import ArticleHistory from "@/components/ArticleHistory";
import ArticleDetailsCard from "@/components/ArticleDetailsCard";
import { EArticleVariant } from "@/enums/ArticleCardVariant";

const ArticleDetailsInModal = ({ articleId, type }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openModal, openContentModal, closeContentModal } = useModalContext();

  const {
    data: article,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["article", id || articleId],
    queryFn: () => {
      return articlesApi.getArticle({ id: id || articleId });
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

  const { mutate: markAsFavouriteHandler } = useMutation({
    mutationFn: ({ id }) => {
      return articlesApi.markArticleAsFavourite({ id: id || articleId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["article", id]);
      toast({
        title: "Sukces",
        description: data?.message,
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
        <ArticleHistory articleId={article?._id} showBackwardArrow={true} />
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
              verifyArticleHandler({ id, isVerified: false });
            },
            icon: <TiArrowBack />,
          },
        ]
      : [
          {
            label: "Zweryfikuj",

            actionHandler: () => {
              verifyArticleHandler({ id, isVerified: true });
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

  if (isLoading) {
    return <ArticleDetailsSkeleton />;
  }



  return (
    <ArticleDetailsCard
      article={article}
      actionOptions={articleDropdownOptions}
      variant={EArticleVariant.IN_MODAL}
    />
    
  );
};

export default ArticleDetailsInModal;
