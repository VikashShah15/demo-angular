export const validations: any = {
    // registration,login,basic details
    EmailAddressRequired: 'Please enter email address.',
    EmailPattern: 'Please enter a valid email address.',
    PasswordRequired: 'Please enter password.',
    PasswordPattern: 'Please enter a valid password. Password must contain 1 lower case letter, 1 upper case letter, 1 numeric character and 1 special characters.',
    ConfirmPasswordRequired: 'Please enter confirm password.',
    UsernameRequired: 'Please enter user name.',
    ConfirmPasswordPattern: 'Password does not match.',
    TermsRequired: 'Please select terms and conditions.',
    PhoneRequired: 'Please enter phone number.',
    PhonePattern: 'Please enter a valid phone number.',
    FirstNameRequired: 'Please enter first name.',
    LastNameRequired: 'Please enter last name.',
    NewPasswordRequired: 'Please enter new password.',
    OldPasswordRequired: 'Please enter old password.',
    CurrentPasswordRequired: 'Please enter current password.',
    TitleRequired: 'Please enter title.',
    DescriptionRequired: 'Please enter description.',
    StartDateRequired: 'Please select start date.',
    EndDateRequired: 'Please select end date.',
    FileRequired: 'Please choose file.',
    Address1Required: 'Please enter address 1.',
    Address2Required: 'Please enter address 2.',
    CityRequired: 'Please enter city.',
    StateRequired: 'Please enter state.',
    ZipCodeRequired: 'Please enter zipcode.',
    ZipCodePattern: 'Please enter a valid zipcode.',
    SuburbRequired: 'Please enter suburb.',


    // parser
    PdfMessage: 'Understanding of your NDIS plan can be simpler. Leveraging the latest technology, Cared is making understanding your plan simple, quick and easy. Make sure that your plan is in PDF from the NDIS.',
    PlanAutomaticallyDelete: 'Please note that we do not store your plans and they are automatically deleted.',
    AnalysePlan: 'Cared is analysing your NDIS Plan. Thank you for being patience.',
    IdentifyDetails: 'Cared has identified your details.',
    PersonalInformation: 'Cared is working out your personal circumstances.',
    GoalUnderstand: 'Cared is understanding you goals and working on your profile.',
    PlanExtract: 'Cared is in the process of structuring your plan in simplest way.',

    // step 1
    BudgetOptionRequired: 'Please enter a support group.',
    ParticipantNameRequired: 'Please enter participant name.',
    NdisNumberRequired: 'Please enter NDIS number.',
    PlanIdRequired: 'Please enter plan id.',
    PlanReviewDateRequired: 'Please select plan review date.',
    BirthDateRequired: 'Please select birth date.',
    TotalBudgetRequired: 'Please enter total budget.',
    AddressRequired: 'Please enter address.',
    AboutRequired: 'Please enter about you.',
    FamilyAndFriendsRequired: 'Please enter about family and friends.',
    ServiceCommunityRequired: 'Please enter service community.',
    BirthdateNotGreater: 'Birth date cannot be greater than current date.',

    // step 2
    CategoryRequired: 'Please select category.',
    SubCategoryRequired: 'Please select sub category',
    BudgetRsRequired: 'Please enter total budget.',
    SpentBudgetRequired: 'Please enter spent budget.',
    OnHoldBudgetRequired: 'Please enter onhold budget.',
    PlanTypeRequired: 'Please select plan type.',
    BudgetGreaterThanZero: 'Budget should be greater than 0.',
    InitialBudgetRsRequired: 'Please enter initial budget.',
    TotalBudgetGreaterZero: 'Total budget should be greater than 0.',
    InitialBudgetGreaterZero: 'Initial budget should be greater than 0.',
    SpentBudgetGreaterZero: 'Spent budget should be greater than 0.',
    OnHoldBudgetGreaterZero: 'Onhold budget should be greater than 0.',
    InitialBudgetGreater: 'Initial budget should not be greater than total budget.',
    SpentBudgetGreater: 'Spent budget should not be greater than total budget.',
    OnHoldBudgetGreater: 'Onhold budget should not be greater than total budget.',
    StartDateEndDateCompare: 'End date should not be less than start date.',
    ReviewDateStartDateCompare: 'Review date should not be less than start date.',
    SameCategoryError: 'You have already selected a similar category earlier',
    // goal
    GoalTypeRequired: 'Please select goal type.',
    AchieveGoalRequired: 'Please enter how to achieve goal.',
    SupportGoalRequired: 'Please enter how to support goal.',
    GoalRelatesRequired: 'Please select goal relates.',
    GoalTrackingDateRequired: 'Please select goal tracking date.',
    SatisfactionScoreRequired: 'Please select satisfaction score.',
    PerformanceScoreRequired: 'Please select performance score.',

    // invoice
    SupportStartDateRequired: 'Please select delivered start date.',
    SupportEndDateRequired: 'Please select delivered end date.',
    SupportCategoryRequired: 'Please select support category.',
    SupportItemNumberRequired: 'Please enter support item number.',
    UnitRequired: 'Please enter unit.',
    TotalPriceRequired: 'Please enter price per unit.',
    TotalPriceGreaterThanZero: 'You can not enter negative number.',
    UnitGreaterThanZero: 'You can not enter negative number.',
    InvoiceStatusRequired: 'Please select invoice status type.',
    StartDateNotGreater: 'Start date should not be greater than end date.',
    EndDateNotGreater: 'End date should not be less than start date.',
    InvoiceToRequired: 'Please enter invoice from.',
    InvoiceNumberRequired: 'Please enter invoice number.',
    SupportSubCategoryRequired: 'Please select sub category.',

    // document
    DocumentTypeRequired: 'Please select document type.'
};
export const pattern: any = {
    EmailPattern: /^(([^<>()[\]{}'^?\\.,!|//#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    PasswordPattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\-_=+{}|?/>.<,:;~`???])[A-Za-z\\d!@#$%^&*()\\-_=+{}|?/>.<,:;~`???]{8,16}$',
    PhoneNumberPattern: '^[0-9]{10}$'
};
