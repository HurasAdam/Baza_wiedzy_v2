import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { FaqItemModel } from "../faq-item/faq-item.model";
import FaqModel from "./faq.model";
import { FaqService } from "./faq.service";

export const FaqController = (faqService = FaqService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        console.log(body);
        // const payload = createArticleDto.parse(body);
        // const article = await articleService.create(userId, payload);
        const faq = await faqService.create(userId, body);
        return res.status(OK).json({ message: "Dodano nowy faq", data: "FAQ" });
    }),

    find: catchErrors(async ({ userId, query }, res) => {
        // const payload = searchArticlesDto.parse(query);
        // const articles = await articleService.find(userId, payload);
        const faqs = await FaqModel.find({});
        return res.status(OK).json(faqs);
    }),
    findOne: catchErrors(async ({ params }, res) => {
        const { id } = params;

        const faq = await FaqModel.findOne({ _id: id });

        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        const faqItems = await FaqItemModel.find({ faqId: id }).select("question answer").lean();

        return res.status(OK).json({
            ...faq.toObject(),
            items: faqItems,
        });
    }),
});
