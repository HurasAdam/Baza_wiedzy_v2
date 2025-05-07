import { CONFLICT, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";

import UserModel from "../user/user.model";

import { DEFAULT_TEMP_PASSWORD } from "@/constants/env";
import { SearchProductsDto } from "../product/dto/search-products.dto";
import ProductModel from "../product/product.model";
import RoleModel from "../role-permission/roles-permission.model";
import SessionModel from "../session/session.model";

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
            password: payload.password,
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
            user.mustChangePassword = true;
            await user.save();
        }

        await SessionModel.deleteMany({ userId: params });

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

    async findRoles(query) {
        const withPerms = query.withPermissions === "true" || query.withPermissions === true;
        const baseFields = ["-createdAt", "-updatedAt"];

        const selectFields = withPerms
            ? baseFields // z permissions, więc tylko wykluczamy daty
            : ["-permissions", ...baseFields]; // bez permissions

        const roles = await RoleModel.find({})
            .select(selectFields as string[])
            .sort({ createdAt: 1 })
            .lean();
        return roles;
    },
    async findOneRole(roleId: string) {
        const role = await RoleModel.find({ _id: roleId });

        return role;
    },

    async updateOneRole(roleId: string, payload) {
        const role = await RoleModel.findById(roleId);
        appAssert(role, NOT_FOUND, "Role not found");
        console.log(payload, "AKTULIZACJI UPRWANIEŃ");
        role.permissions = payload || role.permissions;
        await role.save();
    },

    async findProducts(query: SearchProductsDto) {
        const { name, limit, page, sortBy, sortAt } = query;
        const querydb: any = {};

        if (name?.trim()) {
            querydb.name = new RegExp(name.trim(), "i");
        }

        const skip = (page - 1) * limit;

        const pipeline: any[] = [
            { $match: querydb },
            {
                $lookup: {
                    from: "articles",
                    localField: "_id",
                    foreignField: "product",
                    as: "articles",
                },
            },
            {
                $addFields: {
                    articlesCount: { $size: "$articles" },
                },
            },

            {
                $project: {
                    name: 1,
                    labelColor: 1,
                    banner: 1,
                    articlesCount: 1,
                },
            },
            { $skip: skip },
            { $limit: limit },
        ];

        const data = await ProductModel.aggregate(pipeline);

        const total = await ProductModel.countDocuments(querydb);
        const pages = Math.ceil(total / limit);

        return {
            data,
            pagination: { total, page, pages },
        };
    },

    async findAdmins(query) {
        const querydb: any = {};
        const name = query.name?.trim();

        if (name) {
            querydb.name = new RegExp(name, "i");
        }

        const adminRole = await RoleModel.findOne({ name: "ADMIN" });
        if (adminRole) {
            querydb.role = adminRole._id;
        } else {
            // jeżeli nie ma takiej roli w DB, zwracamy pustą listę
            return [];
        }

        console.log(query, "USER QUERY");
        const users = await UserModel.find(querydb)
            .select(["-password", "-email", "-verified", "-createdAt", "-updatedAt", "-favourites"])
            .populate({
                path: "role",
                select: "name ", // wybieramy tylko te pola z roli
            });
        return users;
    },
};
