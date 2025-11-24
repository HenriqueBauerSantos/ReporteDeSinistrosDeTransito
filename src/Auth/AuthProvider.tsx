import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { parseClaims } from "./parseClaims";

import type { ReactNode } from "react";
import type { AuthState } from "./AuthTypes";

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {

    const [auth, setAuth] = useState<AuthState>({
        token: null,
        permissions: null
    });

    function login(token: string) {
        const permissions = parseClaims(token);

        setAuth({ token, permissions });
        localStorage.setItem("authToken", token);
    }

    function logout() {
        localStorage.removeItem("authToken");
        setAuth({ token: null, permissions: null });
    }

    const isAuthenticated = !!auth.token;

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) login(token);
    }, []);

    return (
        <AuthContext.Provider value={{
            ...auth,
            login,
            logout,
            isAuthenticated,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
