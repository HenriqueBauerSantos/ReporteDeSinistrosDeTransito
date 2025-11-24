import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/useAuth";

export function PrivateRoute({ children }: { children: JSX.Element }) {
    const { token, loading } = useAuth();

    if (loading) return <p>Carregando...</p>;

    if (!token) return <Navigate to="/login" />;

    return children;
}
