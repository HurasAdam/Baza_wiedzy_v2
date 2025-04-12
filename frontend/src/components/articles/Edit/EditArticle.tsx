import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilePlus, Loader } from "lucide-react";

import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import { IMAGES } from "../../../constants/images";
import { articleApi } from "../../../lib/article.api";
import { productApi } from "../../../lib/product.api";
import { tagApi } from "../../../lib/tag.api";
import ArticleForm from "../../forms/ArticleForm";
import { useModal } from "../../modal/hooks/useModal";
import { Modal } from "../../modal/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ComponentPaddings } from "../Create/CreateArticle";
import ArticleModalDetails from "../views/feedView/ArticleModalDetails";
const EditArticle = ({ articleId, onClose, isOpen, modalWidth }) => {
    const queryClient = useQueryClient();
    const {
        openModal: openCreateArticleModal,
        isOpen: isCreateArticleModalOpen,
        closeModal: closeCreateArticleModal,
    } = useModal();

    const { data: article } = useQuery({
        queryKey: ["article", articleId],
        queryFn: () => {
            return articleApi.getArticle({ id: articleId });
        },
    });

    const [createdArticleId, setCreatedArticleId] = useState();
    const { data: tags = [] } = useQuery({
        queryKey: ["tags"],
        queryFn: () => {
            return tagApi.findAll();
        },
    });
    const { data: products = [] } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return productApi.find();
        },
    });

    const formatedTags = tags?.tags?.map((tag) => {
        return { label: tag.name, value: tag._id };
    });

    const formatedProducts = products?.map((product) => {
        return { label: product.name, value: product._id };
    });

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, formData }) => {
            return articleApi.updateArticle({ id, formData });
        },
        onSuccess: (data) => {
            setCreatedArticleId(data?.data?._id);
            // openCreateArticleModal();
            onClose();
            queryClient.invalidateQueries("article", article?._id);
            toast.success("Artykuł został pomyślnie zaktualizowany");
        },
        onError: (error) => {
            let errorMessage = "Wystąpił nieoczekiwany problem podczas próby aktualizacji artykułu.";
            console.log(error, "ERROR!");
            if (error?.status === 400) {
                errorMessage =
                    "Błąd w danych formularza. Proszę sprawdzić, czy wszystkie pola są poprawnie wypełnione.";
            } else if (error?.status === 404) {
                errorMessage = "Nie znaleziono artykułu do edycji. Proszę spróbować ponownie później.";
            } else if (error?.status === 500) {
                errorMessage = "Wystąpił problem z serwerem. Proszę spróbować później.";
            }

            toast.error(
                <div>
                    <strong>Aktualizacja artykułu nie powiodła się!</strong>
                    <br />
                    <span>{errorMessage}</span>
                    <br />
                </div>
            );
        },
    });

    const onCloseModals = () => {
        onClose();
        closeCreateArticleModal();
    };

    const onSave = ({ formData }) => {
        return mutate({ id: article?._id, formData });
    };

    const getModalPadding = (): ComponentPaddings => {
        switch (modalWidth) {
            case "sm":
                return "px-16 py-4";
            case "md":
                return "px-20 py-6";
            case "lg":
                return "px-24 py-8";
            default:
                return "px-12";
        }
    };

    return (
        <div className={clsx(getModalPadding())}>
            <Card className="border-none shadow-lg bg-background/55 rounded-lg">
                <CardHeader
                    className="flex items-center gap-4 p-6 bg-cover bg-center rounded-t-lg"
                    style={{
                        backgroundImage: `url(${IMAGES.editArticleImage})`,
                        backgroundBlendMode: "overlay",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    }}
                >
                    {/* Dodano tło */}
                    <FilePlus size={36} className="text-white" />
                    <CardTitle className="text-3xl font-semibold text-white">Edytuj artykuł</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground/65 border-b text-xs border-dashed border-input/20">
                    Wypełnij formularz, aby dodać nowy artykuł
                </CardContent>
            </Card>

            {isPending && (
                <div className="absolute inset-0 bg-background/40 backdrop-blur- flex items-center justify-center z-50">
                    <Loader className="animate-spin w-8 h-8 text-primary" />
                </div>
            )}

            {tags?.tags ? (
                <ArticleForm
                    onSave={onSave}
                    tags={formatedTags}
                    products={formatedProducts}
                    article={article}
                    isLoading={isPending}
                />
            ) : (
                <p>Loading tags...</p>
            )}
            <Modal isOpen={isCreateArticleModalOpen} onClose={onCloseModals}>
                <ArticleModalDetails articleId={createdArticleId} />
            </Modal>
        </div>
    );
};

export default EditArticle;
