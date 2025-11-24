import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../../Services/Api.ts";
import { useAuth } from "../../Auth/useAuth.ts";
import { AxiosError } from "axios";
import "./Index.css"

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
            const response = await Api.post("/api/entrar", {
                email,
                password
            });

            const token = response.data.data.accessToken;
            login?.(token);
            navigate("/");
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response?.status === 400) {
                setErrorMessage("E-mail ou senha inválidos.");
            } else {
                setErrorMessage("Erro inesperado. Tente novamente.");
            }
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Entrar</h2>

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
            </div>
        </div>
    );
}
