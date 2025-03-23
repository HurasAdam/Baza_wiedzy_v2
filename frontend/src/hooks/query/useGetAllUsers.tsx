import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { api } from "../../lib/api";

const useGetAllUsers = ({ skip = false }) => {
    const query = useQuery({
        queryKey: ["allUsers"],
        queryFn: () => {
            return api.getUsers();
        },
        staleTime: Infinity,
        placeholderData: skip ? undefined : keepPreviousData,
        enabled: !skip,
    });
    return query;
};

export default useGetAllUsers;
