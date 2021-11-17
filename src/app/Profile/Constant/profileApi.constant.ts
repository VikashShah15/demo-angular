

import { environment } from 'src/environments/environment';

const GetURL = environment.BASE_URL_GET;
const PostURL = environment.BASE_URL_POST;
const ProfileURL = environment.BASE_URL_PROFILE;
const AuthURL = environment.BASE_URL_AUTHENTICATION;
export const API = {
    plans: {
        planFileUpload: 'submitPlanForAnalysis?filename=$filename',
        getPlanDetails: 'getPlanResponse?jobId=$jobId&parsingOptions=TABLES',
        getDataNextToken: 'getPlanResponse?jobId=$jobId&nextToken=$NextToken&parsingOptions=TABLES',

    },
    profile: {
        sendEmail: `${ProfileURL}user/sendFeedback`,
        addRating: `${ProfileURL}user/addRating`,

    },

};
export const authApi = {
    auth: {
        requestEmailVerification: 'request-email-verification?email={email}',
        registration: 'registration?verificationCode={verificationCode}',
        login: 'login',
        verifyEmail: 'verify-email?token={token}',
        currentPassword: 'current-password',
        changePassword: 'change-password',
        resetPassword: 'reset-password?token={token}',
        forgetPassword: 'request-reset-password?email={email}',
        verifyResetPasswordToken: 'verify-reset-password-token?token={token}',
        profileUpdate: 'profile-update?userId={userId}',
        getUserPlan: `plans`,
    }
};
// export const API = {
//     plans: {
//         planFileUpload: 'plans?filename=$filename',
//         getPlanDetails: 'plans?jobId=$jobId',
//         getDataNextToken: 'plans??NextToken=$NextToken&jobId=$jobId',
//     },

// };
