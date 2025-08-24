import { CREATED, NO_CONTENT, OK } from "@/constants/http";
import { ProductService } from "./product.service";
import catchErrors from "@/utils/catchErrors";
import { createProductDto } from "./dto/create-product.dto";
import { searchProductsDto } from "./dto/search-products.dto";
import { updateProductDto } from "./dto/update-product.dto";

export const ProductController = (productService = ProductService) => ({
    create: catchErrors(async ({ user, body }, res) => {
        const payload = createProductDto.parse(body);
        const product = await productService.create(user._id.toString(), payload);
        return res.status(CREATED).json(product);
    }),

    find: catchErrors(async ({ query }, res) => {
        const payload = searchProductsDto.parse(query);
        const products = await productService.find(payload);
        return res.status(OK).json(products);
    }),

    findOne: catchErrors(async ({ params }, res) => {
        const product = await productService.findOne(params.id);
        return res.status(OK).json(product);
    }),

    updateOne: catchErrors(async ({ params, body }, res) => {
        const payload = updateProductDto.parse(body);
        await productService.updateOne(params.id, payload);
        return res.sendStatus(NO_CONTENT);
    }),

    deleteOne: catchErrors(async ({ params }, res) => {
        await productService.deleteOne(params.id);
        return res.sendStatus(NO_CONTENT);
    }),
});
