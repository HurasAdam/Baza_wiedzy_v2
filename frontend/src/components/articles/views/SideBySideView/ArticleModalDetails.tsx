import ArticleHistory from "@/components/ArticleHistory";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IMAGES } from "@/constants/images";
import { BANNER_IMAGES } from "@/constants/productBanners";
import { toast } from "@/hooks/use-toast";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { articlesApi } from "@/lib/articlesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { BiSolidCopy } from "react-icons/bi";
import { FaEdit, FaHistory } from "react-icons/fa";
import { FaCheck, FaRegStar, FaStar } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";
import { Alert } from "../../../alert/Alert";
import { useAlert } from "../../../alert/hooks/useAlert";
import { Modal } from "../../../modal/Modal";
import { useModal } from "../../../modal/hooks/useModal";
import EditArticle from "../../Edit/EditArticle";

const ArticleModalDetails = ({ articleId }: { articleId: string }) => {
    const { openModal: openArticleHistoryModal, isOpen, closeModal } = useModal();
    const {
        openModal: openEditArticleModal,
        isOpen: isEditArticleModalOpen,
        closeModal: closeEditArticleModal,
    } = useModal();
    const { isOpen: isVerifyAlertOpen, openAlert: openVerifyAlert, closeAlert: closeVerifyAlert } = useAlert();
    const { isOpen: isUnverifyAlertOpen, openAlert: openUnverifyAlrty, closeAlert: closeUnverifyAlert } = useAlert();
    const { isOpen: isDeleteAlertOpen, openAlert: openDeleteAlert, closeAlert: closeDeleteAlert } = useAlert();
    const { data: article, isLoading } = useQuery({
        queryKey: ["article", articleId],
        queryFn: () => articlesApi.getArticle({ id: articleId }),
    });
    const { copyToClipboard } = useCopyToClipboard();
    const queryClient = useQueryClient();
    const articleReff = useRef(null);
    const articlePathRef = useRef(null);
    const [clipBoardCopyMessage, setClipBoardCopyMessage] = useState<string>("Kopiuj");
    const [clipBoardCopiedId, setClipBoardCopiedId] = useState(false);
    const callbackFn = () => {
        setClipBoardCopyMessage("Skopiowano!");
        setTimeout(() => {
            setClipBoardCopyMessage("");
        }, 760);
    };

    const handleCopyId = () => {
        setClipBoardCopiedId(true);
        setTimeout(() => {
            setClipBoardCopiedId(false);
        }, 1000);
    };

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
            closeVerifyAlert();
            closeUnverifyAlert();
        },
    });

    const { mutate: markAsFavouriteHandler } = useMutation({
        mutationFn: ({ id }) => {
            return articlesApi.markArticleAsFavourite({ id });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["article", articleId]);
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
            queryClient.invalidateQueries(["article", articleId]);

            toast({
                title: "Sukces",
                description: data?.message,
                variant: "success",
                duration: 3550,
            });

            closeDeleteAlert();
            closeModal();
        },
    });

    const verifyArticleHandler = () => {
        openVerifyAlert();
    };
    const unverifyArticleHandler = () => {
        openUnverifyAlrty();
    };
    const deleteArticleHandler = ({ id }) => {
        // deleteArticleMutation({ id: id || articleId });
        openDeleteAlert();
    };

    const onVerifyConfirm = ({ isVerified }) => {
        mutate({ id: articleId, isVerified });
    };
    const onUnverifyConfirm = ({ isVerified }) => {
        mutate({ id: articleId, isVerified });
    };
    const onDeleteConfirm = () => {
        deleteArticleMutation({ id: articleId });
    };
    const editArticleHandler = (article) => {
        openEditArticleModal();
    };

    const actionOptions = [
        {
            label: `${article?.isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}`,
            icon: article?.isFavourite ? <FaStar /> : <FaRegStar />,
            actionHandler: () => markAsFavouriteHandler({ id: articleId }),
        },
        {
            label: "Edytuj",
            icon: <FaEdit />,
            actionHandler: () => editArticleHandler(article),
        },

        ...(article?.isVerified
            ? [
                  {
                      label: "Cofnij weryfikację",

                      actionHandler: () => {
                          unverifyArticleHandler();
                      },
                      icon: <TiArrowBack />,
                  },
              ]
            : [
                  {
                      label: "Zweryfikuj",

                      actionHandler: () => {
                          verifyArticleHandler();
                      },

                      icon: <IoMdCheckmarkCircleOutline />,
                  },
              ]),

        {
            label: "Usuń",
            icon: <MdDelete />,
            actionHandler: () => {
                deleteArticleHandler({ id: articleId });
            },
        },
    ];

    if (!articleId) {
        return (
            <div className="p-6 flex items-center justify-center text-gray-500 h-[calc(100vh-60px)] scrollbar-custom">
                Wybierz artykuł, aby zobaczyć szczegóły.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 h-[calc(100vh-60px)]">
                <svg
                    className="animate-spin h-10 w-10 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <p className="text-lg font-medium text-gray-700">Ładowanie danych...</p>
            </div>
        );
    }

    const bannerURL = (article?.product?.banner && BANNER_IMAGES[article.product.banner]) || IMAGES.findArticleImage;

    return (
        <div className="rounded-xl shadow-xl w-full mx-auto 0     ">
            {/* Baner z tytułem artykułu */}
            <div className="z-40 sticky top-0 bg-card rounded-t flex justify-between  border-b border-muted">
                <div className="flex gap-2 justify-end sticky  py-1.5 ml-4">
                    <button
                        onClick={openArticleHistoryModal}
                        className=" text-foreground hover:bg-muted  justify-center flex items-center rounded-lg gap-1.5 border px-3.5 text-xs"
                    >
                        <FaHistory /> Historia zmian
                    </button>
                </div>
                <div className="flex gap-2 justify-end sticky  py-1.5 mr-14 ">
                    {actionOptions?.map((option) => {
                        return (
                            <button
                                onClick={() => option.actionHandler({ id: article?._id })}
                                className=" text-foreground hover:bg-muted w-9 h-9  justify-center flex items-center rounded-lg "
                            >
                                {option?.icon}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="relative " style={{ backgroundImage: `url(${bannerURL})` }}>
                <div className="flex justify-between py-5 pt-10 px-9">
                    <span
                        className="w-fit h-fit py-1.5 px-2 text-sm text-white border rounded bg-blue-500"
                        style={{ backgroundColor: `${article?.product?.labelColor}` }}
                    >
                        {" "}
                        {article?.product?.name}
                    </span>
                    <div className="  bg-white bg-opacity-70 rounded-full px-3 py-1 shadow">
                        <span className="text-sm text-gray-800">👁️ {article?.viewsCounter} Wyświetleń</span>
                    </div>
                </div>
                <h1 className="text-2xl py-5 px-12 font-bold shadow-2xl text-slate-200 bg-gray-800/50 backdrop-blur">
                    {article?.title}
                </h1>
            </div>

            {/* Nagłówek z dodatkowymi informacjami */}
            <div className="py-5 px-[60px]">
                <header className="mb-8">
                    {/* Tagi przeniesione nad autora */}
                    <div className="flex flex-wrap mb-2 space-x-2 justify-between">
                        <div className="mb-2 ">
                            {article?.tags?.map((tag) => (
                                <span
                                    key={tag._id}
                                    className="text-sm text-gray-700 bg-gray-200 rounded-full px-3 py-1 cursor-pointer hover:bg-gray-300 transition"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                        {/* <div className="flex gap-2">
                            {actionOptions?.map((option) => {
                                return (
                                    <button
                                        onClick={() => option.actionHandler({ id: article?._id })}
                                        className="p-1 text-foreground"
                                    >
                                        {option?.icon}
                                    </button>
                                );
                            })}
                        </div> */}
                    </div>

                    {/* Autor i data publikacji */}

                    <div className="flex items-center space-x-4 text-muted-foreground mt-4">
                        <span className="text-sm flex items-center">
                            {article?.isVerified ? (
                                <>
                                    <span className="mr-1">✅</span>
                                    <span>
                                        Zweryfikowany przez {article?.verifiedBy?.name} {article?.verifiedBy?.surname}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="mr-1">❓</span>
                                    <span>Wymaga weryfikacji</span>
                                </>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                        <span className="text-neural-600 font-semibold  text-sm px-3 py-0.5 bg-muted rounded-lg ">
                            ID artykułu
                            <span ref={articlePathRef} className="hidden" id="full-url">
                                {`http://localhost:3000/articles/${article?._id}`}
                            </span>
                        </span>

                        <TooltipProvider delayDuration={490}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {!clipBoardCopiedId ? (
                                        <span>
                                            <BiSolidCopy
                                                onClick={() => copyToClipboard(articlePathRef, handleCopyId)}
                                                className=" text-slate-500 w-6 h-6 hover:text-blue-400 transition-all cursor-pointer duration-100"
                                            />
                                        </span>
                                    ) : (
                                        <span>
                                            {" "}
                                            <FaCheck className="w-6 h-6 text-green-700" />
                                        </span>
                                    )}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Kopiuj ID</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </header>

                {/* Treść artykułu */}
                <div className="space-y-8">
                    <section>
                        <Accordion
                            type="single"
                            collapsible
                            defaultValue={["item-1"]}
                            className="rounded-xl  bg-transparent  group  "
                        >
                            <AccordionItem value="item-1" className=" ">
                                <AccordionTrigger className="text-base mb-2  font-semibold hover:bg-secondary hover:no-underline rounded-lg  ">
                                    <h2 className="text-2xl font-semibold text-foreground mb-2.5">💬 Uwagi </h2>
                                </AccordionTrigger>
                                <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-6 text-base border-0  text-muted-foreground  px-4   ">
                                    <div
                                        className="articleDetails-quickView"
                                        dangerouslySetInnerHTML={{
                                            __html: article?.employeeDescription,
                                        }}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-2.5">📝 Odpowiedź dla klienta</h2>
                        <div className="flex justify-end mr-10">
                            <button
                                onClick={() => copyToClipboard(articleReff, callbackFn)}
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
                        <div
                            ref={articleReff}
                            className="text-md text-muted-foreground prose min-w-full break-words break-all whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: article?.clientDescription }}
                        />
                    </section>

                    <section className=" px-3 py-2 rounded-lg bg-background mt-6">
                        <h2 className="text-lg font-semibold text-foreground">Autor</h2>
                        <p className="text-md  text-foreground">
                            {article?.createdBy?.name} {article?.createdBy?.surname}
                        </p>
                        {article?.createdAt && (
                            <p className="text-sm  text-foreground">
                                Dodano: {new Date(article.createdAt).toLocaleDateString()}
                            </p>
                        )}
                    </section>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} closeOnOutsideClick={false}>
                <ArticleHistory articleId={article?._id} showBackwardArrow={false} onBackward={closeModal} />
            </Modal>
            <Modal isOpen={isEditArticleModalOpen} onClose={closeEditArticleModal} closeOnOutsideClick={false}>
                <EditArticle type={"view"} article={article} />
            </Modal>
            <Alert
                isOpen={isVerifyAlertOpen}
                onConfirm={() => onVerifyConfirm({ isVerified: true })}
                onCancel={closeVerifyAlert}
            >
                <div>
                    Czy jesteś pewien że chcesz ustawić status tego artukułu jako{" "}
                    <span className="text-green-500">Zweryfikowany</span>?
                </div>
            </Alert>
            <Alert
                isOpen={isUnverifyAlertOpen}
                onConfirm={() => onUnverifyConfirm({ isVerified: false })}
                onCancel={closeUnverifyAlert}
            >
                <div className="leading-relaxed">
                    <span> Czy jesteś pewien że chcesz cofnąć weryfikację tego artykułu, ustawiając status jako </span>
                    <span className="text-rose-600 font-semibold">Do weryfikacji</span> ?
                </div>
            </Alert>
            <Alert isOpen={isDeleteAlertOpen} onConfirm={() => onDeleteConfirm()} onCancel={closeDeleteAlert}>
                <div className="leading-relaxed">
                    <span> Czy jesteś pewien że chcesz przenieść ten artykuł do kosza ? </span>
                </div>
            </Alert>
        </div>
    );
};

export default ArticleModalDetails;
