import { CONFLICT, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";

import UserModel from "../user/user.model";

import { DEFAULT_TEMP_PASSWORD } from "@/constants/env";

export const AdminService = {
    async createUserAccount(payload) {
        const existingUser = await UserModel.exists({
            email: payload.email,
        });
        appAssert(!existingUser, CONFLICT, "Email already in use");

        const user = await UserModel.create({
            name: payload.name,
            surname: payload.surname,
            email: payload.email,
            password: DEFAULT_TEMP_PASSWORD,
            role: payload.role,
        });

        return {
            user: user.omitPassword(),
            message: "Account has been created successfully",
        };
    },
    async disableUserAccount(params: string) {
        const user = await UserModel.findById(params);
        appAssert(user, NOT_FOUND, "User not found");

        if (user.isActive) {
            user.isActive = false;
            await user.save();
        }
        return { message: "User account has been disabled" };
    },

    async enableUserAccount(params: string) {
        const user = await UserModel.findById(params);
        appAssert(user, NOT_FOUND, "User not found");

        if (!user.isActive) {
            user.isActive = true;
            await user.save();
        }
        return { message: "User account has been enabled" };
    },

    async resetUserPassword(params: string) {
        const user = await UserModel.findById(params);
        appAssert(user, NOT_FOUND, "User not found");

        user.password = DEFAULT_TEMP_PASSWORD;
        user.mustChangePassword = true;
        await user.save();
        return { message: "User password has been reset to default" };
    },
};
