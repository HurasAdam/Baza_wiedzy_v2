import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"
import {SESSIONS} from "./useSessions";
const useDeleteSession = (sessionId:string) =>{
const queryClient = useQueryClient();

   const{mutate, ...rest} = useMutation({
        mutationFn:()=>{
            return api.deleteSession(sessionId)
        },
        onSuccess:()=>{
        queryClient.invalidateQueries([SESSIONS])
        }
    })
    return {deleteSession:mutate, ...rest}
}

export default useDeleteSession;