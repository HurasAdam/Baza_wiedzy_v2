import { CONFLICT } from "../constants/http";
import ProductModel from "../models/Product.model";
import TagModel from "../models/Tag.model";
import appAssert from "../utils/appAssert";

interface CreateProductRequest {
    name: string;
  }


interface CreateProductParams {
    request: CreateProductRequest;
    userId: string; // userId to string
  }

export const createProduct = async({request, userId}:CreateProductParams)=>{
    const {name} = request;

    const product = await ProductModel.exists({name});
    appAssert(!product, CONFLICT, "Product already exists");

    const createdProduct = await ProductModel.create({
        name,
        createdBy:userId
    })
    return createdProduct;
}