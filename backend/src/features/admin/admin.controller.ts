import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { createUserAccountDto } from "./dto/create-user-account.dto";
import { AdminService } from "./admin.service";
import { userIdParamsDto } from "./dto/user-id-params-.dto";
import { searchProductsDto } from "../product/dto/search-products.dto";
import { findAdminsDto } from "./dto/find-admins.dto";
import { updateRoleDto } from "../role-permission/dto/update-role-permissions.dto";

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
    findProducts: catchErrors(async ({ query }, res) => {
        const payload = searchProductsDto.parse(query);
        const products = await adminService.findProducts(payload);
        return res.status(OK).json(products);
    }),

    // TODO przenieść do modułu permissions
    findRoles: catchErrors(async ({ query }, res) => {
        const roles = await adminService.findRoles(query);
        return res.status(OK).json(roles);
    }),

    findOneRole: catchErrors(async ({ params }, res) => {
        const { id } = params;
        const role = await adminService.findOneRole(id);
        return res.status(OK).json(role);
    }),

    updateOneRole: catchErrors(async ({ params, body }, res) => {
        const { id } = params;
        const payload = updateRoleDto.parse(body);
        const role = await adminService.updateOneRole(id, payload);
        return res.status(OK).json(role);
    }),

    findAdmins: catchErrors(async ({ query }, res) => {
        const payload = findAdminsDto.parse(query);
        const admins = await adminService.findAdmins(payload);
        return res.status(OK).json(admins);
    }),
});
