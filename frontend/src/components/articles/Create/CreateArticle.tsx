import { useMutation, useQuery } from "@tanstack/react-query";
import { FilePlus } from "lucide-react";

import { useState } from "react";
import { articleApi } from "../../../lib/article.api";
import { productApi } from "../../../lib/product.api";
import { tagApi } from "../../../lib/tag.api";
import ArticleForm from "../../forms/ArticleForm";
import { useModal } from "../../modal/hooks/useModal";
import { Modal } from "../../modal/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import ArticleModalDetails from "../views/SideBySideView/ArticleModalDetails";
const CreateArticle = ({ onClose, isOpen }) => {
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

    return (
        <div className="px-20">
            <Card className=" mx-10 border-none ">
                <CardHeader className="flex flex-row items-center gap-3 ">
                    <FilePlus size={32} className=" text-primary" />
                    <CardTitle className="text-2xl font-semibold text-foreground/85">Tworzenie Artykułu</CardTitle>
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
