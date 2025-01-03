import { CONFLICT, NOT_FOUND } from "../constants/http";
import ConversationTopicModel from "../models/ConversationTopic.model";
import ProductModel from "../models/Product.model";
import TagModel from "../models/Tag.model";
import appAssert from "../utils/appAssert";

interface CreateProductRequest {
  name: string;
  labelColor: string;
  banner?: string;
}

interface CreateProductParams {
  request: CreateProductRequest;
  userId: string; // userId to string
}

export const createProduct = async ({
  request,
  userId,
}: CreateProductParams) => {
  const { name, labelColor, banner } = request;

  const product = await ProductModel.exists({ name });
  appAssert(!product, CONFLICT, "Product already exists");

  const createdProduct = await ProductModel.create({
    name,
    createdBy: userId,
    labelColor,
    banner,
  });
  return createdProduct;
};

export const deleteProduct = async ({ productId }: { productId: string }) => {
  // Znajdź produkt w bazie
  const product = await ProductModel.findById({ _id: productId });
  appAssert(product, NOT_FOUND, "Product not found");

  // Sprawdź, czy istnieją powiązane tematy rozmów
  const relatedTopicsCount = await ConversationTopicModel.countDocuments({
    product: productId,
  });

  appAssert(
    relatedTopicsCount === 0,
    CONFLICT,
    "Cannot delete product. It is used in one or more conversation topics."
  );

  // Usuń produkt, jeśli brak powiązań
  await ProductModel.findByIdAndDelete({ _id: productId });

  return { message: "Product deleted successfully" };
};

export const getSingleProduct = async ({
  productId,
}: {
  productId: string;
}) => {
  const product = await ProductModel.findById({ _id: productId });
  appAssert(product, NOT_FOUND, "Product not found");
  return product;
};
