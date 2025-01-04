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

  // if (isFetching && !isLoading) {
  //   return (
  //     <div className=" px-9 max-w-[96%] mx-auto flex flex-col-reverse  2xl:grid  2xl:grid-cols-[1fr] gap-5 article-details-in-modal ">
  //       {/* UPPER SECTION */}

  //       {/* CONTENT */}
  //       <div className=" flex flex-col  ">
  //         <div className="flex justify-between px-">
  //           <div
  //             className="flex justify-center  h-fit group cursor-pointer "
  //             onClick={() => markAsFavouriteHandler({ id: id || articleId })}
  //           >
  //             {" "}
  //             {article?.isFavourite ? (
  //               <FaStar className="w-5 h-5 text-amber-600/70 group-hover:text-amber-400/90 transition-all duration-75" />
  //             ) : (
  //               <FaStar className="w-5 h-5 text-slate-200 group-hover:text-blue-200 transition-all" />
  //             )}
  //           </div>
  //           <div className="flex gap-2 justify-end  my-3.5">
  //             {articleDropdownOptions?.map((option) => {
  //               return (
  //                 <button
  //                   onClick={() => option.actionHandler()}
  //                   className=" shadow-sm  border border-neutral-400 bg-slate-500   transition-all hover:font-bold p-[5px] rounded-md hover:bg-blue-500 hover:border-blue-300  text-slate-100 "
  //                 >
  //                   {option.icon}
  //                 </button>
  //               );
  //             })}
  //           </div>
  //         </div>

  //         <div className=" ">
  //           <div className="flex justify-between">
  //             <div className="py-2.5 px-0.5 space-x-1 space-y-1.5">
  //               {article?.tags?.map((tag) => {
  //                 return (
  //                   <BadgeLabel
  //                     className="bg-badge_primary rounded-md"
  //                     label={tag?.name}
  //                   />
  //                 );
  //               })}
  //             </div>

  //             <span className="font-semibold flex items-center gap-x-1.5 text-sm text-slate-600">
  //               <FaCalendarCheck className="h-5 w-5 text-slate-500" />
  //               <span className="text-sm">Dodano</span>
  //               {formatDate(article?.createdAt)}
  //             </span>
  //           </div>

  //           <div className=" py-3.5 px-5  flex items-center justify-between    bg-blue-500 text-white  font-serif font-semibold rounded-lg border border-blue-100 ">
  //             <div className="flex gap-2">
  //               <span className="text-2xl font-semibold  font-inter ">
  //                 {article?.title}
  //               </span>

  //               {article?.isVerified ? (
  //                 <span className="font-semibold flex items-center gap-x-6">
  //                   <IoCheckmarkCircle className="h-6 w-6 text-green-400" />{" "}
  //                 </span>
  //               ) : (
  //                 <span className="font-semibold flex items-center gap-x-3">
  //                   <BsFillQuestionCircleFill className="h-6 w-6 text-secondary text-neutral-300" />
  //                 </span>
  //               )}
  //             </div>
  //             {article?.isFavourite && (
  //               <FaStar className="w-5 h-5 text-amber-400/90" />
  //             )}
  //           </div>

  //           <span className="py-3.5 px-5 text-sm text-slate-600 font-semibold flex items-center gap-1.5">
  //             <div className="border rounded-full w-7 h-7 p-2 flex items-center justify-center bg-violet-500 text-white">
  //               AH
  //             </div>
  //             {`${article?.createdBy?.name} ${article?.createdBy?.name}`}

  //             <span className="font-semibold flex items-center">
  //               <MdOutlineUpdate />
  //               {formatDate(article?.updatedAt)}
  //             </span>
  //           </span>
  //         </div>
  //         <div className=" ">
  //           <Accordion
  //             type="multiple"
  //             collapsible
  //             defaultValue={["false"]}
  //             className="rounded-xl  bg-transparent    "
  //           >
  //             <AccordionItem value="item-1" className=" ">
  //               <AccordionTrigger className="text-base  bg-slate-200 px-8 ">
  //                 Uwagi
  //               </AccordionTrigger>
  //               <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base border-0 px-8 py-1   ">
  //                 <div
  //                   dangerouslySetInnerHTML={{
  //                     __html: article?.employeeDescription,
  //                   }}
  //                 />
  //               </AccordionContent>
  //             </AccordionItem>
  //           </Accordion>

  //           <Accordion
  //             type="multiple"
  //             collapsible
  //             defaultValue={["item-1"]}
  //             className="rounded-xl   "
  //           >
  //             <AccordionItem value="item-1" className="border-0 ">
  //               <AccordionTrigger className="text-base  bg-slate-200 px-8 rounded">
  //                 Odpowiedź dla klienta
  //               </AccordionTrigger>
  //               <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base min-h-[560px]  px-8 py-1 ">
  //                 <div
  //                   dangerouslySetInnerHTML={{
  //                     __html: article?.clientDescription,
  //                   }}
  //                 />
  //               </AccordionContent>
  //             </AccordionItem>
  //           </Accordion>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <ArticleDetailsCard
      article={article}
      actionOptions={articleDropdownOptions}
    />
    // <div className=" px-9 max-w-[96%] mx-auto flex flex-col-reverse  2xl:grid  2xl:grid-cols-[1fr] gap-5 article-details-in-modal ">
    //   {/* UPPER SECTION */}

    //   {/* CONTENT */}
    //   <div className=" flex flex-col  ">
    //     <div className="flex justify-between px-">
    //       <div
    //         className="flex justify-center  h-fit group cursor-pointer "
    //         onClick={() => markAsFavouriteHandler({ id: id || articleId })}
    //       >
    //         {" "}
    //         {article?.isFavourite ? (
    //           <FaStar className="w-5 h-5 text-amber-600/70 group-hover:text-amber-400/90 transition-all duration-75" />
    //         ) : (
    //           <FaStar className="w-5 h-5 text-slate-200 group-hover:text-blue-200 transition-all" />
    //         )}
    //       </div>
    //       <div className="flex gap-2 justify-end  my-3.5">
    //         {articleDropdownOptions?.map((option) => {
    //           return (
    //             <button
    //               onClick={() => option.actionHandler()}
    //               className=" shadow-sm  border border-neutral-400 bg-slate-500   transition-all hover:font-bold p-[5px] rounded-md hover:bg-blue-500 hover:border-blue-300  text-slate-100 "
    //             >
    //               {option.icon}
    //             </button>
    //           );
    //         })}
    //       </div>
    //     </div>

    //     <div className=" ">
    //       <div className="flex justify-between">
    //         <div className="py-2.5 px-0.5 space-x-1 space-y-1.5">
    //           {article?.tags?.map((tag) => {
    //             return (
    //               <BadgeLabel
    //                 className="bg-badge_primary rounded-md"
    //                 label={tag?.name}
    //               />
    //             );
    //           })}
    //         </div>

    //         <span className="font-semibold flex items-center gap-x-1.5 text-sm text-slate-600">
    //           <FaCalendarCheck className="h-5 w-5 text-slate-500" />
    //           <span className="text-sm">Dodano</span>
    //           {formatDate(article?.createdAt)}
    //         </span>
    //       </div>

    //       <div className=" py-3.5 px-5  flex items-center justify-between    bg-blue-500 text-white  font-serif font-semibold rounded-lg border border-blue-100 ">
    //         <div className="flex gap-2">
    //           <span className="text-2xl font-semibold  font-inter ">
    //             {article?.title}
    //           </span>

    //           {article?.isVerified ? (
    //             <span className="font-semibold flex items-center gap-x-6">
    //               <IoCheckmarkCircle className="h-6 w-6 text-green-400" />{" "}
    //             </span>
    //           ) : (
    //             <span className="font-semibold flex items-center gap-x-3">
    //               <BsFillQuestionCircleFill className="h-6 w-6 text-secondary text-neutral-300" />
    //             </span>
    //           )}
    //         </div>
    //         {article?.isFavourite && (
    //           <FaStar className="w-5 h-5 text-amber-400/90" />
    //         )}
    //       </div>

    //       <span className="py-3.5 px-5 text-sm text-slate-600 font-semibold flex items-center gap-1.5">
    //         <div className="border rounded-full w-7 h-7 p-2 flex items-center justify-center bg-violet-500 text-white">
    //           AH
    //         </div>
    //         {`${article?.createdBy?.name} ${article?.createdBy?.name}`}

    //         <span className="font-semibold flex items-center">
    //           <MdOutlineUpdate />
    //           {formatDate(article?.updatedAt)}
    //         </span>
    //       </span>
    //     </div>
    //     <div className=" ">
    //       <Accordion
    //         type="multiple"
    //         collapsible
    //         defaultValue={["false"]}
    //         className="rounded-xl  bg-transparent    "
    //       >
    //         <AccordionItem value="item-1" className=" ">
    //           <AccordionTrigger className="text-base  bg-slate-200 px-8 ">
    //             Uwagi
    //           </AccordionTrigger>
    //           <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base border-0 px-8 py-1   ">
    //             <div
    //               dangerouslySetInnerHTML={{
    //                 __html: article?.employeeDescription,
    //               }}
    //             />
    //           </AccordionContent>
    //         </AccordionItem>
    //       </Accordion>

    //       <Accordion
    //         type="multiple"
    //         collapsible
    //         defaultValue={["item-1"]}
    //         className="rounded-xl   "
    //       >
    //         <AccordionItem value="item-1" className="border-0 ">
    //           <AccordionTrigger className="text-base  bg-slate-200 px-8 rounded">
    //             Odpowiedź dla klienta
    //           </AccordionTrigger>
    //           <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base min-h-[560px]  px-8 py-1 ">
    //             <div
    //               dangerouslySetInnerHTML={{
    //                 __html: article?.clientDescription,
    //               }}
    //             />
    //           </AccordionContent>
    //         </AccordionItem>
    //       </Accordion>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ArticleDetailsInModal;
