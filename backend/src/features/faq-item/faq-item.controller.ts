import { CREATED, NO_CONTENT } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { createFaqItemDto } from "./dto/create-faq-item.dto";
import { FaqItemService } from "./faq-item.service";

export const FaqItemController = (faqItemService = FaqItemService) => ({
    create: catchErrors(async ({ userId, body, params }, res) => {
        const payload = createFaqItemDto.parse(body);
        const { faqId } = params;
        const newFaqItem = await faqItemService.create(faqId, userId, payload);
        return res.status(CREATED).json({ message: "FAQ Item has been created", data: newFaqItem });
    }),

    deleteOne: catchErrors(async ({ params }, res) => {
        const { faqItemId } = params;

        await faqItemService.deleteOne(faqItemId);

        return res.status(NO_CONTENT).send();
    }),
});
