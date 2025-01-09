import DetailsContainer from "@/components/DetailsContainer";
import ReviewCard from "@/components/ReviewCard";
import { IMAGES } from "@/constants/images";
import { REVIEWS } from "@/constants/reviews";
import useArticleFilters from "@/hooks/useArticleFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { articlesApi } from "@/lib/articlesApi";
import { useQuery } from "@tanstack/react-query";
import { FaBoxArchive } from "react-icons/fa6";
import { useState } from "react";
import { FaComments } from "react-icons/fa";
import { IoClose, IoFilter } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModalContext } from "@/contexts/ModalContext";
import { SearchBar } from "@/components/SearchBar";
import { HiMiniXMark } from "react-icons/hi2";
import { BasicSearchBar } from "@/components/BasicSearchBar";

const TrashedArticlesPage = () => {
  const [selectedArticle, setSelectedArticle] = useState("");
  const { openContentModal } = useModalContext();
  console.log(selectedArticle);
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

  const { debouncedValue } = useDebounce({ value: title, delay: 250 });
  const queryParams = {
    page,
    title: debouncedValue,
    tags,
    author,
    verified,
    limit,
  };
  const activeFiltersCount = getActiveFiltersCount();
  const { data: articles } = useQuery({
    queryKey: ["articles", queryParams],
    queryFn: () => {
      return articlesApi.getAllTrashedArticles(queryParams);
    },
  });

  const handleSelectArticle = ({ id }) => {
    setSelectedArticle(id);
  };

  const handleCloseSelectedArticle = () => {
    setSelectedArticle("");
  };

  return (
    <div className="rounded-lg w-full h-[93vh] grid grid-cols-[2fr_3fr] ">
      {/* Lewa część */}
      <div className="rounded-lg w-full flex flex-col overflow-y-auto h-full scrollbar-custom px-4 py-1.5">
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-x-1.5">
            <FaBoxArchive className="h-6 w-6" />
            Artykuły usunięte
          </h2>

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
        </div>
        <div className="flex flex-col gap-2 ">
          <BasicSearchBar
            className="flex items-center w-full justify-between"
            visibleFields={{ title: true, tags: false, author: false }}
          />
          {articles?.data?.map((article) => {
            return (
              <div
                onClick={() => handleSelectArticle({ id: article?._id })}
                key={article.id}
              >
                <ReviewCard
                  article={article}
                  selectedArticle={selectedArticle}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Prawa część */}
      {selectedArticle ? (
        <div className="h-[97vh] overflow-y-auto ">
          <DetailsContainer
            onClose={handleCloseSelectedArticle}
            id={selectedArticle}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center shadow-xl  bg-slate-100 p-10 rounded-lg  transition duration-300 ease-in-out transform ">
          <div className="text-center">
            {/* Placeholder image */}
            <img
              src={IMAGES.notFoundImage} // Tutaj wskazujemy na odpowiedni obrazek
              alt="Brak artykułu"
              className="mx-auto mb-6 h-36 w-36 object-contain opacity-40"
            />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              Wybierz artykuł, aby zobaczyć szczegóły
            </h3>
            <p className="text-gray-500">
              Kliknij na artykuł po lewej stronie, aby wyświetlić szczegóły.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrashedArticlesPage;
