import { FORBIDDEN } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import catchErrors from "@/utils/catchErrors";
import { PermissionType } from "../enums/role.enum";
import { UserService } from "../features/user/user.service";

const permissionGuard = (permissions: PermissionType | PermissionType[]) =>
    catchErrors(async (req, res, next) => {
        const userId = req.userId;

        const user = await UserService.findOne(userId.toString());
        appAssert(user, FORBIDDEN, "User not found");

        const rolePermissions = (user.role as any)?.permissions ?? [];

        const permsToCheck = Array.isArray(permissions) ? permissions : [permissions];
        const hasPermission = permsToCheck.some((p) => rolePermissions.includes(p));

        appAssert(
            hasPermission,
            FORBIDDEN,
            "Access denied: insufficient permissions to execute the requested operation"
        );

        next();
    });

export default permissionGuard;
