import { useQueryClient } from "@tanstack/react-query";
import type { User } from "./auth/useCheckUser";
// import { useEffect, useMemo, useState } from "react";

// const usePermissions = (user) => {
//     const [permissions, setPermissions] = useState<[]>([]);
//     const [role, setRole] = useState<string | undefined>("");

//     useEffect(() => {
//         if (user) {
//             setPermissions(user?.role?.permissions || []);
//             setRole(user?.role?.name);
//         }
//     }, [user]);

//     return useMemo(() => {
//         return { role, permissions };
//     }, [permissions, role]);
// };

const usePermissions = () => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>(["user"])!;

    const hasPermission = (perm: string) => {
        return user.role.permissions.includes(perm);
    };

    const hasPermissions = (perms: string[] | string) => {
        if (typeof perms === "string") {
            perms = perms.split(" ");
        }

        return perms.every((perm) => user.role.permissions.includes(perm));
    };

    return {
        hasPermission,
        hasPermissions,
    };
};

export default usePermissions;
