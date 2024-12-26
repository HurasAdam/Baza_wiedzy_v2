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
    .populate([{ path: "product", select: ["name", "labelColor", "-_id"] }]) // Załadowanie produktów
    .sort("product.name"); // Sortowanie według nazwy produktu
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

    // Sprawdzamy, czy temat rozmowy istnieje
    const conversationTopic = await ConversationTopicModel.findById(id);
    appAssert(conversationTopic, NOT_FOUND, "Conversation topic not found");

    // Jeśli produkt jest podany, sprawdzamy, czy istnieje
    if (product) {
      const assignedProduct = await ProductModel.findById(product); // użyj findById, nie find
      appAssert(assignedProduct, NOT_FOUND, "Product not found");
    }

    if (title && product) {
      // Sprawdzenie unikalności kombinacji tytuł + produkt
      const existingTopic = await ConversationTopicModel.findOne({
        title,
        product,
        _id: { $ne: id }, // Wykluczamy aktualny temat (który chcemy zaktualizować)
      });

      appAssert(
        !existingTopic,
        CONFLICT,
        "Tytuł tematu rozmowy już istnieje dla tego produktu"
      );
    }

    // Aktualizacja tematu rozmowy
    conversationTopic.title = title || conversationTopic.title;
    conversationTopic.product = product || conversationTopic.product;

    // Zapisz zmiany w bazie danych
    const updatedConversationTopic = await conversationTopic.save();

    // Zwróć odpowiedź po udanej aktualizacji
    res.status(OK).json({ message: "Temat rozmowy został zaktualizowany" });
  }
);
