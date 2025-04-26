// components/ui/ProductCategoryCardSkeleton.tsx
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Przykładowy komponent do szkieletu

const ProductCategoryCardSkeleton = () => {
    return (
        <Card className="bg-card/60 border border-border h-20">
            <CardHeader className="p-4 flex flex-row justify-between">
                <div className="space-y-4">
                    {/* Szkielet daty */}
                    <Skeleton className="w-20 h-2 bg-muted" />
                    {/* Szkielet nazwy kategorii */}
                    <Skeleton className="w-40 h-4 bg-muted" />
                </div>
                <div className="space-x-3.5 flex">
                    {/* Szkielety dla przycisków */}
                    <Skeleton className="w-16 h-5 bg-muted" />
                    <Skeleton className="w-16 h-5 bg-muted" />
                </div>
            </CardHeader>
        </Card>
    );
};

export default ProductCategoryCardSkeleton;
