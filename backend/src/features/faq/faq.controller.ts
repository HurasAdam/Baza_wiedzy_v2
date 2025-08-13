import { CREATED, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { paramsIdDto } from "../../common/dto/params-id.dto";
import { faqItemResponseDto } from "../faq-item/dto/response-dto/faqItemResponseDto";
import { createFaqDto } from "./dto/request-dto/create-faq.dto";
import { faqListResponseDto } from "./dto/response-dto/faq-list-response.dto";
import { faqResponseDto } from "./dto/response-dto/faq-response.dto";
import { FaqService } from "./faq.service";

export const FaqController = (faqService = FaqService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const payload = createFaqDto.parse(body);
        const faq = await faqService.create(userId, payload);
        return res.status(CREATED).json({ message: "Dodano nowy faq", data: "FAQ" });
    }),

    find: catchErrors(async (_, res) => {
        const serviceResponse = await faqService.find();
        const response = serviceResponse.map((faq) => {
            const parsed = faqListResponseDto.parse(faq);

            return parsed;
        });
        return res.status(OK).json(response);
    }),
    findOne: catchErrors(async ({ params }, res) => {
        const { id } = params;

        const { id: validId } = paramsIdDto.parse({ id });

        const { faq, items } = await faqService.findOne(validId);

        const parsedFaq = faqResponseDto.parse(faq);
        const parsedItems = items.map((item) => faqItemResponseDto.parse(item));

        const response = {
            ...parsedFaq,
            items: parsedItems,
        };
        return res.status(OK).json(response);
    }),
});
