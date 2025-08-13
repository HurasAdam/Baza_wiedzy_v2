import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import FaqModel from "../faq/faq.model";
import { CreateFaqItemDto } from "./dto/create-faq-item.dto";
import { FaqItemResponseDto, faqItemResponseDto } from "./dto/response-dto/faqItemResponseDto";
import { FaqItemModel } from "./faq-item.model";

export const FaqItemService = {
    async create(faqId: string, userId: string, payload: CreateFaqItemDto): Promise<FaqItemResponseDto> {
        const faq = await FaqModel.findById({ _id: faqId });
        appAssert(faq, NOT_FOUND, "FAQ not found");

        const existingFaqItem = await FaqItemModel.findOne({
            question: payload.question,
            faqId,
        });
        appAssert(
            !existingFaqItem,
            CONFLICT,
            `This question already exists in FAQ with ID ${faqId}. Please use a different question.`
        );

        const createdFaqItem = await FaqItemModel.create({
            faqId,
            question: payload.question,
            answer: payload.answer,
            createdBy: userId,
        });
        return faqItemResponseDto.parse(createdFaqItem);
    },

    async findOne(faqItemId: string): Promise<FaqItemResponseDto> {
        const faqItem = await FaqItemModel.findById({ _id: faqItemId });
        appAssert(faqItem, NOT_FOUND, "Faq item not found");

        return faqItemResponseDto.parse(faqItem);
    },

    async updateOne(faqItemId: string, payload): Promise<void> {
        const faqItem = await FaqItemModel.findById({ _id: faqItemId });
        appAssert(faqItem, NOT_FOUND, "Faq item not found");

        const existingFaqItem = await FaqItemModel.findOne({
            question: payload.question,
            faqId: faqItem.faqId,
        });
        appAssert(!existingFaqItem, CONFLICT, `This question already exists in FAQ. Please use a different question.`);

        faqItem.question = payload.question ?? faqItem.question;
        faqItem.answer = payload.answer ?? faqItem.answer;

        await faqItem.save();

        return;
    },

    async deleteOne(faqItemId: string) {
        const faqItem = await FaqItemModel.findById({ _id: faqItemId });
        appAssert(faqItem, NOT_FOUND, "Faq item not found");

        const deletedFaqItem = await FaqItemModel.findByIdAndDelete(faqItemId);
        appAssert(deletedFaqItem, INTERNAL_SERVER_ERROR, "Something went wrong");
    },
};
