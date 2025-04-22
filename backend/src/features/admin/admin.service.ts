import { CONFLICT } from "@/constants/http";
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
};
