import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Search, Star } from "lucide-react";
import { useFetchArticles } from "@/hooks/query/useFetchArticles";
import { IArticle } from "@/types";
import { useModalContext } from "@/contexts/ModalContext";
import SideBySideArticleDetails from "@/components/articles/views/SideBySideView/SideBySideArticleDetails";




interface IArticleListProps {
  data: IArticle[];
}

const ArticleList = ({ data }: IArticleListProps) => {

  return (
    <div className="flex flex-col w-full gap-4">
      <h1 className="text-2xl font-semibold">Artykuły</h1>
      <div className="flex flex-col gap-4">
        {data?.map((article: IArticle, i: number) => (
          <ArticleListItem key={i} article={article} className="hover:border-b hover:bg-muted/40 cursor-pointer transition-all" />
        ))}
      </div>
    </div>
  )
}


const ArticleListItem = ({ article, className }: { article: IArticle, className?: string }) => {

  const { openContentModal, closeContentModal } = useModalContext()

  const handleOpen = (): void => {
    openContentModal({
      content: <SideBySideArticleDetails articleId={article?._id} />,
      height: "80",
    })
  }

  return (
    <Card
      onClick={handleOpen}
      className={`px-5 py-3 rounded-xl shadow-md border text-foreground hover:shadow-lg transition relative ${article.isVerified && "border-r-8 border-r-emerald-700/65 "} ${className}`}>

      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold truncate max-w-[90%] overflow-hidden text-foreground">
          {article.title.length > 110 ? `${article.title.slice(0, 110)}...` : article.title}
        </h3>
        <button className="focus:outline-none">
          <Star className="h-6 w-6 text-gray-400" />
        </button>
      </div>
      <div className="flex gap-1 items-center">
        <p className="text-xs text-card-foreground mt-2">Produkt:</p>
        <p className="text-xs text-popover-foreground mt-2"> {article?.product?.name}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <p className="text-sm text-gray-500">Wyświetlenia: {article?.viewsCounter}</p>
      </div>
    </Card>
  )
}



export const ArticlesPage = () => {

  const { data: articles, isLoading, error } = useFetchArticles({ page: "", title: "", author: "" })

  return (
    <div className="text-foreground p-5 h-full flex w-full max-w-[1580px] mx-auto gap-6  ">
      {/* Sidebar - Filtry */}
      <div className="w-80 p-5 rounded-xl h-fit">
        <h2 className="text-lg font-semibold mb-4">Filtruj artykuły</h2>

        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Szukaj</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <Input placeholder="Wpisz tytuł artykułu..." className="pl-10" />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Kategoria</label>
          <Select>
            <option value="technologia">Technologia</option>
            <option value="biznes">Biznes</option>
            <option value="zdrowie">Zdrowie</option>
          </Select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Popularność</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="trending" />
              <label htmlFor="trending">Popularne</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="newest" />
              <label htmlFor="newest">Najnowsze</label>
            </div>
          </div>
        </div>

        <Button className="w-full mt-3">Zastosuj</Button>
      </div>

      <ArticleList data={articles?.data} />
    </div>
  );
};
