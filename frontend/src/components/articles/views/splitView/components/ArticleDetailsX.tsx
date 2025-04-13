import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { IoCheckmarkSharp } from "react-icons/io5";
import useCopyToClipboard from "../../../../../hooks/useCopyToClipboard";
import { useAlert } from "../../../../alert/hooks/useAlert";
import { useModal } from "../../../../modal/hooks/useModal";
import { Button } from "../../../../ui/button";

export const ArticleDetailsX = ({ articleId }: { articleId: string }) => {
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

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full px-6">
                {/* Nagłówek */}
                <ScrollArea className="col-span-2 pr-4 h-fit">
                    {/* MAIN GRID - 2 COLUMNS */}
                    <div className="grid grid-cols-1 gap-6 h-full my-[15px]">
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
                    </div>
                </ScrollArea>
            </div>
        </TooltipProvider>
    );
};

export default ArticleDetailsX;
