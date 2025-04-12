import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertTriangleIcon,
    BadgeCheckIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClipboardIcon,
    ClockIcon,
    EyeIcon,
    FileImageIcon,
    FileTextIcon,
    PaperclipIcon,
    TagIcon,
    UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { FaEdit, FaHistory, FaRegStar, FaStar } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";

import { useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { IoCheckmarkSharp } from "react-icons/io5";

import { DUMMY_ATTACHMENTS } from "../../../../constants/attachments";
import { IMAGES } from "../../../../constants/images";
import { BANNER_IMAGES } from "../../../../constants/productBanners";
import useCopyToClipboard from "../../../../hooks/useCopyToClipboard";
import { articleApi } from "../../../../lib/article.api";
import { Alert } from "../../../alert/Alert";
import { useAlert } from "../../../alert/hooks/useAlert";
import ArticleHistory from "../../../ArticleHistory";
import { useModal } from "../../../modal/hooks/useModal";
import { Modal } from "../../../modal/Modal";
import { Button } from "../../../ui/button";
import EditArticle from "../../Edit/EditArticle";
import ArticleCommentsDetails from "./ArticleCommentsDetails";

export const ArticleModalDetails = ({ articleId }: { articleId: string }) => {
    const { copyToClipboard } = useCopyToClipboard();
    const queryClient = useQueryClient();

    const articleReff = useRef(null);
    const articlePathRef = useRef(null);
    const [clipBoardCopyMessage, setClipBoardCopyMessage] = useState<string>("Kopiuj");
    const [clipBoardCopiedId, setClipBoardCopiedId] = useState(false);
    const { openModal, closeModal, isOpen } = useModal();
    const {
        openModal: openEditArticleModal,
        isOpen: isEditArticleModalOpen,
        closeModal: closeEditArticleModal,
    } = useModal();
    const { openModal: openCommentsModal, isOpen: isCommentsModalOpen, closeModal: closeCommentsModal } = useModal();

    const { isOpen: isVerifyAlertOpen, openAlert: openVerifyAlert, closeAlert: closeVerifyAlert } = useAlert();
    const { isOpen: isUnverifyAlertOpen, openAlert: openUnverifyAlrty, closeAlert: closeUnverifyAlert } = useAlert();
    const { isOpen: isDeleteAlertOpen, openAlert: openDeleteAlert, closeAlert: closeDeleteAlert } = useAlert();

    const { data: article } = useQuery({
        queryKey: ["article", articleId],
        queryFn: () => articleApi.getArticle({ id: articleId }),
    });

    const callbackFn = () => {
        setClipBoardCopyMessage("Skopiowano!");
        setTimeout(() => {
            setClipBoardCopyMessage("");
        }, 1000);
    };

    const handleCopyId = () => {
        setClipBoardCopiedId(true);
        setTimeout(() => {
            setClipBoardCopiedId(false);
        }, 1000);
    };

    const { mutate, isPending: isVerifyPending } = useMutation({
        mutationFn: ({ id, isVerified }) => articleApi.verifyArticle({ id, isVerified }),
        onSuccess: () => {
            queryClient.invalidateQueries(["article", articleId]);
            closeVerifyAlert();
            closeUnverifyAlert();
            const verifyMessage = isVerified
                ? "Cofnięto weryfikację artykułu"
                : "Artykuł został zweryfikowany pomyślnie";
            toast.success(verifyMessage);
        },
    });

    const { mutate: markAsFavouriteHandler } = useMutation({
        mutationFn: ({ id }) => articleApi.markArticleAsFavourite({ id }),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["article", articleId]);

            toast.success(data?.message);
        },
    });

    const { mutate: deleteArticleMutation } = useMutation({
        mutationFn: ({ id }) => articleApi.trashArticle({ id }),
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
    const deleteArticleHandler = () => {
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
    const editArticleHandler = () => {
        openEditArticleModal();
    };

    const openCommentsHandler = () => {
        openCommentsModal();
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
            actionHandler: () => editArticleHandler(),
        },
        ...(article?.isVerified
            ? [
                  {
                      label: "Cofnij weryfikację",
                      icon: <TiArrowBack />,
                      actionHandler: () => unverifyArticleHandler(),
                  },
              ]
            : [
                  {
                      label: "Zweryfikuj",
                      icon: <IoMdCheckmarkCircleOutline />,
                      actionHandler: () => verifyArticleHandler(),
                  },
              ]),
        {
            label: "Usuń",
            icon: <MdDelete />,
            actionHandler: () => deleteArticleHandler(),
        },
    ];

    const {
        title,
        createdAt,
        updatedAt,
        product,
        isVerified,
        viewsCounter,
        tags = [],
        createdBy,
        clientDescription,
        employeeDescription,
        verifiedBy,
    } = article || {};

    const bannerURL = (article?.product?.banner && BANNER_IMAGES[article.product.banner]) || IMAGES.findArticleImage;

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full px-6">
                <div className="flex gap-2 justify-between mb-1.5 p-2 rounded-md">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={openModal}>
                        <FaHistory />
                        Historia zmian
                    </Button>

                    <div className="flex mx-12 space-x-2">
                        {actionOptions.map((option, idx) => (
                            <Button
                                key={idx}
                                onClick={option.actionHandler}
                                className="p-2 h-fit bg-primary/70 hover:bg-primary/85 gap-1.5 text-secondary"
                                variant="outline"
                            >
                                {option.icon}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Nagłówek */}
                <ScrollArea className="col-span-2 pr-4 h-fit">
                    <div>
                        {/* Banner z produktem */}
                        {product?.banner && (
                            <div
                                className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm border"
                                style={{ backgroundImage: `url(${bannerURL})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-2 left-4 py-2 space-y-2">
                                    <span className="text-foreground p-2 text-lg font-semibold drop-shadow">
                                        {product.name}
                                    </span>
                                    {isVerified ? (
                                        <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Zweryfikowany
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
                                            <AlertTriangleIcon className="w-4 h-4" />
                                            Wymaga weryfikacji
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-start my-4">
                            <div className="py-4 w-full">
                                <h1 className="text-xl font-bold tracking-tight px-2 text-primary-foreground">
                                    {title}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <Separator />

                    {/* MAIN GRID - 2 COLUMNS */}
                    <div className="grid grid-cols-1 md:grid-cols-[13fr_6fr] gap-6 h-full my-4">
                        <div>
                            {/* LEFT COLUMN */}
                            <Card className="bg-background min-h-[580px]">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-xl">Odpowiedź dla klienta</CardTitle>
                                    {/* COPY BUTTON */}

                                    <Button
                                        onClick={() => copyToClipboard(articleReff, callbackFn)}
                                        variant="ghost"
                                        size="sm"
                                        className="w-fit mr-2 hover:bg-muted/10 "
                                        aria-label="Kopiuj odpowiedź"
                                    >
                                        {clipBoardCopyMessage === "Skopiowano!" ? (
                                            <div className="flex items-center gap-1">
                                                <IoCheckmarkSharp className="w-4 h-4 text-green-500" />
                                                {clipBoardCopyMessage}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <FiCopy className="w-4 h-4 text-primary" />
                                                Kopiuj
                                            </div>
                                        )}
                                    </Button>
                                </CardHeader>

                                <CardContent>
                                    <div
                                        ref={articleReff}
                                        className="article-details-in-modal text-primary-foreground "
                                        dangerouslySetInnerHTML={{
                                            __html: clientDescription || "",
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col gap-4">
                            {/*COMMENTS BUTTON */}
                            <Button
                                onClick={openCommentsHandler}
                                variant="outline"
                                size="sm"
                                className="p-2 h-fit bg-primary/70 hover:bg-primary/85 gap-1.5"
                                aria-label="Pokaż uwagi"
                            >
                                💬 Pokaż uwagi
                            </Button>

                            {/* Meta info */}

                            <Card className="text-foreground bg-background">
                                <CardHeader>
                                    <CardTitle>Meta</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>Utworzono: {new Date(createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>Ostatnia edycja: {new Date(updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <EyeIcon className="w-4 h-4" />
                                        <span>Wyświetlenia: {viewsCounter}</span>
                                    </div>

                                    {article?.isFavourite && (
                                        <div className="flex items-center gap-2">
                                            <FaStar className="w-4 h-4 text-yellow-500" />
                                            <span>Dodany do ulubionych</span>
                                        </div>
                                    )}

                                    {/* ARTICLE ID SECTION */}
                                    {article?._id && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center">
                                                <span className=" text-sm">ID</span>
                                            </div>
                                            <span ref={articlePathRef} className="hidden" id="full-url">
                                                {`http://localhost:3000/articles/${article?._id}`}
                                            </span>
                                            <span className="text-muted-foreground">{article._id}</span>

                                            {/* COPY ICON */}
                                            {!clipBoardCopiedId ? (
                                                <ClipboardIcon
                                                    onClick={() => copyToClipboard(articlePathRef, handleCopyId)}
                                                    className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary"
                                                />
                                            ) : (
                                                <span>
                                                    <CheckCircleIcon className="w-4 h-4  text-green-500" />
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* TAGS */}
                            <Card className="bg-background">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                                        <TagIcon className="w-4 h-4" />
                                        Tagi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag._id}
                                            variant="secondary"
                                            className="bg-secondary-foreground text-primary-foreground"
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Status */}
                            <Card className="bg-background">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                                        <BadgeCheckIcon className="w-4 h-4" />
                                        Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {isVerified && verifiedBy ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                                <span className="flex items-center gap-2.5">
                                                    <span className="text-sm text-green-500"> Zweryfikowany</span>{" "}
                                                    <span className="text-xs">
                                                        przez: {verifiedBy.name} {verifiedBy.surname}
                                                    </span>
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />
                                                <span className="text-sm text-yellow-600/90">Wymaga weryfikacji</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-background">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                                        <UserIcon className="w-4 h-4" />
                                        Autor
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {createdBy?.name + " " + createdBy?.surname || "Nieznany autor"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-background">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                                        <PaperclipIcon className="w-4 h-4" />
                                        Załączniki
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {DUMMY_ATTACHMENTS && DUMMY_ATTACHMENTS.length > 0 ? (
                                        <ul className="space-y-2">
                                            {DUMMY_ATTACHMENTS.map((file, index) => {
                                                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                                                const extension = file.extension.toLowerCase();

                                                const FileIcon =
                                                    extension === ".pdf"
                                                        ? FileTextIcon
                                                        : extension === ".jpg" || extension === ".png"
                                                          ? FileImageIcon
                                                          : PaperclipIcon;

                                                return (
                                                    <li
                                                        key={index}
                                                        className="flex items-center justify-between p-2 border rounded-md hover:bg-muted transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <FileIcon className="w-5 h-5 text-muted-foreground" />
                                                            <div className="text-sm">
                                                                <div className="font-medium text-foreground">
                                                                    {file.name}
                                                                    <span className="text-muted-foreground">
                                                                        {file.extension}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {fileSizeMB} MB
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary text-sm "
                                                        >
                                                            Pobierz
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">Brak załączników</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </ScrollArea>

                <Modal isOpen={isOpen} onClose={closeModal}>
                    <ArticleHistory articleId={article?._id} showBackwardArrow={false} onBackward={closeModal} />
                </Modal>
                <Modal isOpen={isEditArticleModalOpen} onClose={closeEditArticleModal} closeOnOutsideClick={false}>
                    <EditArticle articleId={articleId} />
                </Modal>
                <Modal
                    width="sm"
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
        </TooltipProvider>
    );
};

export default ArticleModalDetails;
