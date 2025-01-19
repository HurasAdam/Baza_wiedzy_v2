import { ArticleForm } from "@/components/ArticleForm";
import { ToastBox } from "@/components/core/ToastBox";
import { toast } from "@/hooks/use-toast";
import useScrollToTop from "@/hooks/useScrollToTop";
import { articlesApi } from "@/lib/articlesApi";
import { productsApi } from "@/lib/productsApi";
import { tagsApi } from "@/lib/tagsApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";

const CreateArticle = () => {
  const navigate = useNavigate();
  useScrollToTop();
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

  const { mutate } = useMutation({
    mutationFn: ({ formData }) => {
      return articlesApi.createArticle({ formData });
    },
    onSuccess: (data) => {
      navigate("/articles");
      toast({
        title: "Sukces",
        description: data?.message,
        variant: "success",
        duration: 3400,
      });
    },
  });

  const onSave = ({ formData }) => {
    return mutate({ formData });
  };

  const formatedTags = data?.tags?.map((tag) => {
    return { label: tag.name, value: tag._id };
  });

  return (
    <div>
      {formatedTags && (
        <ArticleForm
          onSave={onSave}
          tags={formatedTags}
          products={products}
          className="2xl:w-[1120px]"
        />
      )}
    </div>
  );
};

export default CreateArticle;
