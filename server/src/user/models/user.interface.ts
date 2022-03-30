export interface UserI {
    id?: number;
    username?: string;
    email: string;
    password?: string;
    securityQuestion?: string;
    securityAnswer?: string;
}