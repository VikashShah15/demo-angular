export interface Supportcategory {
    SupportCategory: string;
    SupportType: string;
    Amount: string;
    PlanType: string;
    ServiceProviders: Array<SearviceProvider>;
    HoverDescription: string;
}


export interface SearviceProvider {
    Title: string;
}
