import React, { useState } from "react";
import { Button } from "./ui/button";
import { BasicSearchBar } from "./BasicSearchBar";
import { IoFilter } from "react-icons/io5";
import ArticleCard from "./ArticleCard";
import { IoIosSearch } from "react-icons/io";
import QuickViewSection from "./QuickViewSection";
import useArticleFilters from "@/hooks/useArticleFilters";
import { useModalContext } from "@/contexts/ModalContext";
import { SearchBar } from "./SearchBar";
import { Link } from "react-router-dom";
import { HiMiniXMark } from "react-icons/hi2";
import useScrollToTop from "@/hooks/useScrollToTop";
import Pagination from "./Pagination";

const ArticlesGridView: React.FC = ({
  articles,
  isArticlesLoading,
  selectedView,
  isLoading,
  toggleAsFavourite,
}) => {
  const { getActiveFiltersCount, changePageHandler, page } =
    useArticleFilters();
  useScrollToTop(page);
  const activeFiltersCount = getActiveFiltersCount();
  const { openContentModal } = useModalContext();
  const [selectedArticle, setSelectedArticle] = useState("");
  const handleCloseQuickView = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="grid grid-row  xl:grid-cols-[13fr_16fr] gap-4  h-fit px-3  max-w-[1740px] mx-auto  ">
      <div className="flex flex-col gap-1.5 px-2  ">
        <div className="flex justify-end px-3 ">
          <Button
            variant="outline"
            className={`${
              activeFiltersCount > 0
                ? "bg-blue-500 text-neutral-50"
                : "hover:bg-blue-100 rounded-lg text-slate-600 flex items-center gap-x-1.5"
            } `}
            onClick={() =>
              openContentModal({
                size: "md",
                title: "Filtry",
                content: (
                  <div className="px-2 ">
                    <SearchBar immediate={false} />
                  </div>
                ),
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

        <BasicSearchBar
          className="flex items-center w-full justify-between"
          visibleFields={{ title: true, tags: false, author: false }}
        />

        {isArticlesLoading ? (
          <div className="py-6 flex flex-col gap-[3px] relative  h-full">
            <Spinner
              color="border-orange-600"
              className="absolute top-[43%] left-1/2  "
            />
          </div>
        ) : (
          <div className="py-6 flex flex-col gap-[3px]">
            {articles?.data.length > 0 ? (
              articles?.data?.map((article) => {
                return (
                  <div>
                    <Link
                      to={`/articles/${article?._id}`}
                      className={`min-w-[100%] mx-auto  cursor-pointer block xl:hidden `}
                    >
                      <ArticleCard
                        viewType={selectedView}
                        isLoading={isLoading}
                        toggleArticleAsFavouriteHandler={toggleAsFavourite}
                        article={article}
                        isSelected={selectedArticle === article._id}
                      />
                    </Link>
                    <div
                      onClick={() => setSelectedArticle(article._id)}
                      className={`min-w-[100%] mx-auto  cursor-pointer hidden xl:block `}
                    >
                      <ArticleCard
                        viewType={selectedView}
                        isLoading={isLoading}
                        toggleArticleAsFavouriteHandler={toggleAsFavourite}
                        article={article}
                        isSelected={selectedArticle === article._id}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="mx-auto flex items-center gap-2 text-gray-500 text-lg mt-36  ">
                <IoIosSearch className="w-8 h-8 text-slate-500" />
                <span className="text-md  text-slate-500/90 font-semibold">
                  Nie znaleziono pasujących artykułów ...
                </span>
              </div>
            )}
            {articles && (
              <Pagination
                onPageChange={changePageHandler}
                currentPage={parseInt(articles?.pagination?.page)} // Używaj page z paginacji
                totalPageCount={parseInt(articles?.pagination?.pages)} // Używaj pages z paginacji
              />
            )}
          </div>
        )}
      </div>

      <div className="py-3.5 hidden xl:block">
        {
          <QuickViewSection
            onClose={handleCloseQuickView}
            articleId={selectedArticle}
          />
        }
      </div>
    </div>
  );
};

export default ArticlesGridView;
