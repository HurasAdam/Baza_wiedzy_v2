import { CONFLICT } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { FaqItemModel } from "../faq-item/faq-item.model";
import FaqModel from "../faq/faq.model";

export const FaqService = {
    async create(userId: string, body: any) {
        const { title, questions = [], ...rest } = body;

        const faqExists = await FaqModel.exists({ title });
        appAssert(!faqExists, CONFLICT, "Faq already exists");

        const newFaq = await FaqModel.create({
            title,
            ...rest,
            createdBy: userId,
        });

        if (Array.isArray(questions) && questions.length > 0) {
            const faqItemsData = questions.map((q: any) => ({
                faqId: newFaq._id,
                question: q.question,
                answer: q.answer,
                createdBy: userId,
                modifiedBy: null,
            }));

            await FaqItemModel.insertMany(faqItemsData);
        }

        return newFaq;
    },
};
