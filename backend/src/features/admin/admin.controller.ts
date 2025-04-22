import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { createUserAccountDto } from "./dto/create-user-account.dto";
import { AdminService } from "./admin.service";

export const AdminController = (adminService = AdminService) => ({
    createUserAccount: catchErrors(async ({ userId, body }, res) => {
        const payload = createUserAccountDto.parse(body);
        const { user, message } = await adminService.createUserAccount(payload);

        return res.status(OK).json({ message, user });
    }),
});
