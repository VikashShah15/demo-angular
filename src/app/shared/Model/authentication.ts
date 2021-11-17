export interface Registration {
    firstName: string;
    lastName: string;
    phoneNumber: number;
    password: string;
}
export interface Login {
    email: string;
    password: string;
}
export interface ResetPassword {
    newPassword: string;
    cpwd: string;
}
