import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Api,
    getApiErrorMessage,
    getApiResponseData,
    type CustomResponse,
} from "../../Services/Api.ts";
import { useAuth } from "../../Auth/useAuth.ts";
import "./Index.css"

type LoginResponseData = {
    accessToken: string;
    expiresIn: number;
    userToken: {
        id: string;
        name: string;
        email: string;
        claims: unknown;
    };
};

export function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await Api.post<CustomResponse<LoginResponseData>>("/api/entrar", {
                email,
                password
            });

            const loginData = getApiResponseData(response.data, "Não foi possível entrar.");
            if (!loginData.accessToken) {
                throw new Error("A API não retornou um token de acesso.");
            }

            login(loginData.accessToken);
            navigate("/sobre", { replace: true });
        } catch (err: unknown) {
            setErrorMessage(getApiErrorMessage(err, "Erro inesperado. Tente novamente."));
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="page-title">Entrar</h2>

                {errorMessage && <p className="error-text">{errorMessage}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Entrar</button>
                </form>

                <Link to="/criar-conta" className="auth-link-button">
                    Criar conta
                </Link>
            </div>
        </div>
    );
}
