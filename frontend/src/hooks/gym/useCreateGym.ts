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
 
      // Lokalno updatujemo user sa activeGymId
      if (user) {
        login({ ...user, gymId: gym.id });
      }
 
      // Postavljamo aktivan gym u GymContext
      setCurrentGym(gym);
 
      // Invalidujemo my-gyms query da se lista osvježi
      queryClient.invalidateQueries({ queryKey: ["my-gyms"] });
 
      toast.success(`${gym.gymName} created successfully!`);
      navigate("/dashboard", { replace: true });
    },
 

    })
}