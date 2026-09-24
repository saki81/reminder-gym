import {  useMutation, useQueryClient } from "@tanstack/react-query";
import  { adminApi} from "@/api/adminApi";


export const useActivateGym = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
    mutationFn: (id: string) => adminApi.activateGym(id),
    onSuccess: (_data, id) => {
        queryClient.invalidateQueries({ queryKey: ["admin", "gyms"]});
        queryClient.invalidateQueries({ queryKey: ["admin", "gym", id]})
    },
 });
};