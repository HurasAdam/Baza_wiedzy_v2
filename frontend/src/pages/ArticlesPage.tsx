import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Search, Star } from "lucide-react";


const articles = [
  {
    title: "Krótki tytuł",
    product: "Produkt A",
    viewsCounter: 120,
    isVerified: true,
  },
  {
    title: "Tytuł o średniej długości dla testów UI",
    product: "Produkt B",
    viewsCounter: 89,
    isVerified: false,
  },
  {
    title: "Długi tytuł artykułu, który ma więcej znaków, ale nadal mieści się w limicie dziewięćdziesięciu znaków",
    product: "Produkt C",
    viewsCounter: 250,
    isVerified: true,
  },
  {
    title: "Tytuł",
    product: "Produkt D",
    viewsCounter: 45,
    isVerified: false,
  },
  {
    title: "Inny artykuł z unikalnym tytułem, który pokazuje różnorodność długości",
    product: "Produkt E",
    viewsCounter: 300,
    isVerified: true,
  },
  {
    title: "Bardzo długi tytuł artykułu, który niemal osiąga granicę dziewięćdziesięciu znaków i jest przykładem a granicę dziewięćdziesięciu znaków i jest przykład ",
    product: "Produkt F",
    viewsCounter: 175,
    isVerified: false,
  }
];

export const ArticlesPage = () => {



  return (
    <div className="text-slate-700 p-5 h-full flex w-full max-w-[1580px] mx-auto gap-6">
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

      {/* Lista artykułów */}
      <div className="flex flex-col w-full gap-4">
        <h1 className="text-2xl font-semibold">Artykuły</h1>
        <div className="flex flex-col gap-4">
          {articles.map((article, i) => (
            <Card key={i} className={`p-5 rounded-xl shadow-md border hover:shadow-lg transition relative ${article.isVerified && "border-r-8 border-r-emerald-700/65"}`}>
              {/* Cienki, zaokrąglony pasek po prawej dla zweryfikowanych */}
        

              <div className="flex justify-between items-center">
  <h3 className="text-lg font-semibold truncate max-w-[90%] overflow-hidden">
    {article.title.length > 110 ? `${article.title.slice(0, 110)}...` : article.title}
  </h3>
  <button  className="focus:outline-none">
    <Star className="h-6 w-6 text-gray-400" />
  </button>
</div>
              <p className="text-sm text-gray-500 mt-2">Produkt: {article.product}</p>
              <div className="mt-4 flex justify-end">
                <p className="text-sm text-gray-500">Wyświetlenia: {article.viewsCounter}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
