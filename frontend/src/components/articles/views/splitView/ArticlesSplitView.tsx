import { useQuery } from "@tanstack/react-query";
import { articleApi } from "@/lib/article.api";
import { productApi } from "@/lib/product.api";
import { Mail } from "./components/mail";
import { accounts } from "./data";
import { useSearchParams } from "react-router-dom";

const ArticlesSplitView = () => {
    const [params] = useSearchParams();

    const { data: articles } = useQuery({
        queryKey: ["articles"],
        queryFn: () => articleApi.getAllArticles(params),
    });

    const { data: products } = useQuery({
        queryKey: ["all-products"],
        queryFn: () => {
            return productApi.find();
        },
    });

    return (
        <>
            <div className=" flex-col md:flex overflow-hidden  px-10">
                <Mail
                    products={products}
                    accounts={accounts}
                    mails={articles?.data}
                    // defaultLayout={defaultLayout}
                    // defaultCollapsed={defaultCollapsed}
                    navCollapsedSize={4}
                />
            </div>
        </>
    );
};

export default ArticlesSplitView;
