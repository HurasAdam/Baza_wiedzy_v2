import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

const SideBySideArticlesList = ({ onSelect, articles }) => {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const filteredArticles = articles?.data?.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.preview.toLowerCase().includes(search.toLowerCase());
    const matchesProduct = selectedProduct ? article.product === selectedProduct : true;
    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
    const matchesVerified = isVerified ? article.isVerified : true;

    return matchesSearch && matchesProduct && matchesCategory && matchesVerified;
  });

  const resetFilters = () => {
    setSearch("");
    setSelectedProduct("");
    setSelectedCategory("");
    setIsVerified(false);
  };

  return (
    <div className=" bg-gray-100 border-r border-gray-300 h-full overflow-y-auto p-2 shadow-lg scrollbar-custom">
      {/* Nagłówek */}
 

      {/* Lista artykułów */}
      <div className="space-y-1.5 ">
        {filteredArticles?.map((article) => (
          <div
  key={article._id}
  className={`p-3  bg-white border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center ${article?.isFavourite && "border-l-2 border-l-amber-500"}`}
  onClick={() => onSelect(article._id)}
>
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <h3 className="text-base font-medium text-gray-900">{article.title}</h3>
      {article.isVerified && (
        <FaCheckCircle className="text-green-500 text-sm" title="Zweryfikowany" />
      )}
    </div>
   
  </div>

  {/* Mniejsza ikona strzałki */}
<div className=" border bg-slate-50 border-gray-200 rounded-md p-1.5 hover:bg-slate-200" onClick={()=>{}}>
<FaArrowRight  className=" text-sm text-slate-400 " />
</div>
</div>
        ))}
      </div>
    </div>
  );
};

export default SideBySideArticlesList;