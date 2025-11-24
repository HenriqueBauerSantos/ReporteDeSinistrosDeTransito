import { createContext } from "react";
import type { UserPermissions } from "./AuthTypes";

interface AuthContextValue {
    token: string | null;
    permissions: UserPermissions | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
