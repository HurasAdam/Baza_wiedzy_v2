import { CREATED, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { objectIdParam } from "../../common/dto/params-id.dto";
import { PERMISSIONS_LIST } from "../../constants/permissions";
import { searchProductsDto } from "../product/dto/search-products.dto";
import { searchRolesDto } from "../role-permission/dto/search-roles.dto";
import { updateRoleDto } from "../role-permission/dto/update-role-permissions.dto";
import { updateUserDto } from "../user/dto/request-dto/update-user.dto";
import { AdminService } from "./admin.service";
import { changeUserRoleBodyDto } from "./dto/change-user-role-body.dto";
import { createUserAccountDto } from "./dto/create-user-account.dto";
import { findAdminsDto } from "./dto/find-admins.dto";
import { userIdParamsDto } from "./dto/user-id-params-.dto";

export const AdminController = (adminService = AdminService) => ({
    createUserAccount: catchErrors(async ({ userId, body }, res) => {
        const payload = createUserAccountDto.parse(body);
        const { user, message } = await adminService.createUserAccount(payload);
        return res.status(OK).json({ message, user });
    }),
    disableUserAccount: catchErrors(async ({ params }, res) => {
        const payload = userIdParamsDto.parse(params);
        const { message } = await adminService.disableUserAccount(payload.id);
        return res.status(OK).json({ message });
    }),
    enableUserAccount: catchErrors(async ({ params }, res) => {
        const payload = userIdParamsDto.parse(params);
        const { message } = await adminService.enableUserAccount(payload.id);
        return res.status(OK).json({ message });
    }),
    resetUserPassword: catchErrors(async ({ params }, res) => {
        const payload = userIdParamsDto.parse(params);
        const { message } = await adminService.resetUserPassword(payload.id);
        return res.status(OK).json(message);
    }),

    changeUserRole: catchErrors(async ({ params, body }, res) => {
        const { id } = userIdParamsDto.parse(params);
        const payload = changeUserRoleBodyDto.parse(body);
        const { message } = await adminService.changeUserRole(id, payload);
        return res.status(OK).json(message);
    }),

    updateUser: catchErrors(async ({ params, body }, res) => {
        const { id } = objectIdParam("id").parse(params);
        const payload = updateUserDto.parse(body);
        await adminService.updateUser(id, payload);
        return res.send(CREATED);
    }),

    findProducts: catchErrors(async ({ query }, res) => {
        const payload = searchProductsDto.parse(query);
        const products = await adminService.findProducts(payload);
        return res.status(OK).json(products);
    }),

    createRole: catchErrors(async ({ userId, body }, res) => {
        const payload = updateRoleDto.parse(body);
        const role = await adminService.createRole(payload);
        return res.sendStatus(CREATED);
    }),
    // TODO przenieść do modułu permissions
    findRoles: catchErrors(async ({ query }, res) => {
        const payload = searchRolesDto.parse(query);
        const roles = await adminService.findRoles(payload);
        return res.status(OK).json(roles);
    }),

    findOneRole: catchErrors(async ({ params }, res) => {
        const { id } = params;
        const role = await adminService.findOneRole(id);
        return res.status(OK).json(role);
    }),

    updateOneRole: catchErrors(async ({ params, body }, res) => {
        const { id } = params;
        console.log(body);
        const payload = updateRoleDto.parse(body);
        const role = await adminService.updateOneRole(id, payload);
        return res.status(OK).json(role);
    }),

    findAdmins: catchErrors(async ({ query }, res) => {
        const payload = findAdminsDto.parse(query);
        const admins = await adminService.findAdmins(payload);
        return res.status(OK).json(admins);
    }),

    findPermissions: catchErrors(async (_, res) => {
        return res.status(OK).json(PERMISSIONS_LIST);
    }),
});
