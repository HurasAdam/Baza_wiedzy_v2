import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import catchErrors from "../../utils/catchErrors";
import { FaqItemModel } from "./faq-item.model";

export const FaqItemController = () => ({
    create: catchErrors(async ({ userId, body, params }, res) => {
        return res.status(OK).json({ message: "Dodano nowy faq item", data: "FAQ" });
    }),

    deleteOne: catchErrors(async ({ userId, body, params }, res) => {
        const { faqItemId } = params;
        const faqItem = await FaqItemModel.findById({ _id: faqItemId });
        appAssert(faqItem, NOT_FOUND, "Faq item not found");

        const deletedFaqItem = await FaqItemModel.findByIdAndDelete({ _id: faqItemId });
        appAssert(deletedFaqItem, INTERNAL_SERVER_ERROR, "Something went wrong");

        return res.status(OK).json({ message: "Faq item has been delted" });
    }),
});
