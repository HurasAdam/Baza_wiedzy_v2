import { OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";

export const FaqItemController = () => ({
    create: catchErrors(async ({ userId, body, params }, res) => {
        return res.status(OK).json({ message: "Dodano nowy faq item", data: "FAQ" });
    }),
});
