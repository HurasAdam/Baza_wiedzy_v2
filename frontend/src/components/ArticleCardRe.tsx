import { FaRegStar, FaStar } from "react-icons/fa"; // Ikony gwiazdek
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { LuArrowRight } from "react-icons/lu";
import { MdRemoveRedEye } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const ArticleCardRe = ({ article, onClick, markAsFavourite }) => {
  const productColor = article.product?.labelColor || "#cccccc"; // Domyślny kolor, jeśli brak labelColor

  return (
    <div
      onClick={ () => onClick(article) } // Link do szczegółów artykułu w modalu
      className="relative flex border bg-neutral-50 border-slate-100 rounded-lg shadow overflow-hidden mb-4 hover:shadow-md transition-shadow duration-300"
    >
      {/* Gwiazdka w prawym górnym rogu */ }
      <TooltipProvider delayDuration={ 490 }>
        <div
          onClick={ (e) => {
            markAsFavourite({ id: article?._id });
            e.stopPropagation();
          } }
          className="absolute top-2 right-2 cursor-pointer  p-2.5  rounded-full hover:bg-indigo-100 transition-all delay-10"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                { " " }
                { article.isFavourite ? (
                  <FaStar className="text-yellow-500 w-5 h-5" />
                ) : (
                  <FaRegStar className="text-gray-400 w-5 h-5 " />
                ) }
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                { article?.isFavourite
                  ? "Usuń z ulubionych"
                  : "Dodaj do ulubionych" }
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      {/* Badge z produktem */ }
      <div className="min-w-36 max-w-36 min-h-36 max-h-36 flex items-center justify-center px-2.5 pt-3 pb-1 text-center flex-col">
        <div
          className="w-[86%] h-[86%] flex justify-center items-center rounded-xl shadow-lg"
          style={ { backgroundColor: productColor } } // Dynamiczny kolor tła
        >
          <span className="text-sm font-medium text-white">
            { article.product?.name || "No Product Assigned" }
          </span>
        </div>
        <TooltipProvider delayDuration={ 490 }>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1.5">
                <MdRemoveRedEye className="w-4 h-4" />{ " " }
                <span className="font-semibold text-slate-500 text-sm">
                  { article?.viewsCounter }
                </span>
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ilość wyświetleń</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          {/* Tytuł artykułu */ }
          <h3 className="text-lg font-semibold text-slate-800 word-break: break-all xl:pr-14 pr-20">
            { article.title }
          </h3>
          {/* Liczba wyświetleń */ }

          {/* Zweryfikowany status */ }
          <p className="flex items-center text-sm mt-3">
            { article.isVerified ? (
              <IoCheckmarkCircle className="text-green-500 mr-2 w-[18px] h-[18px]" />
            ) : (
              <IoCloseCircle className="text-amber-500 mr-2 w-[18px] h-[18px]" />
            ) }
            <span className="text-xs font-semibold text-neutral-600">
              { " " }
              { article.isVerified ? "Zweryfikowany" : "Wymaga weryfikacji" }
            </span>
          </p>
          {/* Lista tagów */ }
          { article.tags && article.tags.length > 0 && (
            <div className="flex justify-between ">
              <div className="flex flex-wrap mt-3 ">
                { article.tags.map((tag, index) => (
                  <span
                    key={ index }
                    className="bg-slate-200  text-gray-800 text-xs font-medium px-2.5 py-1 rounded-xl mr-2 mb-2"
                  >
                    { tag.name || `Tag ${index + 1}` }
                  </span>
                )) }
              </div>

              <TooltipProvider delayDuration={ 490 }>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      onClick={ (e) => e.stopPropagation() }
                      to={ `/articles/${article?._id}` }
                    >
                      <div className="w-fit">
                        <Button variant="outline" className="rounded-xl">
                          <LuArrowRight className="w-5 h-5 text-slate-600" />
                        </Button>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Przejdź do strony artykułu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default ArticleCardRe;
