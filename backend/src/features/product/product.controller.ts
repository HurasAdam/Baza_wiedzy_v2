import { CONFLICT, NOT_FOUND, OK } from "@/constants/http";
import ProductModel from "./product.model";
import { createProduct, deleteProduct, getSingleProduct, ProductService } from "./product.service";
import appAssert from "@/utils/appAssert";
import catchErrors from "@/utils/catchErrors";
import { newProductSchema } from "./product.schema";
import { searchProductsDto } from "./dto/search-products.dto";

export const ProductController = (productService = ProductService) => ({
    create: catchErrors(async (req, res) => {
        const request = newProductSchema.parse(req.body);
        const { userId } = req;
        const newProduct = await createProduct({ request, userId });

        return res.status(OK).json(newProduct);
    }),

    delete: catchErrors(async (req, res) => {
        const { id } = req.params;

        const conversationTproduct = await deleteProduct({ productId: id });
        return res.status(OK).json(conversationTproduct);
    }),

    find: catchErrors(async ({ query }, res) => {
        const payload = searchProductsDto.parse(query);
        const products = await productService.find(payload);
        return res.status(OK).json(products);
    }),

    findOne: catchErrors(async (req, res) => {
        const { id } = req.params;
        const product = await getSingleProduct({ productId: id });
        return res.status(OK).json(product);
    }),

    update: catchErrors(async (req, res) => {
        const { id } = req.params;
        const { name, labelColor, banner } = req.body;

        // Znajdź istniejący produkt po ID
        const product = await ProductModel.findById({ _id: id });
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

        const updatedProduct = await product.save();

        res.status(OK).json({ message: "Produkt został zaktualizowany" });
    }),
});
