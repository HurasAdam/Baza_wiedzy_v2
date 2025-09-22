import catchErrors from "../../utils/catchErrors";
import { findUsersWithDto } from "../user/dto/find-users-with.dto";
import { StatisticsService } from "./statistics.service";

export const StatisticsController = (statisticsService = StatisticsService) => ({
    findAllUsersStatistics: catchErrors(async ({ query }, res) => {
        console.log(query);
        const payload = findUsersWithDto.parse(query);
        const serviceResponse = await statisticsService.findAllUsersStatistics(payload);
        res.status(200).json(serviceResponse);
    }),
    findMyStatistics: catchErrors(async ({ query }, res) => {}),
});
