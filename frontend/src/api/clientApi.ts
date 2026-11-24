import axios from "axios";
import { getActiveGymId } from "../utils/activeGym";
import { setActiveGymId } from "../utils/activeGym";

export const apiClient = axios.create({
    baseURL: "/api",/* import.meta.env.VITE_API_URL ??*/ /*"http://localhost:5001/api",*/
    withCredentials: true,
    headers: {
    "Content-Type": "application/json",
   }
});


apiClient.interceptors.request.use((config) => {
     const gymId = getActiveGymId();

     if (gymId) {
         config.headers["X-Gym-Id"] = gymId
     }

     return config;
})

// Global Interceptor
apiClient.interceptors.response.use((res) => res, (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";

    
    const ignoredRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/me",
    ];

    const isIgnored = ignoredRoutes.some((r) =>
      url.includes(r)
    );

    // only real session expiry
    if (status === 401 && !isIgnored) {
        setActiveGymId(null); 

      console.warn("Session expired → redirect login");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  } 
);