 
import { useContext } from "react";
import { GymContext } from "@/context/GymContext";
 
export function useGym() {
  const context = useContext(GymContext);
 
  if (!context) {
    throw new Error(
      "useGym() must be used inside <GymProvider>. " +
        "Make sure <GymProvider> wraps your app in main.tsx."
    );
  }
 
  return context;
}
 

