import axios from "axios";

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