import catchErrors from "../../utils/catchErrors";
import { findUsersWithDto } from "../user/dto/find-users-with.dto";
import { dateRangeFilterDto } from "./dto/request-dto/date-range-filter.dto";
import { StatisticsService } from "./statistics.service";
export const StatisticsController = (statisticsService = StatisticsService) => ({
    findAllUsersStatistics: catchErrors(async ({ query }, res) => {
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

    exportUsersStatistics: catchErrors(async ({ query }, res) => {
        const payload = findUsersWithDto.parse(query);
        const users = await statisticsService.findAllUsersStatistics(payload);

        const exportRows = users.map((u) => ({
            name: u.name,
            surname: u.surname,
            email: u.email,
            articlesAdded: u.stats?.articlesAdded ?? 0,
            articlesEdited: u.stats?.articlesEdited ?? 0,
            conversationTopics: u.stats?.conversationTopics ?? 0,
        }));

        const buffer = await statisticsService.generateUsersExcel(exportRows);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=statystyki_uzytkownikow.xlsx`);
        res.send(buffer);
    }),
});
