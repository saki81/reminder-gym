import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { gymApi } from "@/api/gymApi";
import { useAuth } from "../shared/useAuth";
import { useGym } from "../shared/useGym";
import { useToast } from "../shared/useToast";
import type { CreateGym } from "@/types";


export function useCreateGym() {
  const { user, login } = useAuth();
  const { setCurrentGym } = useGym();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast() 


  return useMutation({
    mutationFn: (data: CreateGym) => gymApi.createGym(data),
       
    onSuccess: (res) => {
      const gym = res.data.gym;
 
      // Lokal update user sa activeGymId
      if (user) {
        login({ ...user, gymId: gym.id });
      }
 
      //put activ gym in GymContext
      setCurrentGym(gym);
 
      // Invalid my-gyms query list refresh
      queryClient.invalidateQueries({ queryKey: ["my-gyms"] });
 
      toast.success(`${gym.gymName} created successfully!`);
      navigate("/dashboard", { replace: true });
    },
 

    })
}