import { CONFLICT, NOT_FOUND, OK } from "../constants/http";
import ConversationTopicModel from "../models/ConversationTopic.model";
import ProductModel from "../models/Product.model";
import {
  createConversationTopic,
  deleteConversationTopic,
  getConversationTopic,
} from "../services/conversationTopic.service";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { constructSearchQuery } from "../utils/constructSearchQuery";
import {
  conversationTopicSchema,
  newConversationTopicSchema,
} from "./conversationTopic.schema";

export const createConversationTopicHandler = catchErrors(async (req, res) => {
  const request = newConversationTopicSchema.parse(req.body);
  const { userId } = req;
  const newTag = await createConversationTopic({ request, userId });

  return res.status(OK).json(newTag);
});

export const getConversationTopicsHandler = catchErrors(async (req, res) => {
  const query = constructSearchQuery(req.query);
  const conversationTopics = await ConversationTopicModel.find(query)
    .populate([
      { path: "product", select: ["name", "labelColor", "banner", "-_id"] },
    ])
    .sort("product.name"); 
  return res.status(OK).json(conversationTopics);
});

export const getSingleConversationTopicHandler = catchErrors(
  async (req, res) => {
    const { id } = req.params;
    const { userId }: { userId: string } = req;
    const conversationTopic = await getConversationTopic({
      userId,
      topicId: id,
    });
    return res.status(OK).json(conversationTopic);
  }
);

export const deleteConversationTopicHandler = catchErrors(async (req, res) => {
  const { id } = req.params;

  const conversationTopic = await deleteConversationTopic({ topicId: id });
  return res.status(OK).json(conversationTopic);
});

export const updateConversationTopicleHandler = catchErrors(
  async (req, res) => {
    const { id } = req.params;
    const { title, product } = req.body;


    const conversationTopic = await ConversationTopicModel.findById(id);
    appAssert(conversationTopic, NOT_FOUND, "Conversation topic not found");

  
    if (product) {
      const assignedProduct = await ProductModel.findById(product);
      appAssert(assignedProduct, NOT_FOUND, "Product not found");
    }

    if (title && product) {
   
      const existingTopic = await ConversationTopicModel.findOne({
        title,
        product,
        _id: { $ne: id }, 
      });

      appAssert(
        !existingTopic,
        CONFLICT,
        "Tytuł tematu rozmowy już istnieje dla tego produktu"
      );
    }

    conversationTopic.title = title || conversationTopic.title;
    conversationTopic.product = product || conversationTopic.product;

    const updatedConversationTopic = await conversationTopic.save();

    res.status(OK).json({ message: "Temat rozmowy został zaktualizowany" });
  }
);
