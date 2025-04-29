import { Package, FileText, List, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/forms/ProductForm";

import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/product.api";
import { useState } from "react";
import { useModal } from "@/components/modal/hooks/useModal";
import { articleApi } from "@/lib/article.api";
import { ArticleDetailsX } from "@/components/articles/views/splitView/components/ArticleDetailsX";

const TrashedArticleDetailsContainer = ({ productId, onClose }) => {
    const [activeTab, setActiveTab] = useState<"details" | "categories">("details");

    // jeżeli masz dane produktu (żeby pokazać nazwę w nagłówku)
    const { data: product } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => (productId ? articleApi.getArticle(productId) : Promise.resolve(null)),
        enabled: !!productId,
    });

    const menuItems = [
        { key: "details", label: "Dane produktu", icon: FileText },
        { key: "categories", label: "Kategorie", icon: List },
    ];

    return (
        <div className="flex flex-col h-full rounded-lg overflow-hidden bg-background">
            {/* NAGŁÓWEK */}
            <div className="flex items-center justify-between px-6 py-4  border-b">
                <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-primary-600" />
                    <h2 className="text-base font-semibold">
                        Edycja produktu
                        {product?.name && <span className="ml-2 text-primary-600">({product.name})</span>}
                    </h2>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* MENU */}
                <aside className="w-1/5  border-r">
                    <nav className="flex flex-col mt-6">
                        {menuItems.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`flex items-center text-sm gap-2 w-full text-left px-4 py-3 transition 
                  ${
                      activeTab === key
                          ? " text-primary-foreground border-l-4 border-primary font-medium shadow-sm "
                          : "text-primary-foreground/50 hover:bg-muted/80 rounded-lg"
                  }
                `}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* TREŚĆ */}
                <main className="flex-1 scrollbar-custom max-h-full h-fit overflow-auto ">
                    <Card className="max-h-full h-fitw-full rounded-none border-none bg-background/30 p-0">
                        <div className="h-full w-full">
                            {activeTab === "details" ? (
                                <ArticleDetailsX articleId={productId} />
                            ) : (
                                <ProductEditCategories productId={productId} />
                            )}
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default TrashedArticleDetailsContainer;
