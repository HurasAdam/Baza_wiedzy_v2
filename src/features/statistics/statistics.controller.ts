import catchErrors from "../../utils/catchErrors";
import { findUsersWithDto } from "../user/dto/find-users-with.dto";
import { dateRangeFilterDto } from "./dto/request-dto/date-range-filter.dto";
import { StatisticsService } from "./statistics.service";

export const StatisticsController = (statisticsService = StatisticsService) => ({
    findAllUsersStatistics: catchErrors(async ({ query }, res) => {
        console.log(query);
        const payload = findUsersWithDto.parse(query);
        const serviceResponse = await statisticsService.findAllUsersStatistics(payload);
        res.status(200).json(serviceResponse);
    }),
    findUserAddedArticles: catchErrors(async ({ params, query }, res) => {
        const { id: userId } = params;
        const payload = dateRangeFilterDto.parse(query);
        const serviceResponse = await statisticsService.findUserAddedArticles(userId, payload);
        res.status(200).json(serviceResponse);
    }),

    findUserEditedArticles: catchErrors(async ({ params, query }, res) => {
        const { id: userId } = params;
        const payload = findUsersWithDto.parse(query);
        const serviceResponse = await statisticsService.findUserEditedArticles(userId, payload);
        res.status(200).json(serviceResponse);
    }),
    findUserConversationReports: catchErrors(async ({ params, query }, res) => {
        const { id: userId } = params;
        const payload = findUsersWithDto.parse(query);
        const serviceResponse = await statisticsService.findUserConversationReports(userId, payload);
        res.status(200).json(serviceResponse);
    }),
    findMyStatistics: catchErrors(async ({ query }, res) => {}),
});
