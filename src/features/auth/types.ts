/**
 * Tipos centralizados de autenticação
 * Única fonte de verdade para User, LoginRequest, LoginResponse
 */

export interface User {
    id: number;
    nome: string;
    empresas: number[];
}

export interface LoginRequest {
    codigoUsuario: number;
    senha: string;
}

export interface LoginResponse {
    status: string;
    data: {
        id: number;
        nome: string;
        empresas: number[];
        token: string;
    };
}
