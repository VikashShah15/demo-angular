import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import axios from 'axios';
import { API, planApi } from '../Constant/planParserApi.constant';
import { Supportcategory } from '../supportcategory';
import { Response } from 'src/app/Shared/Model/Response';
import { CreateBudget, CreateBudgetData } from 'src/app/Shared/Model/Budget';
import { SavePlanData } from 'src/app/Shared/Model/plan';
import { CreateGoalData, GoalData } from 'src/app/Shared/Model/goal';
import { ApiService } from 'src/app/shared/services/api.service';
import { BaseService } from 'src/app/shared/services/base.service';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class PlanparserService {
  private SupportCategories;
  private Categories;
  private GoalType;
  private GoalRelatesType;
  private PlanType;
  private GoalTypes: Array<any> = [
    { title: 'Short-term goal' },
    { title: 'long-term goal' },
    { title: 'Medium or long-term goal' },
    { title: 'Aspirational' }];
  private SupportCategory: Array<Supportcategory> = [
    {
      SupportCategory: 'Core supports', SupportType: 'Core Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Examples include training, advice and help for you to move from school to further education, such as university or TAFE.'
    },
    {
      SupportCategory: 'Assistance with daily life', SupportType: 'Core Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'For example, assistance with everyday needs, household cleaning and/or yard maintenance.'
    },
    {
      SupportCategory: 'Transport', SupportType: 'Core Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Transport budget helps you travel to work or other places that will help you achieve the goals in your plan.How you can spend your transport funding and how it is paid to you (whether upfront or in regular payments) will be different for each person. '
    },
    {
      SupportCategory: 'Consumables', SupportType: 'Core Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Everyday items you may need. For example, continence products or low-cost assistive technology and equipment to improve your independence and/or mobility.'
    },
    {
      SupportCategory: 'Assistance with social and community participation', SupportType: 'Core Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'For example, a support worker to assist you to participate in social and community activities.'
    },
    {
      SupportCategory: 'Assistive technology', SupportType: 'Capital Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'This includes equipment items for mobility, personal care, communication and recreational inclusion such as wheelchairs or vehicle modifications.'
    },
    {
      SupportCategory: 'Home modifications', SupportType: 'Capital Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Home modifications such as installation of a handrail in a bathroom, or Specialist Disability Accommodation for participants who require special housing because of their disability.'
    },
    {
      SupportCategory: 'Support Coordination', SupportType: 'Capacity Building Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'This is a fixed amount for a Support Coordinator to help you use your plan.'
    },
    {
      SupportCategory: 'Improved living arrangements', SupportType: 'Capacity Building Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Support to help you find and maintain an appropriate place to live.'
    },
    {
      SupportCategory: 'Increased social and community participation', SupportType: 'Capacity Building Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Development and training to increase your skills so you can participate in community, social and recreational activities.'
    },
    {
      SupportCategory: 'Finding and keeping a job', SupportType: 'Capacity Building Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'This may include employment-related support, training and assessments that help you find and keep a job, such as the School Leaver Employment Supports (SLES).'
    },
    {
      SupportCategory: 'Improved relationships', SupportType: 'Capacity Building Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'This support will help you develop positive behaviours and interact with others.'
    },
    {
      SupportCategory: 'Improved health and wellbeing', SupportType: 'Capacity Building Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Including exercise or diet advice to manage the impact of your disability. The NDIA does not fund gym memberships.'
    },
    {
      SupportCategory: 'Improved learning', SupportType: 'Capacity Building Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Examples include training, advice and help for you to move from school to further education, such as university or TAFE.'
    },
    {
      SupportCategory: 'Improved life choices', SupportType: 'Capacity Building Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Plan management to help you manage your plan, funding and paying for services.'
    },
    {
      SupportCategory: 'Improved daily living', SupportType: 'Capacity Building Supports', Amount: '',
      PlanType: '', ServiceProviders: [], HoverDescription: 'Assessment, training or therapy to help increase your skills, independence and community participation. These services can be delivered in groups or individually.'
    },
  ];
  private SupportSubCategory: any = [
    { SupportCategoryId: 1, SupportSubCategoryId: 1, ServiceProvider: ['Assist Personal Activities', 'Household Tasks', 'Assistive Prod-Household Task', 'Daily Tasks/Shared Living', 'Community Nursing Care', 'Early Childhood Supports', 'Therapeutic Supports', 'Assist-Life Stage Transition', 'Support Coordination'] },
    { SupportCategoryId: 1, SupportSubCategoryId: 4, ServiceProvider: ['Personal Activities High', 'Participate Community', 'Innov Community Participation', 'Group/Centre Activities', 'Spec Support Employ'] },
    { SupportCategoryId: 1, SupportSubCategoryId: 3, ServiceProvider: ['Assist Prod-Pers Care/Safety', 'Custom Prosthetics', 'Interpret/Translate', 'Personal Mobility Equipment', 'Vision Equipment', 'Comms & Info Equipment', 'Assistance Animals'] },
    { SupportCategoryId: 1, SupportSubCategoryId: 2, ServiceProvider: ['Assist-Travel/Transport'] },
    { SupportCategoryId: 3, SupportSubCategoryId: 7, ServiceProvider: ['Assist-Life Stage Transition', 'Development-Life Skills', 'Support Coordination'] },
    { SupportCategoryId: 3, SupportSubCategoryId: 8, ServiceProvider: ['Assist-Life Stage Transition'] },
    { SupportCategoryId: 3, SupportSubCategoryId: 9, ServiceProvider: ['Assist-Life Stage Transition', 'Innov Community Participation', 'Development-Life Skills'] },
    { SupportCategoryId: 3, SupportSubCategoryId: 10, ServiceProvider: ['Therapeutic Supports', 'Assist Access/Maintain Employ', 'Spec Support Employ'] },
    { SupportCategoryId: 3, SupportSubCategoryId: 11, ServiceProvider: ['Behaviour Support', 'Development-Life Skills'] },
    { SupportCategoryId: 3, SupportSubCategoryId: 12, ServiceProvider: ['Therapeutic Supports', 'Ex Phys Pers Training'] },
    { SupportCategoryId: 3, SupportSubCategoryId: 13, ServiceProvider: ['Assist Access/Maintain Employ'] },
    { SupportCategoryId: 3, SupportSubCategoryId: 14, ServiceProvider: ['Plan Management'] },
    { SupportCategoryId: 3, SupportSubCategoryId: 15, ServiceProvider: ['Assist Prod-Pers Care/Safety', 'Personal Mobility Equipment', 'Early Childhood Supports', 'Assist-Life Stage Transition', 'Community Nursing Care', 'Development-Life Skills', 'Daily Tasks/Shared Living', 'Therapeutic Supports', 'Specialised Driver Training', 'Custom Prosthetics', 'Ex Phys Pers Training', 'Comms & Info Equipment', 'Specialised Hearing Services', 'Hearing Services'] },
    { SupportCategoryId: 2, SupportSubCategoryId: 6, ServiceProvider: ['Home Modification', 'Assist Prod-Pers Care/Safety', 'Specialised Disability Accommodation', 'Accommodation/Tenancy'] },
    { SupportCategoryId: 2, SupportSubCategoryId: 5, ServiceProvider: ['Assist Prod-Pers Care/Safety', 'Custom Prosthetics', 'Personal Mobility Equipment', 'Vehicle Modifications', 'Assist-Travel/Transport', 'Assistive Equip-Recreation', 'Vision Equipment', 'Assistive Prod-Household Task', 'Home Modification', 'Comms & Info Equipment', 'Hearing Equipment', 'Specialised Hearing Services', 'Assistance Animals'] },
  ];

  constructor(private api: ApiService, private http: HttpClient, private base: BaseService) { }
  fileUpload = (file) => {
    const url = `${API.plans.planFileUpload}`;
    const model = { planBase64File: file.planFile };
    return this.api.post(url.replace('$filename', file.filename), model);
  }
  getPlanDetails(jobId): Promise<any> {
    const url = `${API.plans.getPlanDetails}`
      .replace('$jobId', jobId);
    return this.api.get(url).toPromise();
  }
  getDataNextToken(token, jobId): Promise<any> {
    const url = `${API.plans.getDataNextToken}`
      .replace('$NextToken', encodeURIComponent(token))
      .replace('$jobId', jobId);
    return this.api.get(url).toPromise();
  }
  getSupportCategory(text: string, category: string = ''): any {
    if (category === '') {
      return this.SupportCategory.find(i => i.SupportCategory.toLowerCase().indexOf(text.toLowerCase()) !== -1);
    }
    return this.SupportCategory.find(i => i.SupportCategory.toLowerCase().indexOf(text.toLowerCase()) !== -1 && i.SupportType === category);
  }
  getAllSupportCategory = () => {
    return this.SupportCategory;
  }
  getSearviceProviders = (category, zipcode) => {
    return this.http.get(`${environment.SEARVICE_PROVIDER}?text=${category}&category=none&suburb=none&pincode=${zipcode}&from=0`);
  }
  getData = () => {
    return this.http.get('assets/json/aaryan.json');
  }
  getSupportSubCategoryArray = () => {
    return this.SupportSubCategory;
  }
  getAllGoalType = () => {
    return this.GoalTypes;
  }
  savePlans(model: any): Observable<Response> {
    return this.http.post<Response>(`${planApi.plan.savePlan}`, model);
  }
  getCategories(): Promise<Response> {
    if (this.Categories === undefined) {
      const request = this.http.get<Response>(`${planApi.plan.supportCategory}`).toPromise();
      request.then(res => this.Categories = res);
      return request;
    }
    return of(this.Categories).toPromise();
  }
  getSupportCategories(): Promise<Response> {
    if (this.SupportCategories === undefined) {
      const request = this.http.get<Response>(`${planApi.plan.supportSubCategories}`).toPromise();
      request.then(res => this.SupportCategories = res);
      return request;
    }
    return of(this.SupportCategories).toPromise();
  }
  planType(): Promise<Response> {
    if (this.PlanType === undefined) {
      const request = this.http.get<Response>(`${planApi.plan.planType}`).toPromise();
      request.then(res => this.PlanType = res);
      return request;
    }
    return of(this.PlanType).toPromise();
  }
  categoryType(categoryId): Observable<any> {
    return this.http.get(`${planApi.plan.supportSubCategory}`.replace('{categoryId}', categoryId));
  }
  getPlanById(planId): Observable<Response> {
    return this.http.get<Response>(`${planApi.plan.getPlanById}`.replace('{planId}', planId));
  }
  updatePlanDetails(planId, model: SavePlanData): Observable<Response> {
    return this.http.put<Response>(`${planApi.plan.updatePlanDetails}`.replace('{planId}', planId), model);
  }
  planByBudgets(planId): Observable<any> {
    return this.http.get(`${planApi.budget.planByBudgets}`.replace('{planId}', planId));
  }
  updatePlanByBudgets(planId, model: any): Observable<any> {
    return this.http.put(`${planApi.budget.updatePlanByBudgets}`.replace('{planId}', planId), model);
  }
  createBudgetsByPlanId(planId, model: CreateBudget): Observable<Response> {
    return this.http.post<Response>(`${planApi.budget.updatePlanByBudgets}`.replace('{planId}', planId), model);
  }
  getPlanId(planId): Observable<Response> {
    return this.http.get<Response>(`${planApi.plan.getId}`.replace('{planId}', planId));
  }
  getPlanExtractDetails = () => {
    if (localStorage.getItem('cared-parse') != null) {
      const ExtractDataArray = JSON.parse(localStorage.getItem('cared-parse'));
      return ExtractDataArray;
    }
  }
  getGoals(planId): Observable<Response> {
    return this.http.get<Response>(`${planApi.goal.planByGoal}`.replace('{planId}', planId));
  }
  getGoalsStatus(): Observable<Response> {
    return this.http.get<Response>(`${planApi.goal.goalStatus}`);
  }
  createGoals(planId, model: CreateGoalData): Observable<Response> {
    return this.http.post<Response>(`${planApi.goal.createPlanGoals}`.replace('{planId}', planId), model);
  }
  updateGoal(goalId, model: GoalData): Observable<Response> {
    return this.http.put<Response>(`${planApi.goal.updateGoal}`.replace('{goalId}', goalId), model);
  }
  deleteBudget(budgetId): Observable<any> {
    return this.http.delete(`${planApi.budget.deleteBudgetData}`.replace('{budgetId}', budgetId));
  }
  updateBudgetData(model: CreateBudgetData, budgetId): Observable<Response> {
    return this.http.put<Response>(`${planApi.budget.updateBudgetData}`.replace('{budgetId}', budgetId), model);
  }
  createBudget(model: CreateBudgetData): Observable<Response> {
    return this.http.post<Response>(`${planApi.budget.createBudget}`, model);
  }
  getGoalType(): Promise<Response> {
    if (this.GoalType === undefined) {
      const request = this.http.get<Response>(`${planApi.goal.goalTypes}`).toPromise();
      request.then(res => this.GoalType = res);
      return request;
    }
    return of(this.GoalType).toPromise();
  }
  getUserPlan(): Observable<Response> {
    return this.http.get<Response>(`${planApi.plan.getUserPlan}`);
  }
  getUserPlan1(): Promise<any> {
    return this.http.get(`${planApi.plan.getUserPlan}`).toPromise();
  }
  goalRelatesType(): Promise<Response> {
    if (this.GoalRelatesType === undefined) {
      const request = this.http.get<Response>(`${planApi.goal.goalRelatesType}`).toPromise();
      request.then(res => this.GoalRelatesType = res);
      return request;
    }
    return of(this.GoalRelatesType).toPromise();
  }
  getGoalByPlanId(model): Observable<any> {
    return this.http.post(`${planApi.goal.getGoalByPlanId}`, model);
  }
  getServiceProviderData(text, category, suburb, pincode): Observable<any> {
    return this.http.get(`https://api.cared.com.au/searchProvider?text=${text}&category=${category}&suburb=${suburb}&pincode=${pincode}&from=0`);
  }
  getGoalData(goalId): Observable<any> {
    return this.http.get(`${planApi.goal.getGoalData}`.replace('{goalId}', goalId));
  }
  createFileUploadRequest(doctype, filetype, filename): Promise<any> {
    return this.http.get(`${planApi.plan.fileUpload}?doctype=${doctype}&filetype=${filetype}&filename=${filename}`).toPromise();
  }
  uploadFileToS3Bucket(file, url): Promise<any> {
    const formData = new FormData();
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'binary/octet-stream');
    return axios.put(url, file, { headers: { 'Content-Type': 'binary/octet-stream' } });
  }
}
