import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { IoFilter } from "react-icons/io5";
import { Button } from "./ui/button";
import { HiMiniXMark } from "react-icons/hi2";
import { BasicSearchBar } from "./BasicSearchBar";
import ArticleCard from "./ArticleCard";
import useArticleFilters from "@/hooks/useArticleFilters";
import { useModalContext } from "@/contexts/ModalContext";
import ArticleCardRe from "./ArticleCardRe";
import ArticleDetailsInModal from "@/pages/ArticleDetailsInModal";
import useMarkArticleAsFavourite from "@/hooks/useMarkArticleAsFavourite";
import Pagination from "./Pagination";
import useScrollToTop from "@/hooks/useScrollToTop";
import { Skeleton } from "./ui/skeleton";
import Spinner from "./core/Spinner";

const ArticlesTableView: React.FC = ({
  articles,
  selectedView,
  isLoading,
  toggleAsFavourite,
}) => {
  const { getActiveFiltersCount, changePageHandler, page } =
    useArticleFilters();
  const { openContentModal } = useModalContext();

  const activeFiltersCount = getActiveFiltersCount();
  const [selectedArticle, setSelectedArticle] = useState("");
  useScrollToTop(page);
  const { mutate: markAsFavuriteHandler } = useMarkArticleAsFavourite();

  const openInModalHandler = (article, isSelected) => {
    openContentModal({
      description: "",
      content: <ArticleDetailsInModal type="modal" articleId={article._id} />,
      enableOutsideClickClose: true,
      size: "xl",
    });
  };


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
      <div className="py-5 px-5 rounded-xl  min-w-[100%] space-y-1.5">
        {/* <DataTable
data={articles?.data}
/> */}

        {
        
        isLoading ? ([1,2,3,4,5].map((item)=>{
          return (
            <div className="relative flex border border-gray-200 rounded-lg shadow overflow-hidden mb-4 hover:shadow-md transition-shadow duration-300">
            {/* Gwiazdka w prawym górnym rogu */}
            <Spinner animation="spin" position="center" color="bg-blue-500" />
            <Skeleton
              animation="none"
              className="absolute top-2 right-2 w-10 h-10 rounded-full"
            />
            <div className="min-w-36 max-w-36 min-h-36 max-h-36 flex items-center justify-center px-2.5 pt-3 pb-1 text-center flex-col">
              <Skeleton animation="none" className="w-[86%] h-[86%] rounded-xl shadow-lg" />
              <Skeleton animation="none" className="w-16 h-4 mt-2" />
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
   
            </div>
          </div>
          )
        })
   
        ):
        articles?.data?.map((article) => {
          return (
            <div
              onClick={() => setSelectedArticle(article._id)}
              className={` mx-auto  cursor-pointer   `}
            >
      
              <ArticleCardRe
                markAsFavourite={markAsFavuriteHandler}
                onClick={openInModalHandler}
                article={article}
              />
            </div>
          );
        })}
        {articles && (
          <Pagination
            onPageChange={changePageHandler}
            currentPage={parseInt(articles?.pagination?.page)} // Używaj page z paginacji
            totalPageCount={parseInt(articles?.pagination?.pages)} // Używaj pages z paginacji
          />
        )}
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
