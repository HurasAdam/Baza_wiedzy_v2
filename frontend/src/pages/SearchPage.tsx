import { articlesApi } from "@/lib/articlesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { TbTable } from "react-icons/tb";
import { BiCard } from "react-icons/bi";
import useArticleFilters from "@/hooks/useArticleFilters";
import { toast } from "@/hooks/use-toast";
import { SiPowerpages } from "react-icons/si";
import { useModalContext } from "@/contexts/ModalContext";
import useArticleViewType from "@/hooks/useArticleViewType";
import { SideDrawer } from "@/components/core/SideDrawer";
import { useDebounce } from "@/hooks/useDebounce";
import ArticlesGridView from "@/components/ArticlesGridView";
import ArticlesTableView from "@/components/ArticlesTableView";
import ArticlesViewLayout from "@/layouts/ArticlesViewLayout";

const SearchPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState("grid");
  const [selectedArticle, setSelectedArticle] = useState("");
  const queryClient = useQueryClient();

  const {
    title,
    tags,
    author,
    setFilters,
    page,
    verified,
    limit,
    getActiveFiltersCount,
  } = useArticleFilters();
  const { openContentModal } = useModalContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const activeFiltersCount = getActiveFiltersCount();

  const [viewType, updateViewType] = useArticleViewType("articleView", "table");

  const { debouncedValue } = useDebounce({ value: title, delay: 250 });

  const queryParams = {
    page,
    title: debouncedValue,
    tags,
    author,
    verified,
    limit: 20,
  };

  const { data: articles, isLoading: isArticlesLoading } = useQuery({
    queryKey: ["articles", queryParams],
    queryFn: () => {
      return articlesApi.getAllArticles(queryParams);
    },
  });

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const viewOptions = [
    { label: "grid", onClick: () => updateViewType("grid"), icon: BiCard },
    { label: "table", onClick: () => updateViewType("table"), icon: TbTable },
  ];

  return (
    <div className=" rounded-lg  min-h-[90vh]">
      <div className="grid grid-row  xl:grid-cols-[13fr_16fr] gap-5  px-4 py-2 relative max-w-[1700px] mx-auto   ">
        <div className="font-semibold font-title flex items-center gap-x-1.5 text-xl text-sky-950">
          <SiPowerpages />
          Baza artykułów
        </div>
        <div className="flex     justify-end ">
          <div className="flex bg-white rounded-lg h-fit ">
            {viewOptions.map((item) => {
              const isSelected = item.label === viewType;
              return (
                <div
                  onClick={item.onClick}
                  className={
                    isSelected
                      ? "bg-blue-200/50 rounded-lg px-3 cursor-pointer flex items-center "
                      : "px-3 py-2.5 rounded-lg  flex items-center cursor-pointer"
                  }
                >
                  <item.icon className="w-4 h-4" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ArticlesViewLayout viewType={viewType} articles={articles} isLoading={isArticlesLoading} />

      <SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default SearchPage;
