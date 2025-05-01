import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { FilePlus, Loader } from "lucide-react";
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
import ArticleModalDetails from "../views/feedView/ArticleModalDetails";

export type ComponentPaddings = "px-16 py-4" | "px-20 py-6" | "px-24 py-8" | "px-12";

interface Props {
    onClose: () => void;
    isOpen: boolean;
    modalWidth: string;
}

const CreateArticle = ({ onClose, isOpen, modalWidth }: Props) => {
    const {
        openModal: openCreateArticleModal,
        isOpen: isCreateArticleModalOpen,
        closeModal: closeCreateArticleModal,
    } = useModal();

    const [createdArticleId, setCreatedArticleId] = useState();
    const { data: tags = [], isLoading: isTagsLoading } = useQuery({
        queryKey: ["tags"],
        queryFn: () => {
            return tagApi.findAll();
        },
    });
    const { data: products = [], isLoading: isProductsLoading } = useQuery({
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
        mutationFn: ({ formData }) => {
            return articleApi.createArticle({ formData });
        },
        onSuccess: (data) => {
            setCreatedArticleId(data?.data?._id);
            openCreateArticleModal();
        },
        onError: () => {
            toast.error("Wystąpił nieoczekiwany błąd podczas próby dodania artykułu.");
        },
    });

    const onCloseModals = () => {
        onClose();
        closeCreateArticleModal();
    };

    const onSave = ({ formData }) => {
        return mutate({ formData });
    };
    const getModalPadding = (): ComponentPaddings => {
        switch (modalWidth) {
            case "sm":
                return "px-16 py-4";
            case "md":
                return "px-20 py-6";
            case "lg":
                return "px-24 py-0";
            default:
                return "px-12";
        }
    };
    const isDataLoading = isTagsLoading || isProductsLoading;
    return (
        <div>
            <Card className={`border-none shadow-lg bg-background rounded-none `}>
                <CardHeader
                    className="flex items-center gap-4 p-6 bg-cover bg-center rounded-t-lg"
                    style={{
                        backgroundImage: `url(${IMAGES.findArticleImage})`,
                        backgroundBlendMode: "overlay",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    }}
                >
                    {/* Dodano tło */}
                    <FilePlus size={36} className="text-white" />
                    <CardTitle className="text-3xl font-semibold text-white">Tworzenie Artykułu</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground/65 border-b py-1 text-xs border-dashed border-input/20">
                    Wypełnij formularz, aby dodać nowy artykuł
                </CardContent>
            </Card>
            {isPending && (
                <div className="absolute inset-0 bg-background/40 backdrop-blur- flex items-center justify-center z-50">
                    <Loader className="animate-spin w-8 h-8 text-primary" />
                </div>
            )}

            {isDataLoading ? (
                // Spinner wyświetlający się, gdy dane jeszcze się ładują
                <div className="absolute inset-0 bg-background/40 backdrop-blur- flex items-center justify-center z-50">
                    <Loader className="animate-spin w-8 h-8 text-primary" />
                </div>
            ) : (
                // Formularz wyświetlający się po załadowaniu danych
                <ArticleForm
                    className={clsx(getModalPadding())}
                    onSave={onSave}
                    tags={formatedTags}
                    products={formatedProducts}
                    isLoading={isPending}
                />
            )}
            <Modal isOpen={isCreateArticleModalOpen} onClose={onCloseModals}>
                <ArticleModalDetails articleId={createdArticleId} />
            </Modal>
        </div>
    );
};

export default CreateArticle;
