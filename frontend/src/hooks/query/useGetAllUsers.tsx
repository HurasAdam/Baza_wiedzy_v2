import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/user.api";

const useGetAllUsers = ({ skip = false }) => {
    const query = useQuery({
        queryKey: ["allUsers"],
        queryFn: () => {
            return () => userApi.findAll();
        },
        staleTime: Infinity,
        placeholderData: skip ? undefined : keepPreviousData,
        enabled: !skip,
    });
    return query;
};

export default useGetAllUsers;
