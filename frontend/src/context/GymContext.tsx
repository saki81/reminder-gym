import { createContext, useState, useCallback, type ReactNode } from "react";
import type { Gym } from "@/types";
import { setActiveGymId } from "@/utils/activeGym";

type GymContextType = {
    currentGym: Gym | null;
    setCurrentGym: (gym: Gym) => void;
    clearGym: () => void;
}

export const GymContext = createContext<GymContextType | null>(null);


export function GymProvider({ children }: { children: ReactNode }) {
  const [currentGym, setCurrentGymState] = useState<Gym | null>(null);
 
  const setCurrentGym = useCallback((gym: Gym) => {
    setActiveGymId(gym.id); 
    setCurrentGymState(gym);
  }, []);
 
  const clearGym = useCallback(() => {
    setActiveGymId(null); 
    setCurrentGymState(null);
  }, []);
 
  return (
    <GymContext.Provider
      value={{
        currentGym,
        setCurrentGym,
        clearGym,
      }}
    >
      {children}
    </GymContext.Provider>
  );
}