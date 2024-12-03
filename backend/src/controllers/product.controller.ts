import { OK } from "../constants/http";
import ProductModel from "../models/Product.model";
import { createProduct } from "../services/product.service";
import catchErrors from "../utils/catchErrors";
import { newProductSchema } from "./product.schema";

export const createProductHandler = catchErrors(
    async(req,res)=>{
        const request = newProductSchema.parse(req.body);
        const {userId} = req
        const newProduct= await createProduct({request, userId});

console.log(newProduct);
return res.status(OK).json(newProduct)

    }
)

export const getProductsHandler = catchErrors(
    async(req,res)=>{
       
        const tags = await ProductModel.find({}).select(["-createdBy"]);
        return res.status(OK).json(tags)
    }
)