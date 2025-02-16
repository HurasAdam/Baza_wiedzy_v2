import { ArticleForm } from "@/components/ArticleForm";
import { useModalContext } from "@/contexts/ModalContext";
import { toast } from "@/hooks/use-toast";
import { articlesApi } from "@/lib/articlesApi";
import { tagsApi } from "@/lib/tagsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleDetails from "./ArticleDetails";
import Spinner from "@/components/core/Spinner";
import ArticleDetailsInModal from "./ArticleDetailsInModal";
import { MdEditDocument } from "react-icons/md";
import { productsApi } from "@/lib/productsApi";

const EditArticle = ({ article, type }) => {
  console.log(type);
  console.log("type");
  const { id } = useParams();
  const { closeContentModal, openContentModal, openModal } = useModalContext();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: () => {
      return tagsApi.getAllTags();
    },
  });

  const { data: products = [] } = useQuery({
    queryFn: () => {
      return productsApi.getAllProducts();
    },
    queryKey: ["products"],
  });

  const onSuccesEffectHandler = (type) => {
    if (type === "view") {
      return closeContentModal();
    } else {
      openContentModal({
        title: "Szczegóły artykułu",
        description: "Zobacz szczegóły artykułu.",
        content: <ArticleDetailsInModal articleId={article?._id} />, // Zmiana na ArticleDetails

        size: "xl",
      });
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, formData }) => {
      return articlesApi.updateArticle({ id, formData });
    },
    onSuccess: ({ message }) => {
      onSuccesEffectHandler(type);
      queryClient.invalidateQueries(["article", id]);

      toast({
        title: "Sukces",
        description: message,
        variant: "success",
        duration: 4000,
      });
    },
  });

  const quickViewArticleHandler = ({ id, formData }) => {
    mutate({ id, formData });
  };

  const onSave = ({ id, formData }) => {
    openModal(
      `${
        article
          ? "Czy na pewno chcesz opuścić edycję?"
          : "Czy na pewno chcesz kreator dodawania?"
      }`,
      "Wprowadzone zmiany nie zostały zapisane. Czy na pewno chcesz opuścić ten widok?",
      () => quickViewArticleHandler({ id, formData })
    );
  };

  const formatedTags = data?.tags?.map((tag) => {
    return { label: tag.name, value: tag._id };
  });

  if (!formatedTags) {
    return <div>a</div>;
  }
  return (
    <div>
      {isPending && <Spinner />} {/* Wyświetl spinnera, gdy jest loading */}
      <div className="flex flex-col gap-8">
        <div className="mx-9 text-xl text-slate-700 flex items-center gap-1 ">
          <MdEditDocument className="w-7 h-7" />
          <span>Edytu Artykuł</span>
        </div>
        <ArticleForm
        type={type}
          tags={formatedTags}
          onSave={onSave}
          article={article}
          products={products}
        />
      </div>
    </div>
  );
};

export default EditArticle;
