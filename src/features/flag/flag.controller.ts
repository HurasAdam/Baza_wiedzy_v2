import { CREATED } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { FlagService } from "./flag.service";

export const FlagController = (flagService = FlagService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const serviceResponse = await flagService.create(userId, body);
        return res.status(CREATED).json({ message: "Dodano nową flagę", data: serviceResponse });
    }),

    findMyFlags: catchErrors(async ({ userId }, res) => {
        const serviceResponse = await flagService.findMyFlags(userId);
        return res.status(200).json(serviceResponse);
    }),

    findOne: catchErrors(async ({ userId, params }, res) => {
        const { flagId } = params;
        const serviceResponse = await flagService.findOne(userId, flagId);
        return res.status(200).json(serviceResponse);
    }),

    findMyFlagsWithStats: catchErrors(async ({ userId }, res) => {
        const flags = await flagService.findMyFlagsWithStats(userId);
        return res.status(200).json(flags);
    }),

    updateOne: catchErrors(async ({ userId, body, params }, res) => {
        const { flagId } = params;

        const serviceResponse = await flagService.updateOne(userId, flagId, body);

        return res.status(200).json({
            message: "Zaktualizowano flagę",
            data: serviceResponse,
        });
    }),
});
