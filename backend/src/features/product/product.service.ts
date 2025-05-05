import { CONFLICT, NOT_FOUND } from "@/constants/http";
import ArticleModel from "@/features/article/article.model";
import ConversationTopicModel from "@/features/conversation-topic/conversation-topic.model";
import ProductModel from "./product.model";
import appAssert from "@/utils/appAssert";
import { SearchProductsDto } from "./dto/search-products.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import CategoryModel from "../category/category.model";
import { UpdateProductDto } from "./dto/update-product.dto";

export const ProductService = {
    async find(query: SearchProductsDto) {
        const querydb: any = {};

        const name = query.name?.trim();
        if (name) {
            querydb.name = new RegExp(name, "i");
        }

        // Agregacja, aby dodać liczbę artykułów przypisanych do każdego produktu
        const products = await ProductModel.aggregate([
            {
                $match: querydb, // filtrujemy po nazwie
            },
            {
                $lookup: {
                    from: "articles", // odnosimy się do kolekcji "articles"
                    localField: "_id", // pole, które łączy produkty i artykuły
                    foreignField: "product", // pole w artykule, które wskazuje na produkt
                    as: "articles", // alias dla wyników join
                },
            },
            {
                $addFields: {
                    articlesCount: { $size: "$articles" }, // dodajemy pole articlesCount z liczbą artykułów
                },
            },
            {
                $project: {
                    name: 1, // Zwracamy tylko nazwę produktu
                    labelColor: 1, // Zwracamy labelColor
                    banner: 1, // Zwracamy banner
                    articlesCount: 1, // Zwracamy liczbę artykułów
                },
            },
        ]);

        return products;
    },

    async deleteOne(productId: string) {
        // Znajdź produkt w bazie
        const product = await ProductModel.findById(productId);

        appAssert(product, NOT_FOUND, "Product not found");

        // Sprawdzanie, czy istnieją powiązania
        const relatedTopicsCount = await ConversationTopicModel.countDocuments({ product: productId });
        const relatedArticlesCount = await ArticleModel.countDocuments({ product: productId });
        const relatedCategoriesCount = await CategoryModel.countDocuments({ productId });

        appAssert(
            relatedTopicsCount === 0 && relatedArticlesCount === 0 && relatedCategoriesCount === 0,
            CONFLICT,
            "Cannot delete product. It is used in one or more conversation topics or articles."
        );

        // Usuń produkt, jeśli brak powiązań
        await ProductModel.findByIdAndDelete(productId);

        return { message: "Product deleted successfully" };
    },

    async create(userId: string, payload: CreateProductDto) {
        const product = await ProductModel.exists({ name: payload.name });
        appAssert(!product, CONFLICT, "Product already exists");

        const createdProduct = await ProductModel.create({
            ...payload,
            createdBy: userId,
        });

        return createdProduct;
    },

    async findOne(productId: string) {
        const product = await ProductModel.findById(productId);
        appAssert(product, NOT_FOUND, "Product not found");

        return product;
    },

    async updateOne(productId: string, payload: UpdateProductDto) {
        const { name, labelColor, banner } = payload;
        const product = await ProductModel.findById(productId);
        appAssert(product, NOT_FOUND, "Product not found");

        // Jeśli nazwa jest zmieniana, sprawdź, czy produkt z tą nazwą już istnieje
        if (name && name !== product.name) {
            const existingProduct = await ProductModel.exists({ name });
            appAssert(!existingProduct, CONFLICT, "Product with this name already exists");
        }

        // Zaktualizuj nazwę i kolor etykiety
        product.name = name || product.name;
        product.labelColor = labelColor || product.labelColor;
        product.banner = banner || product.banner;

        await product.save();
    },
};
