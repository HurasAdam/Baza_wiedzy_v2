import { CONFLICT, NOT_FOUND, OK } from "../constants/http";
import ProductModel from "../models/Product.model";
import {
  createProduct,
  deleteProduct,
  getSingleProduct,
} from "../services/product.service";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { newProductSchema } from "./product.schema";

export const createProductHandler = catchErrors(async (req, res) => {
  const request = newProductSchema.parse(req.body);
  const { userId } = req;
  const newProduct = await createProduct({ request, userId });

  return res.status(OK).json(newProduct);
});

export const deleteProductHandler = catchErrors(async (req, res) => {
  const { id } = req.params;

  const conversationTproduct = await deleteProduct({ productId: id });
  return res.status(OK).json(conversationTproduct);
});

export const getProductsHandler = catchErrors(async (req, res) => {
  const tags = await ProductModel.find({}).select(["-createdBy"]);
  return res.status(OK).json(tags);
});

export const getSingleProductHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const product = await getSingleProduct({ productId: id });
  return res.status(OK).json(product);
});

export const updateProductHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { name, labelColor, banner } = req.body;

  // Znajdź istniejący produkt po ID
  const product = await ProductModel.findById({ _id: id });
  appAssert(product, NOT_FOUND, "Product not found");

  // Jeśli nazwa jest zmieniana, sprawdź, czy produkt z tą nazwą już istnieje
  if (name && name !== product.name) {
    const existingProduct = await ProductModel.exists({ name });
    appAssert(
      !existingProduct,
      CONFLICT,
      "Product with this name already exists"
    );
  }

  // Zaktualizuj nazwę i kolor etykiety
  product.name = name || product.name;
  product.labelColor = labelColor || product.labelColor;
  product.banner = banner || product.banner;

  const updatedProduct = await product.save();

  res.status(OK).json({ message: "Produkt został zaktualizowany" });
});
