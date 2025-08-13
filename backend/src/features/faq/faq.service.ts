import { CONFLICT, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { FaqItemModel, IFaqItemDocument } from "../faq-item/faq-item.model";
import FaqModel, { FaqDocument } from "../faq/faq.model";

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

    async find() {
        const faqs = await FaqModel.find({}).lean();
        return faqs;
    },
    async findOne(faqId: string): Promise<{ faq: FaqDocument; items: IFaqItemDocument[] }> {
        const faq = await FaqModel.findOne({ _id: faqId }).lean();
        appAssert(faq, NOT_FOUND, "FAQ not found");
        const faqItems = await FaqItemModel.find({ faqId }).lean();

        return {
            faq,
            items: faqItems,
        };
    },
};
