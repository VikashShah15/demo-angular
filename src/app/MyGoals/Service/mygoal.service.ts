import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../constant/goalsApi.constant';
import { Response } from 'src/app/Shared/Model/Response';
import { CreateGoal, GoalTrackingData } from 'src/app/Shared/Model/goal';

@Injectable({
  providedIn: 'root'
})
export class MyGoalService {

  constructor(private http: HttpClient) { }
  getGoalByPlanId(planId): Observable<any> {
    return this.http.get(`${API.goal.getGoalByPlan}`.replace('{planId}', planId));
  }

  deleteGoalTrackingData(goalTrackingId): Observable<Response> {
    return this.http.delete<Response>(`${API.goal.deleteGoalTrackingData}`.replace('{goalTrackingId}', goalTrackingId));
  }
  deleteGoalData(goalId): Observable<Response> {
    return this.http.delete<Response>(`${API.goal.deleteGoalData}`.replace('{goalId}', goalId));
  }
  getGoalTrackingData(goalId): Observable<Response> {
    return this.http.get<Response>(`${API.goal.getGoalTrackingData}`.replace('{goalId}', goalId));
  }
  updateGoalTrackingData(goalTrackingId, model: GoalTrackingData): Observable<Response> {
    return this.http.put<Response>(`${API.goal.updateGoalTrackingData}`.replace('{goalTrackingId}', goalTrackingId), model);
  }
  getGoalTractById(goalTrackingId): Observable<Response> {
    return this.http.get<Response>(`${API.goal.getGoalTractById}`.replace('{goalTrackingId}', goalTrackingId));
  }
  createGoalTracking(model: GoalTrackingData): Observable<Response> {
    return this.http.post<Response>(`${API.goal.createGoalTracking}`, model);
  }
  createGoal(model: CreateGoal): Observable<Response>{
    return this.http.post<Response>(`${API.goal.createGoal}`, model);
  }
  goalStatus(): Observable<Response>{
    return this.http.get<Response>(`${API.goal.goalStatus}`);
  }
  getGoalData(goalId): Observable<Response>{
    return this.http.get<Response>(`${API.goal.getGoalData}`.replace('{goalId}', goalId));
  }
  updateGoal(goalId, model: CreateGoal): Observable<Response>{
    return this.http.put<Response>(`${API.goal.updateGoalData}`.replace('{goalId}', goalId), model);
  }
}
