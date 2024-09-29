import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";


export const AUTH = "auth";

const useAuth = (opts = {}) => {
  const { data: user, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn:()=>{
        return  api.getUser()
    },
    staleTime: Infinity,
    ...opts,
  });
  

  return {
    user,
    ...rest,
  };
};

export default useAuth;