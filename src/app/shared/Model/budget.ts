export interface BudgetModel {
    budgetId: string;
    createdDate: string;
    initialBudget: number;
    isConfirmed: boolean;
    isDeleted: boolean;
    lastUpdated: string;
    lastUpdatedBy: string;
    onHoldBudget: number;
    planId: string;
    planTypeId: number;
    remainingBudget: number;
    spentBudget: number;
    supportSubCategoryId: number;
    totalBudget: number;
    subCategory: string;
    category: string;
    planType: string;
}
export interface SupportCategory {
    supportCategoryId: number;
    title: string;
}
export interface SupportSubCategory {
    supportCategoryId: number;
    supportSubCategoryId: number;
    title: string;
    supportCat: string;
    supportCategoryTitle: string;
}
export interface CreateBudgetData {
    remainingBudget: number;
    budgetId: string;
    supportSubCategoryId: number;
    planId: string;
    totalBudget: number;
    initialBudget: number;
    onHoldBudget: number;
    spentBudget: number;
    planTypeId: number;
    isDeleted: boolean;
    isConfirmed: boolean;
}
export interface CreateBudget {
    // remainingBudget: number;
    // budgetId: string;
    supportSubCategoryId: number;
    planId: string;
    totalBudget: number;
    initialBudget: number;
    onHoldBudget: number;
    spentBudget: number;
    planTypeId: number;
    isDeleted: boolean;
    // isConfirmed: boolean;
}
