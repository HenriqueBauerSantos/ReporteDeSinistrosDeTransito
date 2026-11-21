import axios from "axios";

export type CustomResponse<T> =
    | { success: true; data: T; message?: string }
    | {
        success: false;
        errors?: unknown;
        message?: string;
        title?: string;
        detail?: string;
    };

export function getApiResponseData<T>(response: CustomResponse<T>, fallback: string): T {
    if (!response || typeof response !== "object" || !response.success) {
        throw new Error(getApiErrorMessage(response, fallback));
    }

    if (!("data" in response) || response.data === undefined) {
        throw new Error("A API retornou uma resposta sem os dados esperados.");
    }

    return response.data;
}

export function getApiResponseList<T>(response: CustomResponse<T[]>, fallback: string): T[] {
    const data = getApiResponseData(response, fallback);
    if (!Array.isArray(data)) {
        throw new Error("A API retornou uma lista inválida.");
    }

    return data;
}

function getMessages(value: unknown): string[] {
    if (typeof value === "string") {
        return value.trim() ? [value.trim()] : [];
    }

    if (Array.isArray(value)) {
        return value.flatMap(getMessages);
    }

    if (value && typeof value === "object") {
        return Object.values(value).flatMap(getMessages);
    }

    return [];
}

function getErrorBodyMessages(body: unknown): string[] {
    if (!body || typeof body !== "object" || Array.isArray(body)) return [];

    const record = body as Record<string, unknown>;
    return [
        ...getMessages(record.errors),
        ...getMessages(record.title),
        ...getMessages(record.detail),
        ...getMessages(record.message),
    ];
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
    const body = axios.isAxiosError(error) ? error.response?.data : error;
    const bodyMessages = getErrorBodyMessages(body);
    if (bodyMessages.length > 0) {
        return [...new Set(bodyMessages)].join("\n");
    }

    if (typeof body === "string" && body.trim()) return body.trim();
    if (axios.isAxiosError(error) && error.message) return error.message;
    if (error instanceof Error && error.message) return error.message;

    return fallback;
}

export const Api = axios.create({
    baseURL: "https://localhost:7097",
    headers: {
        "Content-Type": "application/json",
    },
});

//Adiciona token JWT automaticamente em cada requisição
Api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default Api;