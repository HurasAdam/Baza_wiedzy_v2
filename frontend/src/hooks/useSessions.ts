import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/api";

export const SESSIONS = "sessions";

const useSessions= (opts={})=>{

const{data:sessions =[], ...rest}=useQuery({
    queryKey:[SESSIONS],
    queryFn:()=>{
      return  api.getSessions()
       
    },
    ...opts
})

return{
    sessions, ...rest
} 
}

export default useSessions;