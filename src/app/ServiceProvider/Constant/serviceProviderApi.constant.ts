

import { environment } from 'src/environments/environment';

const GetURL = environment.BASE_URL_GET;
const PostURL = environment.BASE_URL_POST;
const ProfileURL = environment.BASE_URL_PROFILE;
export const API = {
    plans: {
        planFileUpload: 'submitPlanForAnalysis?filename=$filename',
        getPlanDetails: 'getPlanResponse?jobId=$jobId&parsingOptions=TABLES',
        getDataNextToken: 'getPlanResponse?jobId=$jobId&nextToken=$NextToken&parsingOptions=TABLES',

    },
    profile: {
        sendEmail: `${ProfileURL}user/sendFeedback`,
        addRating: `${ProfileURL}user/addRating`,

    }
};

// export const API = {
//     plans: {
//         planFileUpload: 'plans?filename=$filename',
//         getPlanDetails: 'plans?jobId=$jobId',
//         getDataNextToken: 'plans??NextToken=$NextToken&jobId=$jobId',
//     },

// };
