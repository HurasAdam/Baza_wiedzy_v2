import { CREATED, NO_CONTENT, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { createFaqItemDto } from "./dto/create-faq-item.dto";
import { FaqItemService } from "./faq-item.service";

export const FaqItemController = (faqItemService = FaqItemService) => ({
    create: catchErrors(async ({ userId, body, params }, res) => {
        const payload = createFaqItemDto.parse(body);
        const { faqId } = params;
        const newFaqItem = await faqItemService.create(faqId, userId, payload);
        return res.status(CREATED).json(newFaqItem);
    }),

    findOne: catchErrors(async ({ params }, res) => {
        const { faqItemId } = params;
        const faqItem = await faqItemService.findOne(faqItemId);
        return res.status(OK).json(faqItem);
    }),

    updateOne: catchErrors(async ({ params, body }, res) => {
        const { faqItemId } = params;

        const updatedFaqItem = await faqItemService.updateOne(faqItemId, body);
        return res.status(NO_CONTENT).json(updatedFaqItem);
    }),

    deleteOne: catchErrors(async ({ params }, res) => {
        const { faqItemId } = params;

        await faqItemService.deleteOne(faqItemId);

        return res.status(NO_CONTENT).send();
    }),
});
