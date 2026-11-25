import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Api,
    getApiErrorMessage,
    getApiResponseData,
    type CustomResponse,
} from "../../Services/Api.ts";
import { useAuth } from "../../Auth/useAuth.ts";
import "../LoginPage/Index.css";

type RegisterResponseData = {
    accessToken: string;
    expiresIn: number;
    userToken: {
        id: string;
        name: string;
        email: string;
        claims: unknown;
    };
};

export function RegisterPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMessage("");

        if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
            setErrorMessage("Os e-mails informados não coincidem.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("As senhas informadas não coincidem.");
            return;
        }

        try {
            const response = await Api.post<CustomResponse<RegisterResponseData>>(
                "/api/nova-conta",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    confirmPassword,
                },
            );

            const registerData = getApiResponseData(
                response.data,
                "Não foi possível criar a conta.",
            );
            if (!registerData.accessToken) {
                throw new Error("A API não retornou um token de acesso.");
            }

            login(registerData.accessToken);
            navigate("/sobre", { replace: true });
        } catch (err: unknown) {
            setErrorMessage(getApiErrorMessage(err, "Erro inesperado. Tente novamente."));
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="page-title">Criar conta</h2>

                {errorMessage && <p className="error-text">{errorMessage}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome do usuário"
                        aria-label="Nome do usuário"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="E-mail"
                        aria-label="E-mail"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Confirmar e-mail"
                        aria-label="Confirmar e-mail"
                        autoComplete="off"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        aria-label="Senha"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirmar senha"
                        aria-label="Confirmar senha"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Criar conta</button>
                </form>

                <Link to="/login" className="auth-link-button">
                    Já tenho uma conta
                </Link>
            </div>
        </div>
    );
}
