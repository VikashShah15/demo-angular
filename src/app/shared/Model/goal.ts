export interface GoalModel {
    achievementMethod: string;
    createdDate: string;
    description: string;
    fundingSource: string;
    goalEndDate: string;
    goalId: string;
    goalManagedTypeId: number;
    goalRelatesToId: number;
    goalStartDate: string;
    goalStatusId: number;
    goalTypeId: number;
    isDeleted: boolean;
    lastUpdated: string;
    lastUpdatedBy: string;
    participantId: string;
    planId: string;
    goalType: string;
}
export interface GoalRelatesType {
    goalRelatesToId: number;
    title: string;
}
export interface GoalType {
    goalTypeId: number;
    title: string;
}
export interface GoalStatues {
    goalStatusId: number;
    title: string;
}
export interface GoalData {
    achievementMethod: string;
    description: string;
    fundingSource: string;
    goalId: string;
    goalRelatesToId: number;
    goalStatusId: number;
    goalTypeId: number;
    isDeleted: boolean;
    lastUpdated: string;
    lastUpdatedBy: string;
    participantId: string;
    planId: string;
    goalType: string;
}
export interface CreateGoalData {
    achievementMethod: string;
    description: string;
    fundingSource: string;
    goalStatusId: number;
    goalTypeId: number;
    planId: string;
}
export interface GoalTrackingData {
    description: string;
    goalId: string;
    goalTrackingDate: Date;
    performanceScore?: any;
    satisfactionScore?: any;
}
export interface CreateGoal {
    achievementMethod: string;
    description: string;
    fundingSource: string;
    goalStatusId: number;
    goalTypeId?: any;
    planId: string;
    goalRelatesToId?: any;
}
