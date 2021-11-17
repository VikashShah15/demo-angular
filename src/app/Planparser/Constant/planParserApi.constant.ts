import { environment } from 'src/environments/environment';

const ProfileURL = environment.BASE_URL_PROFILE;
const ParsingType = environment.PARSING_TYPE;
const planURL = environment.BASE_URL_AUTHENTICATION;
export const API = {
    plans: {
        planFileUpload: 'submitPlanForAnalysis?filename=$filename',
        getPlanDetails: `getPlanResponse?jobId=$jobId&parsingOptions=${ParsingType}`,
        getDataNextToken: `getPlanResponse?jobId=$jobId&nextToken=$NextToken&parsingOptions=${ParsingType}`,
    },
    profile: {
        sendEmail: `${ProfileURL}user/sendFeedback`,
        addRating: `${ProfileURL}user/addRating`,
    }
};
export const planApi = {
    plan: {
        supportSubCategory: `${planURL}support-sub-category?categoryId={categoryId}`,
        supportSubCategories: `${planURL}support-sub-categories`,
        planType: `${planURL}plan-type`,
        supportCategory: `${planURL}support-category`,
        savePlan: `${planURL}plan`,
        getPlanById: `${planURL}plan/{planId}`,
        updatePlanDetails: `${planURL}plan/{planId}`,
        getId: `${planURL}plan/{planId}`,
        getUserPlan: `${planURL}plans`,
        fileUpload: `${planURL}upload`,
    },
    budget: {
        planByBudgets: `${planURL}budgets/{planId}`,
        updatePlanByBudgets: `${planURL}budgets/{planId}`,
        createBudgetByPlanID: `${planURL}budgets/{planId}`,
        deleteBudgetData: `${planURL}budget/{budgetId}`,
        updateBudgetData: `${planURL}budget/{budgetId}`,
        createBudget: `${planURL}budget`
    },
    goal: {
        planByGoal: `${planURL}goals/{planId}`,
        createPlanGoals: `${planURL}goals/{planId}`,
        updateGoal: `${planURL}goal/{goalId}`,
        goalTypes: `${planURL}goal-type`,
        goalRelatesType: `${planURL}goal-relates-to`,
        goalStatus: `${planURL}goal-statuses`,
        getGoalByPlanId: `${planURL}goal`,
        getGoalData: `${planURL}goal/{goalId}`
    }
};
// export const API = {
//     plans: {
//         planFileUpload: 'plans?filename=$filename',
//         getPlanDetails: 'plans?jobId=$jobId',
//         getDataNextToken: 'plans??NextToken=$NextToken&jobId=$jobId',
//     },

// };
