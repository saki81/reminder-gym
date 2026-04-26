import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext.tsx";
//import { GymProvider }  from "./context/GymContext";
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry on 401/403 — session is gone, not a transient error
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) return false;
        return failureCount < 1;
      },
 
      // Data stays fresh for 5 min — no unnecessary re-fetches
      staleTime: 1000 * 60 * 5,
 
      // Don't re-fetch just because the user switched browser tabs
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Never retry mutations — user needs to know immediately if it failed
      retry: 0,
    },
  },
});

const root = document.getElementById("root");

if (!root) {
  throw new Error(
    'Root element not found. Make sure <div id="root"> exists in index.html.'
  );
}


createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>  
         {/* <GymProvider> */}
            <App />
         {/* </GymProvider> */}    
        </AuthProvider>
      </BrowserRouter>
 
      {/* React Query devtools — only visible in development */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>

  </StrictMode>
);
