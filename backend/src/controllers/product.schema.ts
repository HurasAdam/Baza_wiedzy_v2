import {z} from "zod";


export const productNameSchema = z.string().min(2, { message: "Product name must be at least 2 characters long" }).max(50, { message: "Product name must be at most 20 characters long" });


export const newProductSchema = z.object({
    name:productNameSchema,
    labelColor:z.string()
})




