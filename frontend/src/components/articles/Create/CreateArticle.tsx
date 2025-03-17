import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../../../lib/productsApi";
import { tagsApi } from "../../../lib/tagsApi";
import ArticleForm from "../../forms/ArticleForm";

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
            {tags?.tags ? <ArticleForm tags={formatedTags} products={formatedProducts} /> : <p>Loading tags...</p>}
        </div>
    );
};

export default CreateArticle;
