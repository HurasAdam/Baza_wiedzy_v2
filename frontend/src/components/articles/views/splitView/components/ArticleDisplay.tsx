import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangleIcon, CheckCircleIcon, Clock, EyeIcon, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";
import { IMAGES } from "../../../../../constants/images";
import { BANNER_IMAGES } from "../../../../../constants/productBanners";
import { articleApi } from "../../../../../lib/article.api";
import { Alert } from "../../../../alert/Alert";
import { useAlert } from "../../../../alert/hooks/useAlert";
import ArticleHistory from "../../../../ArticleHistory";
import { useModal } from "../../../../modal/hooks/useModal";
import { Modal } from "../../../../modal/Modal";
import { Button } from "../../../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../ui/dropdown-menu";
import { Popover, PopoverTrigger } from "../../../../ui/popover";
import { Separator } from "../../../../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../ui/tooltip";
import EditArticle from "../../../Edit/EditArticle";
import ArticleCommentsDetails from "../../feedView/ArticleCommentsDetails";
import { Mail } from "../data";
import { ArticleDetailsX } from "./ArticleDetailsX";
import ArticleExtraInfo from "./ArticleExtraInfo";

interface MailDisplayProps {
    mail: Mail | null;
    selectedArticle: string | null;
}

export function ArticleDisplay({ mail, selectedArticle }: MailDisplayProps) {
    const [clipBoardCopyMessage, setClipBoardCopyMessage] = useState<string>("Kopiuj");
    const [clipBoardCopiedId, setClipBoardCopiedId] = useState(false);
    const queryClient = useQueryClient();

    const { openModal: openHistoryModal, closeModal: closeHistoryModal, isOpen: isHistoryModalOpen } = useModal();
    const {
        openModal: openEditArticleModal,
        isOpen: isEditArticleModalOpen,
        closeModal: closeEditArticleModal,
    } = useModal();
    const { openModal: openCommentsModal, isOpen: isCommentsModalOpen, closeModal: closeCommentsModal } = useModal();
    const { openModal: openInfoModal, isOpen: isInfoModalOpen, closeModal: closeInfoModal } = useModal();

    const { isOpen: isVerifyAlertOpen, openAlert: openVerifyAlert, closeAlert: closeVerifyAlert } = useAlert();
    const { isOpen: isUnverifyAlertOpen, openAlert: openUnverifyAlrty, closeAlert: closeUnverifyAlert } = useAlert();
    const { isOpen: isDeleteAlertOpen, openAlert: openDeleteAlert, closeAlert: closeDeleteAlert } = useAlert();

    const { data: article, isLoading } = useQuery({
        queryKey: ["article", selectedArticle],
        queryFn: () => {
            return articleApi.getArticle({ id: selectedArticle });
        },
        refetchOnWindowFocus: false,
    });

    const { mutate, isPending: isVerifyPending } = useMutation({
        mutationFn: ({ id, isVerified }) => articleApi.verifyArticle({ id, isVerified }),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["article", article?._id]);
            closeVerifyAlert();
            closeUnverifyAlert();

            toast.success(data?.message || "Operacja zakończona sukcesem");
        },
    });

    const { mutate: markAsFavouriteHandler } = useMutation({
        mutationFn: ({ id }) => articleApi.markArticleAsFavourite({ id }),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["article", article?._id]);

            toast.success(data?.message);
        },
    });

    const { mutate: deleteArticleMutation, isPending: isDeletePending } = useMutation({
        mutationFn: ({ id }) => articleApi.trashArticle({ id }),
        onSuccess: () => {
            closeDeleteAlert();
            queryClient.invalidateQueries(["articles"]);
            toast.success("Artykuł został przeniesiony do kosza");
        },
    });

    const verifyArticleHandler = () => {
        openVerifyAlert();
    };
    const unverifyArticleHandler = () => {
        openUnverifyAlrty();
    };
    const deleteArticleHandler = () => {
        openDeleteAlert();
    };

    const onVerifyConfirm = ({ isVerified }) => {
        mutate({ id: article?._id, isVerified });
    };
    const onUnverifyConfirm = ({ isVerified }) => {
        mutate({ id: article?._id, isVerified });
    };
    const onDeleteConfirm = () => {
        deleteArticleMutation({ id: article?._id });
    };
    const editArticleHandler = () => {
        openEditArticleModal();
    };

    const openCommentsHandler = () => {
        openCommentsModal();
    };
    const openHistoryHandler = () => {
        openHistoryModal();
    };
    const openInfoHandler = () => {
        openInfoModal();
    };

    const ToggleFavouriteHandler = ({ id }) => {
        markAsFavouriteHandler({ id });
    };

    const today = new Date();
    const bannerURL = (article?.product?.banner && BANNER_IMAGES[article.product.banner]) || IMAGES.findArticleImage;

    if (isLoading) {
        return (
            <div className="flex h-full flex-col">
                <div className="flex items-center p-2">
                    <div className="flex items-center gap-2"></div>

                    <Separator orientation="vertical" className="mx-2 h-6" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!mail}>
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                            <DropdownMenuItem>Star thread</DropdownMenuItem>
                            <DropdownMenuItem>Add label</DropdownMenuItem>
                            <DropdownMenuItem>Mute thread</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Separator />
                <div className="flex flex-1 flex-col ">
                    <div className="flex-1 px-4 py-6 overflow-y-auto max-h-full ">
                        <div className="flex flex-col items-center justify-center h-full text-center border border-border rounded-2xl shadow-lg p-6">
                            <div className="relative w-16 h-16 mb-6 animate-spin-slow">
                                {/* Obracający się pierścień */}
                                <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary animate-spin-slow" />

                                {/* Static inner glow */}
                                <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner" />

                                {/* Centralna kulka jako core-logo */}
                                <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10 " />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Łoadowanie...</h2>
                            <p className="text-sm text-muted-foreground max-w-md">Trwa ładowanie, danych..</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedArticle) {
        return (
            <div className="flex h-full flex-col">
                <div className="flex items-center p-2">
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => markAsFavouriteHandler({ id: article?._id })}
                                    variant="ghost"
                                    size="icon"
                                >
                                    {article?.isFavourite ? (
                                        <FaStar className="h-4 w-4" />
                                    ) : (
                                        <FaRegStar className="h-4 w-4" />
                                    )}

                                    <span className="sr-only">
                                        {article?.isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                                    </span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {article?.isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                            </TooltipContent>
                        </Tooltip>
                        <Separator orientation="vertical" className="mx-1 h-6" />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={openInfoHandler} variant="ghost" size="icon">
                                    <FaCircleInfo className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="flex flex-col">
                                    <h1 className=""> Więcej szczegółów</h1>
                                    <span className="text-xs">A</span>
                                    <span>B</span>
                                    <span>C</span>
                                </div>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={openCommentsHandler} variant="ghost" size="icon">
                                    {/* <ArchiveX className="h-4 w-4" /> */}
                                    💬
                                    <span className="sr-only">Move to junk</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Uwagi</TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="mx-1 h-6" />
                        <Tooltip>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <TooltipTrigger asChild>
                                        <Button onClick={openHistoryHandler} variant="ghost" size="icon">
                                            <Clock className="h-4 w-4" />
                                            <span className="sr-only">Historia zmian</span>
                                        </Button>
                                    </TooltipTrigger>
                                </PopoverTrigger>
                            </Popover>
                            <TooltipContent>Historia zmian</TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                    <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={editArticleHandler} variant="ghost" size="icon">
                                    <MdModeEdit className="h-4 w-4" />
                                    <span className="sr-only">Forward</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edytuj</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={article?.isVerified ? unverifyArticleHandler : verifyArticleHandler}
                                    variant="ghost"
                                    size="icon"
                                >
                                    {article?.isVerified ? (
                                        <TiArrowBack className="h-4 w-4" />
                                    ) : (
                                        <IoMdCheckmarkCircleOutline className="h-4 w-4" />
                                    )}

                                    <span className="sr-only">
                                        {article?.isVerified ? "Cofnij weryfikację" : "Zweryfikuj"}
                                    </span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{article?.isVerified ? "Cofnij weryfikację" : "Zweryfikuj"}</TooltipContent>
                        </Tooltip>

                 
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={deleteArticleHandler} variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Usuń</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Usuń</TooltipContent>
                        </Tooltip>
                    </div>
               
               
                </div>
                <Separator />
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-col items-start px-6 mt-3.5 mb-3">
                        {/* Banner z tłem oraz overlayem licznika */}
                        <div
                            className="w-full py-6 px-4 rounded-2xl mb-4 relative overflow-hidden shadow-lg"
                            style={{
                                backgroundImage: `url(${bannerURL})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-background opacity-15"></div>

                            {/* Overlay licznika z efektem glassmorphism */}
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-md bg-muted">
                                <EyeIcon className="w-5 h-5 text-primary" />
                                <span className="text-xs font-semibold text-primary">{article?.viewsCounter || 0}</span>
                            </div>

                            {/* Zawartość banneru */}
                            <div className="flex items-center gap-4 p-4">
                                <div className="flex flex-col gap-1">
                                    <div
                                        className={`text-md font-bold text-[var(--foreground)] text-center px-2 py-1 rounded-md w-fit z-40`}
                                    >
                                        {article?.product?.name}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                        {article?.isVerified ? (
                                            <span className="flex items-center gap-1 text-green-400 font-medium">
                                                <CheckCircleIcon className="w-4 h-4" />
                                                Zweryfikowany
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-yellow-400 font-medium">
                                                <AlertTriangleIcon className="w-4 h-4" />
                                                Wymaga weryfikacji
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tytuł artykułu i metadane */}
                        <div className="w-full px-4">
                            <h1 className="text-xl font-bold mb-2 text-foreground">{article?.title}</h1>
                        </div>
                    </div>

                    <Separator />

                    {/* Treść artykułu */}
                    <div className="flex-1 whitespace-pre-wrap px-4 text-base text-[var(--foreground)] overflow-y-auto max-h-[calc(100vh-355px)]">
                        <ArticleDetailsX articleId={article?._id} />
                    </div>
                </div>
                <Modal isOpen={isHistoryModalOpen} onClose={closeHistoryModal}>
                    <ArticleHistory articleId={article?._id} showBackwardArrow={false} onBackward={closeHistoryModal} />
                </Modal>
                <Modal isOpen={isEditArticleModalOpen} onClose={closeEditArticleModal} closeOnOutsideClick={false}>
                    <EditArticle articleId={article?._id} />
                </Modal>
                <Modal
                    width="xs"
                    height="fit"
                    isOpen={isCommentsModalOpen}
                    onClose={closeCommentsModal}
                    closeOnOutsideClick={true}
                >
                    <ArticleCommentsDetails
                        employeeDescription={article?.employeeDescription}
                        onClose={closeCommentsModal}
                    />
                </Modal>
                <Modal
                    height="fit"
                    width="xs"
                    isOpen={isInfoModalOpen}
                    onClose={closeInfoModal}
                    closeOnOutsideClick={true}
                >
                    <ArticleExtraInfo article={article} />
                </Modal>
                <Alert
                    isLoading={isVerifyPending}
                    isOpen={isVerifyAlertOpen}
                    onConfirm={() => onVerifyConfirm({ isVerified: true })}
                    onCancel={closeVerifyAlert}
                >
                    <div>
                        Czy jesteś pewien że chcesz ustawić status tego artykułu jako{" "}
                        <span className="text-green-500">Zweryfikowany</span>?
                    </div>
                </Alert>
                <Alert
                    isLoading={isVerifyPending}
                    requireConfirmation={true}
                    isOpen={isUnverifyAlertOpen}
                    onConfirm={() => onUnverifyConfirm({ isVerified: false })}
                    onCancel={closeUnverifyAlert}
                >
                    <div className="leading-relaxed">
                        <span>
                            Czy jesteś pewien że chcesz cofnąć weryfikację tego artykułu, ustawiając status jako{" "}
                        </span>
                        <span className="text-rose-600 font-semibold">Do weryfikacji</span>?
                    </div>
                </Alert>
                <Alert
                    isLoading={isDeletePending}
                    isOpen={isDeleteAlertOpen}
                    onConfirm={onDeleteConfirm}
                    onCancel={closeDeleteAlert}
                    requireConfirmation={true}
                >
                    <div className="leading-relaxed">
                        <span>Czy jesteś pewien że chcesz przenieść ten artykuł do kosza?</span>
                    </div>
                </Alert>
            </div>
        );
    } else {
        return (
            <div className="flex h-full flex-col">
                <div className="flex items-center p-2">
                    <div className="flex items-center gap-2"></div>

                    <Separator orientation="vertical" className="mx-2 h-6" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!mail}>
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                            <DropdownMenuItem>Star thread</DropdownMenuItem>
                            <DropdownMenuItem>Add label</DropdownMenuItem>
                            <DropdownMenuItem>Mute thread</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Separator />
                <div className="flex flex-1 flex-col ">
                    <div className="flex-1 px-4 py-6 overflow-y-auto max-h-full ">
                        <div className="flex flex-col items-center justify-center h-full text-center border border-border rounded-2xl shadow-lg p-6">
                            <div className="relative w-16 h-16 mb-6">
                                {/* Obracający się pierścień */}
                                <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary" />

                                {/* Static inner glow */}
                                <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner" />

                                {/* Centralna kulka jako core-logo */}
                                <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10" />
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">Wybierz artykuł</h2>
                            <p className="text-sm text-muted-foreground max-w-md">
                                Kliknij na artykuł z listy po lewej stronie, aby zobaczyć jego szczegóły.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
