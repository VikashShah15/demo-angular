export interface PlanModel {
    aboutMe: string;
    address: string;
    birthDate: string | Date;
    displayId: number;
    docSize: number;
    endDate: Date;
    familyAndFriends: string;
    isActive: boolean;
    isDeleted: boolean;
    ndisNumber: string;
    participantName: string;
    planDocUrl: string;
    planId: string;
    postCode: number;
    reviewDate: Date;
    serviceCommunity: string;
    startDate: Date;
    totalBudget: number;
    userId: string;
}
export interface SavePlanData {
    aboutMe: string;
    address: string;
    birthDate?: string | Date;
    docSize: number;
    endDate: Date;
    familyAndFriends: string;
    // isActive: boolean;
    ndisNumber: string;
    participantName: string;
    planDocUrl: string;
    // postCode: number;
    reviewDate: Date;
    serviceCommunity: string;
    startDate: Date;
    totalBudget: number;
    displayId: number;
    userId: string;
}

export interface PlanType {
    planTypeId: number;
    title: string;
}
