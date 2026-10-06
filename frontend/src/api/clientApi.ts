import axios from "axios";

export const apiClient = axios.create({
    baseURL: "/api",/* import.meta.env.VITE_API_URL ??*/ /*"http://localhost:5001/api",*/
    withCredentials: true,
    headers: {
    "Content-Type": "application/json",
   }
});

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
      console.warn("Session expired → redirect login");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  } 
);