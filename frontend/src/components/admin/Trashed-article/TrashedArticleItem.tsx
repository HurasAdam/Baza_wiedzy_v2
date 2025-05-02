import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { articleApi } from "@/lib/article.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2, CornerUpLeft } from "lucide-react";
import TrashedArticleDetailsContainer from "./TrashedArticleDetailsContainer";
import { IArticle } from "@/types";
import { Alert } from "@/components/alert/Alert";
import { useAlert } from "@/components/alert/hooks/useAlert";

export const TrashedArticleItem = ({ article, className }: { article: IArticle; className?: string }) => {
    const queryClient = useQueryClient();
    const { openModal, isOpen, closeModal } = useModal();
    const {
        isOpen: isRestoreArticleAlertOpen,
        openAlert: openRestoreArticleAlert,
        closeAlert: closeRestoreArticleAlert,
    } = useAlert();

    const {
        isOpen: isRemoveArticleAlertOpen,
        openAlert: openRemoveArticleAlert,
        closeAlert: closeRemoveArticleAlert,
    } = useAlert();

    const { mutate: restoreArtcileMutation } = useMutation({
        mutationFn: (id: string) => articleApi.restoreArticle({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries(["trashed-articles"]);
            toast.success("Artykuł został przywrócony z kosza");
            closeRestoreArticleAlert();
        },
    });

    const { mutate: removeArticleMutation } = useMutation({
        mutationFn: (id: string) => articleApi.deleteArticle({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries(["trashed-articles"]);
            toast.success("Artykuł został usunięty");
            closeRemoveArticleAlert();
        },
    });

    const handleRestore = (e: React.MouseEvent) => {
        e.stopPropagation();
        restoreArtcileMutation(article._id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeArticleMutation(article._id);
    };

    const openRestoreAlert = (e) => {
        e.stopPropagation();
        openRestoreArticleAlert();
    };

    const openRemoveAlert = (e) => {
        e.stopPropagation();
        openRemoveArticleAlert();
    };

    const onRemoveConfirm = (id) => {
        removeArticleMutation(id);
    };

    const onRestoreConfirm = (id) => {
        restoreArtcileMutation(id);
    };

    return (
        <div className={`   ${className}`}>
            <Card
                onClick={openModal}
                className="bg-card/60 border border-border rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer p-5 space-y-3 relative"
            >
                <CardHeader className="p-0">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-2">{article.title}</h3>
                        <div className="absolute top-8 right-4 flex space-x-2  group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => openRestoreAlert(e)}
                                className="p-2 bg-card/80 rounded-lg shadow hover:shadow-md transition-colors group  hover:bg-muted/50"
                                aria-label="Przywróć z kosza"
                            >
                                <CornerUpLeft className="h-4 w-4 text-primary group-hover:text-emerald-400" />
                            </button>
                            <button
                                onClick={(e) => openRemoveAlert(e)}
                                className="p-2 bg-card/80 rounded-lg shadow hover:shadow-md transition-colors group  hover:bg-muted/50"
                                aria-label="Usuń na stałe"
                            >
                                <Trash2 className="h-4 w-4 text-destructive group-hover:text-rose-600" />
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 flex justify-between items-center">
                    {/* Left metadata */}
                    <div className="text-sm text-muted-foreground">
                        {article.product?.name && (
                            <span>
                                Produkt: <span className="font-medium text-foreground">{article.product.name}</span>
                            </span>
                        )}
                    </div>
                </CardContent>

                {/* Action overlay on hover */}
            </Card>

            <Modal isOpen={isOpen} onClose={closeModal}>
                <TrashedArticleDetailsContainer productId={article?._id} />
            </Modal>
            <Alert
                onConfirm={() => onRemoveConfirm(article?._id)}
                requireConfirmation={true}
                isOpen={isRemoveArticleAlertOpen}
                onCancel={closeRemoveArticleAlert}
            >
                <div>Czy jesteś pewien że chcesz trwale usunąć ten artykuł?</div>
            </Alert>

            <Alert
                onConfirm={() => onRestoreConfirm(article?._id)}
                requireConfirmation={true}
                isOpen={isRestoreArticleAlertOpen}
                onCancel={closeRestoreArticleAlert}
            >
                <div>Czy jesteś pewien że chcesz przywrócić ten artykuł?</div>
            </Alert>
        </div>
    );
};
