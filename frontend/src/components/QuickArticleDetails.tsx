import BadgeLabel from "@/components/core/BadgeLabel";
import { articlesApi } from "@/lib/articlesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { toast } from "@/hooks/use-toast";
import { useAlertModal } from "@/hooks/useAlertModal";
import { useModalContext } from "@/contexts/ModalContext";
import ArticleDetailsSkeleton from "@/components/ArticleDetailsSkeleton";
import { IoCheckmarkSharp } from "react-icons/io5";
import { BiSolidCopy } from "react-icons/bi";
import EditArticle from "@/pages/EditArticle";
import { Tooltip } from "@radix-ui/react-tooltip";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import ArticleHistory from "./ArticleHistory";
import useMarkArticleAsFavourite from "@/hooks/useMarkArticleAsFavourite";

const QuickArticleDetails: React.FC = ({ articleId, type }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openModal, openContentModal } = useModalContext();
  const { copyToClipboard } = useCopyToClipboard();
  const articleRef = useRef(null);
  const [clipBoardCopyMessage, setClipBoardCopyMessage] =
    useState<string>("Kopiuj");

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
        duration: 3550,
      });
    },
  });

  const { mutate: markAsFavouriteHandler } = useMarkArticleAsFavourite();

  const { mutate: deleteArticleMutation } = useMutation({
    mutationFn: ({ id }) => {
      return articlesApi.trashArticle({ id });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("articles");
      navigate("/articles");

      toast({
        title: "Sukces",
        description: data?.message,
        duration: 3550,
      });
    },
  });

  const deleteArticleHandler = ({ id }) => {
    openModal(
      "Czy jestes pewien?",
      "Czy jesteś pewien, że chcesz usunąć ten artykuł? Potwierdź, aby kontynuować..",
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
      title: "Edytuj Artykuł",
      description:
        "Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.",
      content: <EditArticle type={id ? "view" : "modal"} article={article} />,
      size: "lg",
    });
  };

  const showArticleHistory = (article) => {
    openContentModal({
      title: "Edytuj Artykuł",
      description:
        "Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.",
      content: <ArticleHistory articleId={article?._id} />,
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
      icon: <FaStar />,
      actionHandler: () => markAsFavouriteHandler({ id: id || articleId }),
      tooltip: "Dodaj do ulubionych / Usuń z ulubionych",
    },
    {
      label: "Edytuj",
      icon: <FaEdit />,
      actionHandler: () => EditArticleHandler(article),
      tooltip: "Edytuj artykuł",
    },

    ...(article?.isVerified
      ? [
          {
            label: "Cofnij weryfikację",
            actionHandler: () => {
              verifyArticleHandler({ id, isVerified: false });
            },
            icon: <TiArrowBack />,
            tooltip: "Cofnij weryfikację artykułu",
          },
        ]
      : [
          {
            label: "Zweryfikuj",
            actionHandler: () => {
              verifyArticleHandler({ id, isVerified: true });
            },
            icon: <IoMdCheckmarkCircleOutline />,
            tooltip: "Zweryfikuj artykuł",
          },
        ]),
    {
      label: "Historia modyfikacji",
      icon: <FaHistory />,
      actionHandler: () => showArticleHistory(article),
      tooltip: "Zobacz historię modyfikacji",
    },
    {
      label: "Usuń",
      icon: <MdDelete />,
      actionHandler: () => {
        deleteArticleHandler({ id });
      },
      tooltip: "Usuń artykuł",
    },
  ];

  const callbackFn = () => {
    setClipBoardCopyMessage("Skopiowano!");
    setTimeout(() => {
      setClipBoardCopyMessage(""); // Resetowanie wiadomości po pewnym czasie
    }, 760);
  };

  if (isLoading) {
    return <ArticleDetailsSkeleton />;
  }

  return (
    <div className=" px-6 pb-3 py-5 articleDetails-quickView ">
      {/* LEFT SIDE */}

      <div className=" flex flex-col space-y-1.5 ">
        <div className="  px-5 mb-2 flex flex-col justify-between rounded-xl  ">
          <div className="flex gap-1  justify-between  pr-1 mt-1.5 ">
            <div
              className="flex justify-center  h-fit group cursor-pointer "
              onClick={() => markAsFavouriteHandler({ id: id || articleId })}
            >
              {" "}
              {article?.isFavourite ? (
                <FaStar className="w-5 h-5 text-amber-600/70 group-hover:text-amber-400/90 transition-all duration-75" />
              ) : (
                <FaStar className="w-5 h-5 text-slate-200 group-hover:text-blue-200 transition-all" />
              )}
            </div>
            <div className="flex gap-2 justify-end px-0 my-3.5">
              {articleDropdownOptions?.map((option) => {
                return (
                  <Tooltip key={option.label} content={option.tooltip}>
                    <button
                      onClick={() => option.actionHandler()}
                      className="shadow-sm border border-neutral-400 bg-slate-500 transition-all hover:font-bold p-[5px] rounded-md hover:bg-blue-500 hover:border-blue-300 text-slate-100"
                    >
                      {option.icon}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div className="flex items-start gap-x-1 mt-2">
            {/* star */}
            <span className="text-xl font-semibold text-gray-800">
              {article?.title}
            </span>
          </div>
          <div className="py-3 px-0.5 space-x-1 space-y-1.5">
            {article?.tags?.map((tag) => {
              return (
                <BadgeLabel
                  className="bg-badge_primary rounded-lg"
                  label={tag?.name}
                />
              );
            })}
          </div>
          <div className="flex justify-between px-2.5 mt-4">
            {article?.isVerified ? (
              <div className="flex gap-1.5 items-center text-xs font-inter font-semibold">
                <IoCheckmarkCircle className="w-6 h-6 text-emerald-500" />
                <div className="flex-col">
                  <span className="text-slate-500 flex items-center ">
                    {" "}
                    Zweryfikował{" "}
                  </span>

                  <span className="text-slate-700 ">
                    {article?.verifiedBy?.name +
                      " " +
                      article?.verifiedBy.surname}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-slate-700 text-xs font-inter font-semibold flex items-center gap-1.5 ">
                <BsFillQuestionCircleFill className="w-5 h-5 text-slate-600" />{" "}
                Niezweryfikowany
              </span>
            )}
            <button
              onClick={() => copyToClipboard(articleRef, callbackFn)}
              className={`flex items-center gap-1 font-semibold text-sm w-28  justify-center py-2 rounded-md transition-all 
    ${
      clipBoardCopyMessage === "Skopiowano!"
        ? "bg-teal-600/90 text-white "
        : "bg-blue-500/90 text-sky-50 hover:bg-blue-600"
    }`}
            >
              {clipBoardCopyMessage === "Skopiowano!" ? (
                <div className="flex items-center gap-1">
                  <IoCheckmarkSharp className="w-4 h-4 text-green-100" />
                  {clipBoardCopyMessage}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <BiSolidCopy className="w-4 h-4" />
                  Kopiuj
                </div>
              )}
            </button>
          </div>
        </div>

        <Accordion
          type="multiple"
          collapsible
          defaultValue={["false"]}
          className="rounded-xl   px-8 py-1 "
        >
          <AccordionItem value="item-1" className="border-0 ">
            <AccordionTrigger className="text-lg px-2.5 py-3 bg-blue-50 rounded-lg border border-blue-100 ">
              Uwagi
            </AccordionTrigger>
            <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-10 text-sm text-gray-900  ">
              <div
                dangerouslySetInnerHTML={{
                  __html: article?.employeeDescription,
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="multiple"
          collapsible
          defaultValue={["item-1"]}
          className="rounded-xl    px-8 py-1 "
        >
          <AccordionItem value="item-1" className="border-0 ">
            <AccordionTrigger className="text-lg px-2.5 py-3 bg-blue-50 rounded-lg border border-blue-100">
              Odpowiedź dla klienta
            </AccordionTrigger>
            <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base min-h-[560px] text-sm text-gray-900 ">
              <div
                ref={articleRef}
                dangerouslySetInnerHTML={{ __html: article?.clientDescription }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* RIGHT SIDE */}
    </div>
  );
};

export default QuickArticleDetails;
