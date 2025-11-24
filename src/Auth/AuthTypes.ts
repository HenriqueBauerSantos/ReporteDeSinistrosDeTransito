// Tipos utilizados em toda a autenticação

// Uso de type-only import será automático porque são só types aqui
export type UserPermissions = Record<string, string[]>;

export interface DecodedToken {
    [key: string]: unknown;
}

// Estado de autenticação usado no AuthProvider
export interface AuthState {
    token: string | null;
    permissions: UserPermissions | null;
}
