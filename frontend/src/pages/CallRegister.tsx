import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { conversationTopicApi } from "@/lib/conversationTopicsApi";
import { useQuery } from "@tanstack/react-query";
import { PiPhoneCallFill } from "react-icons/pi";
import React, { useState } from "react";
import ConversationReportCard from "@/components/ConversationReportCard";
import { conversationReportApi } from "@/lib/conversationReportsApi";
import { TbReportSearch } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { tagsApi } from "@/lib/tagsApi";
import { HiMiniXMark } from "react-icons/hi2";
import { SelectBox } from "@/components/core/SelectBox";
import { productsApi } from "@/lib/productsApi";
import { IMAGES } from "@/constants/images";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/core/Spinner";

export interface ITopic {
  _id: string;
  title: string;
  createdBy: string;
  __v: number;
}

const CallRegister = () => {
  const [title, setTitle] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const { debouncedValue } = useDebounce({ value: title, delay: 250 });
  const queryParams = {
    title: "",
    product: "",
  };

  const { data: conversationTopics = [], isLoading:isConversationTopicsLoading } = useQuery({
    queryKey: ["conversationTopics", queryParams],
    queryFn: () => {
      return conversationTopicApi.getConversationTopics(queryParams);
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return productsApi.getAllProducts();
    },
  });

  const formatedTags = products
    ? [
        { label: "Wszystkie", value: "all" },
        ...products?.map((tag) => ({ label: tag.name, value: tag.name })),
      ]
    : [{ label: "Brak produktów", value: "brak" }];

  const handleSelectTag = (selected) => {
    if (selected === "all") {
      setSelectedProduct(""); // Pusty string oznacza brak filtra
    } else {
      setSelectedProduct(selected); // Inne wartości są normalnie ustawiane
    }
  };

  console.log("selectedTag");
  console.log(selectedTag);

  const handleClearSelectedTag = () => {
    setSelectedTag("");
  };

  const clearFiltersHandler = () => {
    setTitle("");
    setSelectedProduct("");
  };

  const { data: conversationReportValues = [] } = useQuery({
    queryKey: ["conversationReports"],
    queryFn: () => {
      return conversationReportApi.getConversationReportValues({});
    },
  });

  const filteredTopics = conversationTopics.filter((topic) => {
    const matchesTitle = topic.title
      .toLowerCase()
      .includes(title.toLowerCase());
    const matchesProduct =
      selectedProduct === "" || // Brak filtra, pokaż wszystkie
      selectedProduct === "all" || // Wybrano opcję "Wszystkie"
      (topic.product?.name && topic.product.name === selectedProduct); // Porównanie z nazwą produktu

    return matchesTitle && matchesProduct; // Oba warunki muszą być spełnione
  });

  return (
    <div className="grid grid-cols-[5fr_2fr] p-3 gap-4">
      <div>
        <div className="grid grid-cols-[1fr_2fr] bg-slate-200 border border-slate-200 py-3 px-4 rounded">
          <h2 className="flex gap-1 items-center py-4">
            <PiPhoneCallFill className="w-6 h-6 text-slate-700" />
            <span className="text-xl font-semibold text-slate-700">
              Rejestr tematów rozmów
            </span>
          </h2>
          <div className="grid grid-cols-[3fr_3fr_1fr] items-center gap-4">
            <Input
              placeholder="Wyszukaj temat rozmowy..."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />

            <div className="relative">
              {selectedTag && (
                <HiMiniXMark
                  type="button"
                  onClick={handleClearSelectedTag}
                  className="absolute bottom-2 right-[3%] w-6 h-6 cursor-pointer hover:text-blue-800"
                />
              )}

              {formatedTags && (
                <SelectBox
                  placeholder="Wybierz produkt"
                  onChange={handleSelectTag}
                  clearAuthorHandler={handleClearSelectedTag}
                  value={selectedProduct}
                  data={formatedTags}
                />
              )}
            </div>
            <Button variant="default" onClick={clearFiltersHandler}>
              Wyczyść
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 my-3">
      
          {isConversationTopicsLoading ? (
            <div className="skeleton-container">
                  <Spinner position="center" color="bg-blue-500"/>
              {[1, 2, 3, 4, 5].map((_, index) => {
                return (
                  <div
                    key={index}
                    className="border rounded-lg px-5 py-3.5 grid grid-cols-2 max-w-6xl gap-4 bg-white shadow-xs"
                  >
                    <div className="flex-1 flex flex-col gap-4">
                      <Skeleton animation="none" className="w-[94%] h-6 rounded-md" />
                      <Skeleton animation="none" className="w-[94%] h-20 rounded-md mt-2" />
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4">
                        <Skeleton animation="none" className="w-full h-20 rounded-lg" />
                        <div className="flex items-end">
                          <Skeleton animation="none" className="w-32 h-10 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : filteredTopics.length > 0 ? (
            filteredTopics.map((topic: ITopic) => (
              <ConversationReportCard key={topic._id} topic={topic} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center border p-8 bg-slate-50 rounded-lg text-center text-slate-500 shadow-lg min-h-[500px] transition-all ease-in-out duration-300">
              <div className="w-48 h-48 mb-6">
                <img
                  src={IMAGES.notFoundImage}
                  alt="Brak wyników"
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="text-xl font-medium text-slate-700">Brak wyników</p>
              <p className="mt-4 text-sm text-slate-500">
                Żadne tematy nie pasują do Twoich kryteriów. Spróbuj zmienić
                filtry lub szukaj ponownie.
              </p>
              <Button
                className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-lg shadow hover:bg-slate-700 transition-colors duration-300"
                onClick={clearFiltersHandler}
              >
                Zresetuj filtry
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 pt-12">
        <h2 className="flex gap-1 items-center">
          <TbReportSearch className="w-5 h-5 text-slate-700" />
          <span className="text-lg font-semibold text-slate-700">
            Najczęściej odnotowywane
          </span>
        </h2>
        <div className="p-2">
          <div className="px-1 grid grid-cols-[6fr_1fr] text-sm font-semibold text-slate-600 rounded-lg my-1 justify-between">
            <div>Temat</div>
            <div>Ilość</div>
          </div>
          {conversationReportValues?.map((reportTopicItem) => {
            return (
              <div className="border px-2.5 py-2 grid grid-cols-[6fr_1fr] bg-white rounded-lg my-1 justify-between">
                <div>{reportTopicItem.topicTitle}</div>
                <div>{reportTopicItem.reportCount}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CallRegister;
