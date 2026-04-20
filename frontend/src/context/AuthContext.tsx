// Global auth state. No localStorage — identity comes from httpOnly cookie.

import { createContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "../types/index";

export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
    setLoading: (v: boolean) => void;
    hasRole: (roles: string[]) => boolean
}

export const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = useCallback((user: User) => setUser(user), []);
    const logout = useCallback(() => setUser(null), []);
    const setLoading = useCallback((v: boolean) => setIsLoading(v), []);
    const hasRole = useCallback((roles: string[]) => !!user && roles.includes(user.role),[user])


return (
   <AuthContext.Provider
      value={{
         user,
         isAuthenticated: !!user,
         isLoading,
         login,
         logout,
         setLoading,
         hasRole,
      }}>
      {children}
   </AuthContext.Provider>
  );
}