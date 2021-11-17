import { BudgetModel } from '../Model/Budget';
import { PlanModel } from '../Model/Plan';
export interface PlanAndBudgetDetail {
     budgets: BudgetModel[];
     plan: PlanModel;
}
