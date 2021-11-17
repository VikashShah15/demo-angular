import { environment } from 'src/environments/environment';
const AuthServer = environment.BASE_URL_AUTH_SERVER;

export const API = {
    plans: {
        planFileUpload: 'submitPlanForAnalysis?filename=$filename',
        getPlanDetails: 'getPlanResponse?jobId=$jobId&parsingOptions=TABLES',
        getDataNextToken: 'getPlanResponse?jobId=$jobId&nextToken=$NextToken&parsingOptions=TABLES'
    }
};
export const authApi = {
    auth: {
        requestEmailVerification: 'request-email-verification?email={email}',
        registration: 'registration?verificationCode={verificationCode}',
        login: 'login',
        verifyEmail: 'verify-email?token={token}',
        currentPassword: 'current-password',
        changePassword: 'change-password?userId={userId}',
        resetPassword: 'reset-password?token={token}',
        forgetPassword: 'request-reset-password?email={email}',
        verifyResetPasswordToken : 'verify-reset-password-token?token={token}',
        refreshToken : `${AuthServer}auth/oauth/token`
    }
};
