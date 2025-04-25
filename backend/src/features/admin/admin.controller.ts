import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { createUserAccountDto } from "./dto/create-user-account.dto";
import { AdminService } from "./admin.service";
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
});
