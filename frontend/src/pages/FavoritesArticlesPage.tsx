import { ArticlesFilter } from "@/components/articles/views/feedView/ArticlesFeedView";
import { IMAGES } from "@/constants/images";
import { userApi } from "@/lib/user.api";
// import { IArticle } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export const FavoritesPage = () => {
    const { data: favouriteArticles, isLoading } = useQuery({
        queryKey: ["favourites"],
        queryFn: () => userApi.findAllFavouriteArticles(),
    });

    if (isLoading) {
        return (
            <div className="text-foreground p-5 h-full flex w-full max-w-[1540px] mx-auto gap-6">
                <ArticlesFilter />
                <div className="text-foreground flex flex-col p-3 h-full w-full max-w-[1540px] mx-auto gap-1">
                    <h2 className="flex items-center gap-1.5 mb-6 text-xl font-semibold">
                        <FaStar />
                        Moje ulubione
                    </h2>
                    {/* Skeleton loader for articles */}
                    {Array.from([1, 2, 3, 4, 5, 6]).map((_, i) => (
                        <div key={i} className="bg-card/30 rounded-lg animate-pulse w-full h-14 mb-2"></div>
                    ))}
                </div>
            </div>
        );
    }
    if (favouriteArticles?.data && favouriteArticles?.data?.length === 0) {
        return (
            <div className="flex  p-5 h-full max-w-[1540px] mx-auto gap-6 min-h-[calc(100vh-120px)]">
                <ArticlesFilter />
                <div className="flex flex-col items-center justify-center p-10 space-y-6  rounded-lg shadow-lg  w-full">
                    <div className="text-center space-y-4 flex flex-col  gap-2">
                        <div>
                            <img src={IMAGES.findArticleImage} alt="Nie znaleziono" className="w-52 mx-auto" />
                            <p className="text-base  max-w-[360px] text-primary-foreground/75">
                                Wygląda na to że twoja lista ulubionych artykułów jest pusta.
                            </p>
                        </div>
                        <Link
                            to="/articles"
                            className="bg-primary/80 text-white py-2 px-6 rounded-lg hover:bg-primary-dark transition-all w-fit mx-auto"
                        >
                            Powrót do listy artykułów
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" text-foreground p-5 h-full flex w-full max-w-[1540px] mx-auto gap-6 ">
            {/* <ArticlesFilter /> */}
            <div className="text-foreground flex flex-col p-3 h-full w-full max-w-[1540px] mx-auto gap-1">
                <p>tutaj będą ulubione artykuły</p>
                {/* {favouriteArticles?.data?.map((article: IArticle, i: number) => (
                    <ArticleListItem
                        key={i}
                        article={article}
                        className="hover:border-b hover:bg-muted/40 cursor-pointer transition-all"
                    />
                ))} */}
            </div>
        </div>
    );
};
