import { CONFLICT, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { FaqItemModel, IFaqItemDocument } from "../faq-item/faq-item.model";
import FaqModel, { FaqDocument } from "../faq/faq.model";
import { SearchFaqDto } from "./dto/request-dto/search-faq.dto";

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

    async find(payload: SearchFaqDto) {
        const filter: Record<string, any> = {};

        if (payload.title) {
            filter.title = { $regex: payload.title, $options: "i" };
        }

        const faqs = await FaqModel.find(filter).lean();

        // dodanie pola items z liczbą powiązanych faqItems
        const faqsWithCount = await Promise.all(
            faqs.map(async (faq) => {
                const count = await FaqItemModel.countDocuments({ faqId: faq._id });
                return { ...faq, items: count };
            })
        );

        return faqsWithCount;
    },
    async findOne(faqId: string): Promise<{ faq: FaqDocument; items: IFaqItemDocument[] }> {
        const faq = await FaqModel.findById(faqId)
            .populate({ path: "createdBy", select: ["name", "surname"] })
            .lean();
        appAssert(faq, NOT_FOUND, "FAQ not found");
        const faqItems = await FaqItemModel.find({ faqId }).lean();

        return {
            faq,
            items: faqItems,
        };
    },
    async setDefault(faqId: string): Promise<void> {
        const faq = await FaqModel.findById(faqId);
        appAssert(faq, NOT_FOUND, "Faq not found");

        await FaqModel.updateMany({ isDefault: true }, { $set: { isDefault: false } });
        faq.isDefault = true;
        await faq.save();
    },
};
