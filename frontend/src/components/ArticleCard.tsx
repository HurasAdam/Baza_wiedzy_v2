import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useModalContext } from "@/contexts/ModalContext";
import ArticleDetailsInModal from "@/pages/ArticleDetailsInModal";
import { FaFolderOpen, FaStar } from "react-icons/fa6";
import { LuArrowRight } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const ArticleCard = ({
    article,
    className,
    toggleArticleAsFavouriteHandler,
    isLoading,
    isSelected,
    viewType,
    onClick,
}) => {
    const navigate = useNavigate();
    const { openContentModal } = useModalContext();
    const articleViewPreference = localStorage.getItem("articleView");

    const quickViewArticleHandler = (article, isSelected) => {
        openContentModal({
            description: "",
            content: <ArticleDetailsInModal type="modal" articleId={article._id} />,
            enableOutsideClickClose: true,
            size: "xl",
        });
    };

    if (viewType === "grid") {
        return (
            <Card
                onClick={onClick}
                className={`${className} ${
                    isSelected
                        ? "bg-indigo-100 shadow-lg relative  border-indigo-200"
                        : "relative hover:bg-slate-100 transition-all duration-50"
                }`}
            >
                <CardHeader className=" py-1 pr-5 pl-0">
                    <CardTitle className="text-sm flex justify-between">
                        <div className="flex items-center gap-x-1">
                            <span
                                onClick={(e) => {
                                    e.stopPropagation(); // Zatrzymaj propagację, aby nie otwierało artykułu
                                    toggleArticleAsFavouriteHandler({ id: article?._id });
                                }}
                                className=" pl-3.5 p-2 py-0.5 flex items-center justify-center border border-transparent rounded-lg  group"
                            >
                                <FaStar
                                    className={
                                        article?.isFavourite
                                            ? "text-slate-900 group-hover:text-blue-200"
                                            : "text-gray-300 group-hover:text-blue-300"
                                    }
                                />
                            </span>
                            <span className="word-break: break-all mr-2.5">{article?.title}</span>
                        </div>

                        <TooltipProvider delayDuration={490}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link onClick={(e) => e.stopPropagation()} to={`/articles/${article?._id}`}>
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
                    </CardTitle>

                    <CardDescription className="text-xs flex items-center gap-1"></CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card
            onClick={(e) => {
                e.stopPropagation();
                quickViewArticleHandler(article, isSelected);
            }}
            className={`${className} ${
                isSelected
                    ? "bg-indigo-100 shadow-lg relative  border-indigo-200"
                    : "relative hover:bg-slate-100 transition-all duration-50"
            }`}
        >
            <CardHeader className=" py-1">
                <CardTitle className="text-sm flex justify-between   ">
                    <div className="flex items-center gap-x-1">
                        <span
                            onClick={(e) => {
                                e.stopPropagation(); // Zatrzymaj propagację, aby nie otwierało artykułu
                                toggleArticleAsFavouriteHandler({ id: article?._id });
                            }}
                            className=" px-1 flex items-center justify-center border border-transparent rounded-lg hover:border hover:broder hover:border-gray-300/90"
                        >
                            <FaStar className={article?.isFavourite ? "" : "text-gray-200/60"} />
                        </span>
                        <span className="word-break: break-all ">{article.title}</span>
                    </div>

                    <Link onClick={(e) => e.stopPropagation()} to={`/articles/${article._id}`}>
                        <FaFolderOpen className="w-5 h-5 text-blue-950/90 hover:text-slate-500 " />
                    </Link>
                </CardTitle>

                {/* <CardDescription className='text-xs flex items-center gap-1'>
                        

    
            </CardDescription>  */}
            </CardHeader>
        </Card>
    );
};

export default ArticleCard;
