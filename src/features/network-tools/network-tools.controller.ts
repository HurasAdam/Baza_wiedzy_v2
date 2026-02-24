import { OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { NetworkToolsService } from "./network-tools.service";

export const NetworkToolsController = (networkToolsService = NetworkToolsService) => ({
    dnsLookup: catchErrors(async ({ userId, query, params }, res) => {
        const { domain, resolver = "google", recordType = "ALL" } = query as Record<string, string>;

        const serviceResponse = await networkToolsService.dnsLookup(domain, resolver, recordType);

        return res.status(OK).json(serviceResponse);
    }),
});
