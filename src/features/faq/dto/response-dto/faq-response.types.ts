import { FaqItemResponseDto } from "../../../faq-item/dto/response-dto/faqItemResponseDto";
import { FaqResponseDto } from "./faq-response.dto";

export type FindOneFaqResponseDto = {
    faq: FaqResponseDto;
    items: FaqItemResponseDto[];
};
