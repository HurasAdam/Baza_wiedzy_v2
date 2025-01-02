import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { IoFilter } from "react-icons/io5";
import { Button } from "./ui/button";
import { HiMiniXMark } from "react-icons/hi2";
import { BasicSearchBar } from "./BasicSearchBar";
import ArticleCard from "./ArticleCard";
import useArticleFilters from "@/hooks/useArticleFilters";
import { useModalContext } from "@/contexts/ModalContext";

const ArticlesTableView: React.FC = ({
  articles,
  selectedView,
  isLoading,
  toggleArticleAsFavouriteHandler,
}) => {
  const { getActiveFiltersCount } = useArticleFilters();
  const { openContentModal } = useModalContext();

  const activeFiltersCount = getActiveFiltersCount();
  const [selectedArticle, setSelectedArticle] = useState("");
  return (
    <div className=" grid grid-cols-1 xl:grid-cols-[13fr_5fr]  2xl:grid-cols-[13fr_4fr] gap-3.5 px-2.5 py-6 max-w-[1740px] mx-auto  ">
      <div className="flex justify-end px-3  xl:hidden ">
        <Button
          variant="outline"
          className={`${
            activeFiltersCount > 0
              ? "bg-blue-500 text-neutral-50"
              : "hover:bg-blue-100 rounded-lg text-slate-600 flex items-center gap-x-1.5"
          } `}
          onClick={() =>
            openContentModal({
              size: "sm",
              title: "Filtry",
              content: (
                <div className="px-2 ">
                  <SearchBar immediate={false} />
                </div>
              ),
              size: "md",
            })
          }
        >
          <IoFilter className="w-4 h-4" />
          {activeFiltersCount > 0
            ? `+ ${activeFiltersCount} więcej filtrów`
            : "więcej filtrów"}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" className="hover:bg-transparent">
            <HiMiniXMark className="w-5 h-5" />
          </Button>
        )}
      </div>
      <div className="xl:hidden">
        <BasicSearchBar
          className="flex items-center w-full justify-between"
          visibleFields={{ title: true, tags: false, author: false }}
        />
      </div>

      <div className="py-5 px-5 rounded-xl   space-y-1.5">
        {/* <DataTable
data={articles?.data}
/> */}

        {articles?.data?.map((article) => {
          return (
            <div
              onClick={() => setSelectedArticle(article._id)}
              className={`min-w-[100%] mx-auto  cursor-pointer   `}
            >
              <ArticleCard
                onClick={() => alert("XD")}
                isLoading={isLoading}
                toggleArticleAsFavouriteHandler={
                  toggleArticleAsFavouriteHandler
                }
                data={article}
                className=""
                isSelected={selectedArticle === article._id}
              />
            </div>
          );
        })}
      </div>

      <div className="shadow border border-neutral-200  px-6 pt-5 pb-9 rounded-lg max-h-fit sticky top-[5px] lg:top-[70px] bg-white min-h-[84vh] hidden xl:block">
        <SearchBar
          visibleFields={{ title: true, tags: true, author: true }}
          immediate={true}
        />
      </div>
    </div>
  );
};

export default ArticlesTableView;
