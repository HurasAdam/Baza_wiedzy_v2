import { CREATED, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { changeUserPasswordDto } from "./dto/change-user-password.dto";
import { findUsersWithDto } from "./dto/find-users-with.dto";
import { findUsersDto } from "./dto/find-users.dto";
import { updateUserDto } from "./dto/request-dto/update-user.dto";
import { UserService } from "./user.service";

export const UserController = (userService = UserService) => ({
    findMe: catchErrors(async ({ userId }, res) => {
        const user = await userService.findOne(userId);
        return res.status(OK).json(user);
    }),

    findOne: catchErrors(async ({ params }, res) => {
        const user = await userService.findOne(params.id);
        return res.status(OK).json(user);
    }),

    updateMe: catchErrors(async ({ userId, body }, res) => {
        const payload = updateUserDto.parse(body);
        await userService.updateMe(userId, payload);
        return res.send(CREATED);
    }),

    updateAvatar: catchErrors(async (req, res) => {
        // const payload = updateUserDto.parse(body);
        const userId = req.userId;
        const file = req.file;
        console.log(file);
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        await userService.updateAvatar(userId, file);
        return res.send(CREATED);
    }),

    findAll: catchErrors(async ({ query }, res) => {
        const payload = findUsersDto.parse(query);
        const users = await userService.findAll(payload);
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
