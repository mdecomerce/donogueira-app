export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    createdAt?: string;
}

export interface AuthUser extends User {
    token?: string;
}
