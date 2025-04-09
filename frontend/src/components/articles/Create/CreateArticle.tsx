import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { FilePlus } from "lucide-react";
import { useState } from "react";
import { IMAGES } from "../../../constants/images";
import { articleApi } from "../../../lib/article.api";
import { productApi } from "../../../lib/product.api";
import { tagApi } from "../../../lib/tag.api";
import ArticleForm from "../../forms/ArticleForm";
import { useModal } from "../../modal/hooks/useModal";
import { Modal } from "../../modal/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import ArticleModalDetails from "../views/SideBySideView/ArticleModalDetails";

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

    console.log("createdArticleId");
    console.log(createdArticleId);
    const { mutate } = useMutation({
        mutationFn: ({ formData }) => {
            return articleApi.createArticle({ formData });
        },
        onSuccess: (data) => {
            setCreatedArticleId(data?.data?._id);
            openCreateArticleModal();
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
                        backgroundImage: `url(${IMAGES.findArticleImage})`,
                        backgroundBlendMode: "overlay",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    }}
                >
                    {/* Dodano tło */}
                    <FilePlus size={36} className="text-white" />
                    <CardTitle className="text-3xl font-semibold text-white">Tworzenie Artykułu</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground/65 border-b text-xs border-dashed border-input/20">
                    Wypełnij formularz, aby dodać nowy artykuł
                </CardContent>
            </Card>
            {tags?.tags ? (
                <ArticleForm onSave={onSave} tags={formatedTags} products={formatedProducts} />
            ) : (
                <p>Loading tags...</p>
            )}
            <Modal isOpen={isCreateArticleModalOpen} onClose={onCloseModals}>
                <ArticleModalDetails articleId={createdArticleId} />
            </Modal>
        </div>
    );
};

export default CreateArticle;
