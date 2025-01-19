import { IMAGES } from "@/constants/images";
import BadgeLabel from "./core/BadgeLabel";
import { Accordion, AccordionContent, AccordionTrigger } from "./ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Button } from "./ui/button";
import { IoCheckmarkSharp, IoEyeSharp } from "react-icons/io5";
import { formatDate } from "@/lib/utils";
import { FaCheck } from "react-icons/fa6";
import { FaBookmark, FaStar } from "react-icons/fa";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { PiCalendarPlusFill } from "react-icons/pi";
import { AiFillProduct } from "react-icons/ai";

import { BiSolidCalendarEdit, BiSolidCopy } from "react-icons/bi";
import useMarkArticleAsFavourite from "@/hooks/useMarkArticleAsFavourite";
import { useRef, useState } from "react";
import { BANNER_IMAGES } from "@/constants/productBanners";
import { useNavigate } from "react-router-dom";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { EArticleVariant } from "@/enums/ArticleCardVariant";

interface ArticleDetailsCardProps {
  article: {}; // Zdefiniuj odpowiedni typ dla `article`
  actionOptions: []; // Typ dla `actionOptions`
  showBackwardArrow?: boolean;
  variant?: EArticleVariant; // Wariant jako typ z enum
}

const ArticleDetailsCard: React.FC<ArticleDetailsCardProps> = ({
  article,
  actionOptions,
  showBackwardArrow = false,
  variant = EArticleVariant.FULLSCREEN,
}) => {
  const articleReff = useRef(null);
  const articlePathRef = useRef(null);
  const { mutate: markAsFavouriteHandler, isLoading } =
    useMarkArticleAsFavourite();
  const navigate = useNavigate();
  const { copyToClipboard } = useCopyToClipboard();
  const [clipBoardCopiedId, setClipBoardCopiedId] = useState(false);
  const [clipBoardCopyMessage, setClipBoardCopyMessage] =
    useState<string>("Kopiuj");

  const callbackFn = () => {
    setClipBoardCopyMessage("Skopiowano!");
    setTimeout(() => {
      setClipBoardCopyMessage(""); // Resetowanie wiadomości po pewnym czasie
    }, 760);
  };

  const handleCopyId = () => {
    setClipBoardCopiedId(true);
    setTimeout(() => {
      setClipBoardCopiedId(false); // Resetowanie wiadomości po pewnym czasie
    }, 1000); // Zmieniono czas na 1 sekundę (np. 1000 ms)
  };

  return (
    <div className="min-h-screen  px-6 pb-6 flex flex-col ">
      {/* Top Bar */}
      <div className="flex  items-center mb-1 px-6 ">
        {showBackwardArrow && (
          <div
            onClick={() => navigate(-1)}
            className="cursor-pointer border px-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-500/90"
          >
            {" "}
            <IoIosArrowRoundBack className="w-7 h-7" />
          </div>
        )}
        {/* <span className="text-slate-700 font-title">Wróć</span> */}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ">
        {/* Quiz Details Section */}
        <div className="md:col-span-2   rounded-lg px-6 ">
          <div
            className="  py-4 flex flex-col  bg-cover bg-center  rounded-md"
            style={{
              backgroundImage: `url(${
                BANNER_IMAGES[article?.product?.banner] || BANNER_IMAGES.circle
                // BANNER_IMAGES?.abstract4
              })`,
            }}
          >

            <div className="flex justify-between px-6 ">
              {article?.isFavourite ? (
                <div
                  className="flex justify-center  h-fit group cursor-pointer "
                  onClick={() => markAsFavouriteHandler({ id: article?._id })}
                >
                  <TooltipProvider delayDuration={490}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {" "}
                          <FaStar className="w-6 h-6 text-amber-500/85 group-hover:text-amber-400/90 transition-all duration-75" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Usuń z ulubionych</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <div
                  className="flex justify-center  h-fit group cursor-pointer "
                  onClick={() => markAsFavouriteHandler({ id: article?._id })}
                >
                  <TooltipProvider delayDuration={490}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {" "}
                          <FaStar className="w-6 h-6 text-slate-300/70 group-hover:text-blue-200 transition-all" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Dodaj do ulubionych</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <div className=" gap-1.5 justify-end  my-3.5 flex xl:hidden ">
                <TooltipProvider delayDuration={490}>
                  {actionOptions.map((option, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() =>
                            option.actionHandler({ id: article?._id })
                          }
                          className="flex items-center justify-center shadow-sm border border-neutral-400 bg-slate-500 transition-all hover:font-bold p-2 rounded-md hover:bg-blue-500 hover:border-blue-300 text-slate-100"
                        >
                          {option.icon}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{option.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
              <span className="px-4 py-1.5 bg-blue-600 rounded-md text-neutral-50 font-semibold shadow hidden xl:block">
                {article?.product?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <div className="w-24 h-24 mb-4 shadow-2xl mx-6  ">
                <img
                  src={
                    article?.isVerified
                      ? IMAGES.approvedImage
                      : IMAGES.unverifiedImage
                  }
                  alt="Thumbnail"
                  className={`rounded-lg object-cover ${
                    article?.isVerified ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
              </div>
              <div className=" mx-5 py-5 min-h-full flex items-end xl:hidden">
                <span className="px-4 py-1.5 bg-blue-600 rounded-md text-neutral-50 font-semibold shadow">
                  {article?.product?.name}
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold  py-4 px-6 shadow-2xl text-slate-200 bg-gray-800/50 backdrop-blur-lg overflow-hidden text-ellipsis whitespace-normal break-words">
              {article?.title}
            </h1>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {article?.tags?.map((tag) => {
                return (
                  // <span className="bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-lg">
                  //   {tag?.name}
                  // </span>
                  <BadgeLabel
                    className="bg-blue-400 rounded-lg"
                    label={tag?.name}
                  />
                );
              })}
            </div>

            <div className="text-gray-500 text-sm mb-6 flex items-center justify-between">
              {article?.isVerified ? (
                <span>
                  <span className="font-bold">Zweryfikowany przez:</span>{" "}
                  {article?.verifiedBy?.name} {article?.verifiedBy?.surname}
                </span>
              ) : (
                <span className="font-bold">Wymaga weryfikacji</span>
              )}
              <button
                onClick={() => copyToClipboard(articleReff, callbackFn)}
                className={`flex items-center gap-1 font-semibold text-sm w-28  justify-center py-2 rounded-md transition-all 
                  ${
                    clipBoardCopyMessage === "Skopiowano!"
                      ? "bg-teal-600/90 text-white "
                      : "bg-blue-500/90 text-sky-50 hover:bg-blue-600"
                  }`}
              >
                {clipBoardCopyMessage === "Skopiowano!" ? (
                  <div className="flex items-center gap-1">
                    <IoCheckmarkSharp className="w-4 h-4 text-green-100" />
                    {clipBoardCopyMessage}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <BiSolidCopy className="w-4 h-4" />
                    Kopiuj
                  </div>
                )}
              </button>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-100 ">
              <Accordion
                type="single"
                collapsible
                defaultValue={["item-1"]}
                className="rounded-xl  bg-transparent  group  "
              >
                <AccordionItem value="item-1" className=" ">
                  <AccordionTrigger className="text-base mb-2 font-semibold  px-4 hover:bg-blue-200  ">
                    Uwagi:
                  </AccordionTrigger>
                  <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-6 text-base border-0   px-4   ">
                    <div
                      className="articleDetails-quickView"
                      dangerouslySetInnerHTML={{
                        __html: article?.employeeDescription,
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="text-gray-700 leading-relaxed mt-6 ">
              <Accordion
                type="multiple"
                collapsible
                defaultValue={["item-1"]}
                className="rounded-xl   "
              >
                <AccordionItem value="item-1" className="border-0 ">
                  <AccordionTrigger className="text-base  bg-slate-200 px-8 rounded">
                    Odpowiedź dla klienta
                  </AccordionTrigger>

                  <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base min-h-fit px-1.5 py-1 ">
                    <div
                      className="prose max-w-none"
                      ref={articleReff}
                      dangerouslySetInnerHTML={{
                        __html: article?.clientDescription,
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}

        <div
          className={`sticky  h-fit ${
            variant === EArticleVariant.FULLSCREEN ? "top-16" : "top-0"
          }`}
        >
          <div className="rounded-lg p-6 border shadow h-fit ">
            <div className=" gap-1.5 justify-end  my-3.5 hidden xl:flex ">
              <TooltipProvider delayDuration={490}>
                {actionOptions.map((option, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() =>
                          option.actionHandler({ id: article?._id })
                        }
                        className="flex items-center justify-center shadow-sm border border-neutral-400 bg-slate-500 transition-all hover:font-bold p-2 rounded-md hover:bg-blue-500 hover:border-blue-300 text-slate-100"
                      >
                        {option.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{option.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <FaBookmark className="text-slate-600 w-4 h-4" />
              ID artykułu
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neural-600 font-semibold  px-3 py-0.5 bg-gray-200 rounded-lg ">
                  {article?._id}
                  <span ref={articlePathRef} className="hidden" id="full-url">
                    {`http://localhost:3000/articles/${article?._id}`}
                  </span>
                </span>

                <TooltipProvider delayDuration={490}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {!clipBoardCopiedId ? (
                        <span>
                          <BiSolidCopy
                            onClick={() =>
                              copyToClipboard(articlePathRef, handleCopyId)
                            }
                            className=" text-slate-500 w-6 h-6 hover:text-blue-400 transition-all cursor-pointer duration-100"
                          />
                        </span>
                      ) : (
                        <span>
                          {" "}
                          <FaCheck className="w-6 h-6 text-green-700" />
                        </span>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Kopiuj ID</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-md mb-2 flex items-center gap-2">
                  <AiFillProduct className="text-slate-600 w-5 h-5" />
                  Produkt
                </h3>
                <div className="flex justify-between items-center">
                  <span
                    className="font-semibold"
                    style={{
                      color: article?.product?.labelColor || "slategray", // Slate-700 jako fallback
                    }}
                  >
                    {article?.product?.name}
                  </span>
                  <Button className="font-semibold bg-slate-600">Zobacz</Button>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-md mb-2 flex items-center gap-2">
                  <BsFillPersonPlusFill className="text-slate-600 w-5 h-5" />
                  Autor
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {article?.createdBy?.name} {article?.createdBy?.surname}
                  </span>
                  <Button className="font-semibold bg-slate-600">Zobacz</Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-md mb-2 flex items-center gap-2">
                  <PiCalendarPlusFill className="text-slate-600 w-5 h-5" />
                  Data dodania
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {formatDate(article?.createdAt)}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-md mb-2 flex items-center gap-2">
                  <BiSolidCalendarEdit className="text-slate-600 w-5 h-5" />
                  Ostatnia aktualizacja
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {formatDate(article?.createdAt)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-md mb-2 flex items-center gap-2">
                  <IoEyeSharp className="text-slate-600 w-5 h-5" />
                  Status
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Czy zweryfikowany ?</span>
                  <span
                    className={`text-gray-700  px-5 py-1 rounded-lg ${
                      article?.isVerified
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-400/90 text-rose-800"
                    }`}
                  >
                    {article?.isVerified ? "Tak" : "Nie"}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-md mb-2 flex items-center gap-2">
                  <IoEyeSharp className="text-slate-600 w-5 h-5" />
                  Ilość wyświetleń
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 bg-blue-100 px-5 py-1 rounded-lg">
                    {article?.viewsCounter}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsCard;
