// import { useQuery } from "@tanstack/react-query";

// interface UseAuth {
//     user: Data;
//     status: Status;
// }

// export const AUTH = "auth";

// export const useAuth = () => {
//     const { data, ...rest } = useQuery({
//         queryKey: [AUTH],
//         queryFn: api.getUser,
//         staleTime: Infinity,
//         retry: true,
//         retryOnMount: false
//     });

//     return { user: data, ...rest }
// };

import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Data = object | null;
type Status = 'pending' | 'error' | 'success';

interface UseAuth {
    user: Data;
    status: Status;
}

export const useAuth = (): UseAuth => {
    const [data, setData] = useState<Data>(null);
    const [status, setStatus] = useState<Status>('pending');

    useEffect(() => {
        api.getUser()
            .then((user) => {
                if (user) {
                    setData(user);
                    setStatus('success')
                } else {
                    setData(null);
                    setStatus('error')
                }
            })
            .catch(() => {
                setData(null)
                setStatus('error');
            })
    }, [])

    return { user: data, status }
};


export default useAuth;