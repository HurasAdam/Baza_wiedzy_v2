import { useQuery } from "@tanstack/react-query";
import { FilePlus } from "lucide-react";
import { productsApi } from "../../../lib/productsApi";
import { tagsApi } from "../../../lib/tagsApi";
import ArticleForm from "../../forms/ArticleForm";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const CreateArticle = () => {
    const { data: tags = [] } = useQuery({
        queryKey: ["tags"],
        queryFn: () => {
            return tagsApi.getAllTags();
        },
    });
    const { data: products = [] } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return productsApi.getAllProducts();
        },
    });

    const formatedTags = tags?.tags?.map((tag) => {
        return { label: tag.name, value: tag._id };
    });

    const formatedProducts = products?.map((product) => {
        return { label: product.name, value: product._id };
    });

    return (
        <div className="px-20">
            <Card className=" mx-10 border-none ">
                <CardHeader className="flex flex-row items-center gap-3 ">
                    <FilePlus size={32} className=" text-primary" />
                    <CardTitle className="text-2xl font-semibold text-foreground/85">Tworzenie Artykułu</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground/65 border-b text-xs border-dashed border-input/20">
                    Wypełnij formularz, aby dodać nowy artykuł
                </CardContent>
            </Card>
            {tags?.tags ? <ArticleForm tags={formatedTags} products={formatedProducts} /> : <p>Loading tags...</p>}
        </div>
    );
};

export default CreateArticle;
