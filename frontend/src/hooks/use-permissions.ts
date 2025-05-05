import { useEffect, useMemo, useState } from "react";

const usePermissions = (user) => {
    const [permissions, setPermissions] = useState<[]>([]);
    const [role, setRole] = useState<string | undefined>("");

    useEffect(() => {
        if (user) {
            setPermissions(user?.role?.permissions || []);
            setRole(user?.role?.name);
        }
    }, [user]);

    return useMemo(() => {
        return { role, permissions };
    }, [permissions, role]);
};

export default usePermissions;
