import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { UserService } from "./user.service";
import { findUsersWithDto } from "./dto/find-users-with.dto";
import { changeUserPasswordDto } from "./dto/change-user-password.dto";

export const UserController = (userService = UserService) => ({
    findMe: catchErrors(async ({ userId }, res) => {
        const user = await userService.findOne(userId);
        return res.status(OK).json(user);
    }),

    findOne: catchErrors(async ({ params }, res) => {
        const user = await userService.findOne(params.id);
        return res.status(OK).json(user);
    }),

    findAll: catchErrors(async (_, res) => {
        const users = await userService.findAll();
        return res.status(OK).json(users);
    }),

    findWithReportCount: catchErrors(async ({ query }, res) => {
        const payload = findUsersWithDto.parse(query);
        const result = await userService.findWithReportCount(payload);
        return res.status(OK).json(result);
    }),

    findWithFavouriteArticles: catchErrors(async ({ userId, query }, res) => {
        const result = await userService.findWithFavouriteArticles(userId, query);
        res.status(OK).json(result);
    }),

    findWithArticleCount: catchErrors(async ({ query }, res) => {
        const payload = findUsersWithDto.parse(query);
        const result = await userService.findWithArticleCount(payload);
        return res.status(OK).json(result);
    }),

    findWithChangeCount: catchErrors(async ({ query }, res) => {
        const payload = findUsersWithDto.parse(query);
        const result = await userService.findWithChangeCount(payload);
        return res.status(OK).json(result);
    }),
    changePassword: catchErrors(async ({ userId, body }, res) => {
        console.log(body, "BODY");
        const payload = changeUserPasswordDto.parse(body);
        const { message } = await userService.changePassword(userId, payload);
        res.status(OK).json(message);
    }),
});
