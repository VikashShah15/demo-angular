

import { environment } from 'src/environments/environment';

const GetURL = environment.BASE_URL_GET;
const PostURL = environment.BASE_URL_POST;
const ProfileURL = environment.BASE_URL_PROFILE;
const goalURL = environment.BASE_URL_AUTHENTICATION;

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
    goal: {
        getGoalByPlan: `${goalURL}goals/{planId}`,
        deleteGoalTrackingData: `${goalURL}goal-tracking/{goalTrackingId}`,
        deleteGoalData: `${goalURL}goal/{goalId}`,
        getGoalTrackingData: `${goalURL}goal-trackings/{goalId}`,
        updateGoalTrackingData: `${goalURL}goal-tracking/{goalTrackingId}`,
        getGoalTractById: `${goalURL}goal-tracking/{goalTrackingId}`,
        createGoalTracking: `${goalURL}goal-tracking`,
        createGoal: `${goalURL}goal`,
        goalStatus: `${goalURL}goal-statuses`,
        getGoalData: `${goalURL}goal/{goalId}`,
        updateGoalData: `${goalURL}goal/{goalId}`
    }
};

// export const API = {
//     plans: {
//         planFileUpload: 'plans?filename=$filename',
//         getPlanDetails: 'plans?jobId=$jobId',
//         getDataNextToken: 'plans??NextToken=$NextToken&jobId=$jobId',
//     },

// };
