import { useQuery } from "@tanstack/react-query";
import { conversationTopicApi } from "@/lib/conversation-topic.api";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { productApi } from "@/lib/product.api";
import RegisterTopicForm from "@/components/forms/RegisterTopicForm";

const listVariants = {
    hidden: { opacity: 1, y: 1 },
    show: { opacity: 1, y: 1, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 1, y: 1, transition: { duration: 0.0 } },
};
export function RegisterTopicPage() {
    const [params, setParams] = useSearchParams();

    const product = params.get("product") || "";

    const { data: topics = [] } = useQuery({
        queryKey: ["conversationTopics", product],
        queryFn: () => conversationTopicApi.find({ product }),
    });

    const { data: products } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return productApi.find();
        },
    });

    const itemVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
    };

    const productHandler = (product: string) => {
        setParams((prev) => {
            prev.set("product", product);
            prev.delete("category");
            return prev;
        });
    };

    return (
        <div className=" flex w-full max-w-[1540px] mx-auto p-5 min-h-[calc(100vh-190px)] ">
            <div className="flex w-full gap-6">
                <div>
                    <div
                        key={product}
                        variants={listVariants}
                        className="flex flex-col items-start rounded-md bg-background  p-1 overflow-x-auto pt-3 flex-wrap gap-1 min-w-[300px] max-w-[300px]   "
                    >
                        <motion.button
                            key="all"
                            onClick={() => {
                                setParams((prev) => {
                                    prev.delete("product");
                                    prev.delete("category");
                                    return prev;
                                });
                            }}
                            variants={itemVariants}
                            className={`flex items-center w-full px-4 py-1.5 text-sm rounded-md font-medium transition-all hover:opacity-80 ${
                                !product
                                    ? "bg-primary/75 border text-primary-foreground shadow-md"
                                    : "bg-transparent border text-[hsl(var(--muted-foreground))]"
                            }`}
                        >
                            {!product && <Check className="mr-1 w-4 h-4 text-[hsl(var(--primary-foreground))]" />}
                            Wszystkie
                        </motion.button>
                        {products?.map((cat) => (
                            <motion.button
                                key={cat._id}
                                onClick={() => productHandler(cat._id)}
                                variants={itemVariants}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center  w-full px-4 py-1.5 border text-sm rounded-md font-medium whitespace-normal break-words transition-all hover:opacity-80 ${
                                    product === cat._id
                                        ? "bg-primary/75 text-primary-foreground shadow-md "
                                        : "bg-transparent border text-[hsl(var(--muted-foreground))]"
                                }`}
                            >
                                {product === cat._id && (
                                    <Check className="mr-1 w-4 h-4 text-[hsl(var(--primary-foreground))]" />
                                )}
                                {cat.name}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="space-y-5 flex-1">
                    {topics?.map((topic) => (
                        <Card
                            key={topic._id}
                            className="w-full shadow-sm hover:shadow-md transition-shadow rounded-lg px-0.5"
                        >
                            <CardContent className="flex items-start justify-between px-4 py-1.5 w-full">
                                {/* LEFT SIDE */}
                                <div className="flex flex-col px-1.5 space-y-0.5">
                                    <div className="flex items-center py-2.5  gap-1.5">
                                        <div
                                            className=" text-xs uppercase text-muted-foreground w-3.5 h-3.5 rounded-sm"
                                            style={{ backgroundColor: topic.product.labelColor }}
                                        />
                                        <span className="text-xs font-medium text-primary-foreground/80">
                                            {" "}
                                            {topic.product.name}
                                        </span>
                                    </div>
                                    <div className="flex-1 pr-4">
                                        <h3 className="text-lg font-semibold text-foreground/90">{topic.title}</h3>
                                    </div>
                                </div>
                                {/* RIGHT SIDE*/}
                                <RegisterTopicForm topicId={topic?._id} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
