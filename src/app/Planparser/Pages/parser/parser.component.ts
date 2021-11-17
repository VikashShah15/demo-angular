import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { message } from 'src/app/Shared/Constant/alert.message';
import { Response } from 'src/app/Shared/Model/response';
import { PlanType, SavePlanData } from 'src/app/Shared/Model/plan';
import { Supportcategory } from '../../supportcategory';
import { CreateGoalData, GoalStatues, GoalType } from 'src/app/Shared/Model/goal';
import { PlanAndBudgetDetail } from 'src/app/Shared/Model/planAndbudgetdetails';
import { SupportCategory, SupportSubCategory } from 'src/app/Shared/Model/Budget';
import { MessageService } from 'primeng/api';
import { PlanparserService } from '../../Service/planparser.service';
import { MessageServices } from 'src/app/shared/services/message.service';
import { types } from 'util';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';


@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements OnInit {
  public validationConstants = validations;
  private imageSrc = '';
  private fileName = '';
  private jobId = '';
  private i = 0;
  private responseData = [];
  private responseStatus;
  private NDISNumber: any;
  private aboutMe: any;
  private friendsAndFamily: any = [];
  private servicesAndCommunityInvolvement: any;
  private PlanStartDate: any;
  private NDISplanstartdate: any;
  private name: any;
  private Birthdate: any;
  private TotalBudget: any;
  private ExtractDataArray: any = [];
  private PlanReviewDate: any;
  private TotalCoreSupport: any;
  private TotalCapacitySupport: any;
  private TotalCapitalSupport: any;
  private CoreSupportArray: any = [];
  private CapitalSupportArray: any = [];
  private CapacitySupportArray: any = [];
  private TempData = [];
  private SupportCategories = [];
  public Loader = 0;
  public iconAndMsgShow = 0;
  private ShortTermsGoals: any = [];
  private MediumTermsGoals: any = [];
  private HowIWillAchieve: any = [];
  private HowIWillSupport: any = [];
  private CombinedGoalsShortTerms: any = [];
  private CombinedGoalsLongTerms: any = [];
  private MyNDISContact = '';
  private FooterIndexes = [];
  private MyContactAddress: any;
  private display = false;
  private ZipCode = '';
  private ShowPersonalDetail = false;
  private displayContain = false;
  private SupportType = [];
  public ErrorMsg = '';
  private alertMessage = message;
  private supportSubCategory: SupportSubCategory[];
  private supportCategory: SupportCategory[];
  private planId: any;
  private planType: PlanType[];
  private combinedAllCategory: any = [];
  private goalType: GoalType[];
  private goalTypeData: any = [];
  private goalsStatus: GoalStatues[];
  public activeplan: any = [];
  public redirectProgress = true;
  public fileProgressStatus = 0;
  public iconShow = 0;
  private File: any;
  public timer = 0;
  private stopWatch = 0;
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  Interval: any;

  constructor(
    private ps: PlanparserService,
    private msg: MessageService,
    private messageService: MessageServices,
    private route: ActivatedRoute,
    private router: Router,
    private ga: GoogleAnalyticsService
  ) {
    this.getMessage();
  }
  ngOnInit(): void {
    this.loadData();
  }
  getMessage(): any {
    this.subscriptions[this.subscriptions.length] = this.messageService.getMessage().subscribe(res => {
      this.ErrorMsg = res.command;
      this.Loader = 0;
      clearInterval(this.Interval);

      // this.messageService.add({ severity: 'error', summary: 'Error', detail: res.command });
    });
    // this.ps.getData().subscribe(res => {
    //   this.ExtractDataArray = res;
    //   this.parseDataToView(this.ExtractDataArray);
    // });
  }
  async loadData() {

    this.Loader = 0;
    this.messageService.sendMessage({ cmd: '/planparser' });
    const route = this.route.snapshot.routeConfig.path;
    if (route !== 'new-pdf-upload') {
      // this.ps.getUserPlan().subscribe(res => {
      //   var plans = res.data.plans;
      //   var activeplan = plans.find(i => i.plan.isActive == true);
      //   if (activeplan.plan != undefined) {
      //     this.router.navigate(["planparser/view-plan/", activeplan.plan.planId]);
      //   }
      // })
    }

    if (localStorage.getItem('cared-parse') != null) {
      this.ExtractDataArray = JSON.parse(localStorage.getItem('cared-parse'));
      this.Loader = 0;
      this.ErrorMsg = '';
      // this.setParseData();
    } else {
      this.Loader = 0;
      this.ErrorMsg = '';
    }

    if (localStorage.getItem('cared-personal-details') != null) {
      this.ShowPersonalDetail = true;
    } else {
      this.ShowPersonalDetail = false;
    }

    await this.ps.getCategories().then((res: Response) => {
      this.supportCategory = res.data.supportCategories;
    });

    await this.ps.getSupportCategories().then((res: Response) => {
      this.supportSubCategory = res.data.supportSubCategories;
    });

    await this.ps.planType().then((res: Response) => {
      this.planType = res.data.planTypes;
    });
    await this.ps.getGoalType().then((res: Response) => {
      this.goalType = res.data.goalTypes;
    });
    this.subscriptions[this.subscriptions.length] = this.ps.getGoalsStatus().subscribe((res: Response) => {
      this.goalsStatus = res.data.goalStatues;
    });
    this.subscriptions[this.subscriptions.length] = this.ps.getUserPlan().subscribe((res: Response) => {
      const plan: PlanAndBudgetDetail[] = res.data.plans;
      this.activeplan = plan.find(i => i.plan.isActive === true);
      this.redirectProgress = false;
    }, error => {
      this.redirectProgress = false;
    });
  }
  redirectViewPlan() {
    if (this.activeplan) {
      this.router.navigate(['/planparser/view-plan', this.activeplan.plan.planId]);
    }
  }
  handleInputChange(e, form): any {
    this.fileProgressStatus = 1;
    this.iconAndMsgShow = 1;
    this.File = e.files[0];
    const reader = new FileReader();
    this.fileName = this.File.name;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(this.File);
    this.ga.eventEmitter(this.gAnalytics.uploadPlanData, 'PlanExplainer', 'cart', 'click', 10);
    form.clear();
    this.clearData();
  }
  _handleReaderLoaded(e): any {
    const reader = e.target;
    this.imageSrc = reader.result;
    const splitFile = this.imageSrc.split('data:application/pdf;base64,');
    const model = {
      filename: this.fileName,
      planFile: splitFile[1]
    };
    if (splitFile[1] != null || splitFile[1] !== '') {
      this.Loader = 1;
      this.Interval = setInterval(() => {
        this.timer++;
        if (this.timer === 180) {
          clearInterval(this.Interval);
          this.timer = 180;
        }
      }, 1000);
      this.subscriptions[this.subscriptions.length] = this.ps.fileUpload(model).subscribe(res => {
        this.jobId = res.JobId;
        if (res.JobId !== undefined) {
          const interval = setInterval(async () => {
            this.i++;
            if (!(this.timer === 180)) {
              if (this.i === 3) {
                this.fileProgressStatus = 2;
                this.iconShow = 1;
              }
              await this.ps.getPlanDetails(this.jobId).then(ress => {
                this.responseStatus = ress;
                if (this.responseStatus.JobStatus === 'SUCCEEDED') {
                  this.fileProgressStatus = 3;
                  this.iconShow = 2;
                  this.handleExtractData(ress.NextToken);
                  this.i = 0;
                  clearInterval(interval);
                }
              }, error => {
                this.msg.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.Error });
                // this.router.navigate(['/500']);
                this.Loader = 0;
                clearInterval(this.Interval);
              });
            }
            else {
              this.ErrorMsg = 'We are unable to process your NDIS plan. Please select correct PDF file or try again later.';
              clearInterval(this.Interval);
              this.Loader = 0;
            }
          }, 5000);
        }
      }, error => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.Error });
        // this.router.navigate(['/500']);
        this.Loader = 0;
        clearInterval(this.Interval);
      });
    } else {
      this.msg.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.ParserFileNotChoose });
      this.Loader = 0;
      clearInterval(this.Interval);
    }
  }


  async handleExtractData(token) {
    if (this.i < 30) {
      await this.ps.getDataNextToken(token, this.jobId).then(res => {
        this.responseData.push({ data: res });
        this.i++;
        if (res.NextToken !== undefined && token !== res.NextToken && res.NextToken !== '') {
          token = res.NextToken;
          this.handleExtractData(res.NextToken);
        }
        else {
          this.parseDataToView(this.responseData);
        }
      }, error => {
        this.ErrorMsg = 'We are unable to process your NDIS plan. Please select correct PDF file or try again later.';
        this.fileProgressStatus = 0;
        // this.msg.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.Error });
        // this.router.navigate(['/500']);
      });
    }
    else {
      this.parseDataToView(this.responseData);
      clearInterval(this.Interval);
    }
  }

  async parseDataToView(res) {
    const ExtractedTextData = [];
    for (const each of res) {
      ExtractedTextData.push(each.data.Blocks);
      this.fileProgressStatus = 4;
      this.iconShow = 3;
    }

    await ExtractedTextData.forEach(ele => {
      ele.forEach((element, ind) => {
        if (element.Text !== undefined) {
          element.Text = element.Text.replace('Capacitv', 'Capacity');
          element.Text = element.Text.replace('Mv ', 'My ');
          element.Text = element.Text.replace('Familv', 'Family');
        }
        if (element.Text !== undefined) {
          this.ExtractDataArray.push(element.Text);
        }
      });
    });
    this.setParseData();
  }

  setParseData(): any {
    localStorage.setItem('cared-parse', JSON.stringify(this.ExtractDataArray));
    const AboutMe = this.ExtractDataArray.find(i => i !== undefined && i.toString().toLowerCase() === 'about me');
    let indexOfAboutMe = this.ExtractDataArray.indexOf(AboutMe);
    if (indexOfAboutMe < 0) {
      const indexOfAllAboutMe = this.indexOfAll(this.ExtractDataArray, 'About');
      indexOfAllAboutMe.forEach(element => {
        if (this.ExtractDataArray[element + 1] === 'me') {
          indexOfAboutMe = element + 1;
        }
      });
    }

    const FooterIndexes = this.indexOfContainAll(this.ExtractDataArray, 'Name:');
    const Familyandfriends = this.ExtractDataArray.find(i => i.toLowerCase().indexOf('family and friends') !== -1);
    let indexOfFamilyandfriends = this.ExtractDataArray.indexOf(Familyandfriends);
    if (indexOfFamilyandfriends < 0) {
      const indexOfAllFriendsMe = this.indexOfAll(this.ExtractDataArray, 'Family');
      indexOfAllFriendsMe.forEach(element => {
        if (this.ExtractDataArray[element + 1] === 'and' && this.ExtractDataArray[element + 2] === 'friends') {
          indexOfFamilyandfriends = element + 2;
        }
      });
    }
    indexOfFamilyandfriends = indexOfFamilyandfriends === -1 ? 99999 : indexOfFamilyandfriends;

    const MyFamily = this.ExtractDataArray.find(i => i.toLowerCase().indexOf('my family and friends') !== -1);
    let indexOfMyFamilyandfriends = this.ExtractDataArray.indexOf(MyFamily);
    indexOfMyFamilyandfriends = indexOfMyFamilyandfriends === -1 ? 99999 : indexOfMyFamilyandfriends;

    const ServiceAndCommunity = this.ExtractDataArray.find(i => i.indexOf('Services and community involvement') !== -1);
    let indexOfServiceAndCommunity = this.ExtractDataArray.indexOf(ServiceAndCommunity);
    indexOfServiceAndCommunity = indexOfServiceAndCommunity === -1 ? 99999 : indexOfServiceAndCommunity;

    const MyServicesAndCommunity = this.ExtractDataArray.find(i => i.indexOf('My Services and community involvement') !== -1);
    let indexOfMyServiceAndCommunity = this.ExtractDataArray.indexOf(MyServicesAndCommunity);
    indexOfMyServiceAndCommunity = indexOfMyServiceAndCommunity === -1 ? 99999 : indexOfMyServiceAndCommunity;

    const MyGoals = this.ExtractDataArray.find(i => i.endsWith('goals'));
    let indexOfMyGoals = this.ExtractDataArray.indexOf(MyGoals);
    indexOfMyGoals = indexOfMyGoals === -1 ? 99999 : indexOfMyGoals;

    const contactDetails = this.ExtractDataArray.find(i => i.indexOf('Preferred contact details letter') !== -1);
    let indexOfcontactDetails = this.ExtractDataArray.indexOf(contactDetails);
    indexOfcontactDetails = indexOfcontactDetails === -1 ? 99999 : indexOfcontactDetails;

    const contactDetailswithTelephone = this.ExtractDataArray.find(i => i.indexOf('Preferred contact details telephone') !== -1);
    let indexOfcontactDetailswithTelephone = this.ExtractDataArray.indexOf(contactDetailswithTelephone);
    indexOfcontactDetailswithTelephone = indexOfcontactDetailswithTelephone === -1 ? 99999 : indexOfcontactDetailswithTelephone;
    this.TempData = [...this.ExtractDataArray];
    const currentcontactDetails = this.ExtractDataArray.find(i => i.indexOf('Current contact details') !== -1 || i.indexOf('Preferred contact details') !== -1);
    const indexOfcurrentcontactDetails = this.ExtractDataArray.indexOf(currentcontactDetails);
    if (indexOfcurrentcontactDetails < 0) {
      const indexOfAlldetails = this.indexOfAll(this.ExtractDataArray, 'details');
      // const indexOfAlldetails = this.ExtractDataArray.filter(i => i.indexOf('details'));
      indexOfAlldetails.forEach(element => {
        if (this.ExtractDataArray[element - 1].toLowerCase() === 'contact') {
          const filterData = this.TempData.splice(element + 1, indexOfAboutMe - element - 2).join(' ');
          this.MyContactAddress = filterData;
        }
      });
    }
    else {
      const filterData = this.TempData
        .splice(indexOfcurrentcontactDetails + 1, indexOfAboutMe - indexOfcurrentcontactDetails - 1).join(' ');
      this.MyContactAddress = filterData;
    }
    if (this.MyContactAddress !== undefined) {
      this.MyContactAddress = this.MyContactAddress.replace('-', '').replace('letter', '');
    }

    if (this.MyContactAddress) {
      const zipcode = this.MyContactAddress.match(/[1-9][0-9][0-9][0-9]/);
      if (zipcode !== undefined) {
        this.ZipCode = this.MyContactAddress.match(/[1-9][0-9][0-9][0-9]/)[0];
      }
    }

    const myNDISContact = this.ExtractDataArray.find(i => i.toLowerCase().indexOf('my ndis contact:') !== -1);
    let indexOfmyNDISContact = this.ExtractDataArray.indexOf(myNDISContact);
    indexOfmyNDISContact = indexOfmyNDISContact === -1 ? 99999 : indexOfmyNDISContact;

    // NDIS Number
    this.NDISNumber = this.ExtractDataArray.find(i => i.indexOf('NDIS Number:') !== -1);

    // NDIS plan start date
    const planStartDate = this.ExtractDataArray.find(i => i.indexOf('Plan Approved:') !== -1);
    if (planStartDate !== undefined) {
      const p = planStartDate.split(':');
      this.PlanStartDate = p[1];
    }

    // NDIS Name
    const planName = this.ExtractDataArray.filter(i => i.indexOf('Name:') !== -1);
    if (planName.length > 0) {
      planName.forEach(element => {
        const n = element.split('Name:');
        if (n[1] !== '') {
          this.name = n[1];
        }
      });
    }

    // My Goals
    // shortTermsGoals
    const indexOfShortTermsGoals = this.indexOfAll(this.ExtractDataArray, 'Short-term goal');
    this.goalTypeData = this.ExtractDataArray
      .filter(i => i.indexOf('Short-term goal') !== -1 || i.indexOf('Medium or long-term goal') !== -1);
    const indexOfHowIwillachievethisgoal = this.indexOfAll(this.ExtractDataArray, 'How I will achieve this goal');
    indexOfShortTermsGoals.forEach(element => {
      this.TempData = [...this.ExtractDataArray];
      const indeOfNearestEnd = indexOfHowIwillachievethisgoal.find(i => i > element);
      if (indeOfNearestEnd !== undefined) {
        const filterData = this.TempData.splice(element + 1, indeOfNearestEnd - element - 1);
        const shortTermGoals = filterData.join(' ');
        this.ShortTermsGoals.push(shortTermGoals);
      }
    });

    // mediumTermsGoals
    const indexOfMediumTermsGoals = this.indexOfAll(this.ExtractDataArray, 'Medium or long-term goal');
    indexOfMediumTermsGoals.forEach(element => {
      this.TempData = [...this.ExtractDataArray];
      const indexOfNearestEnd = indexOfHowIwillachievethisgoal.find(i => i > element);
      if (indexOfNearestEnd !== undefined) {
        const filterData = this.TempData.splice(element + 1, indexOfNearestEnd - element - 1);
        const mediumTermGoals = filterData.join(' ');
        this.MediumTermsGoals.push(mediumTermGoals);
      }
    });

    const indexOfNameForLastGoal = this.indexOfAll(this.ExtractDataArray, 'Name:');
    indexOfHowIwillachievethisgoal.forEach(element => {
      this.TempData = [...this.ExtractDataArray];
      let indexOfNearestShortTermGoal = indexOfShortTermsGoals.find(i => i > element);
      if (indexOfNearestShortTermGoal === undefined) { indexOfNearestShortTermGoal = 99999; }
      let indexOfNearestMediumTermGoal = indexOfMediumTermsGoals.find(i => i > element);
      if (indexOfNearestMediumTermGoal === undefined) { indexOfNearestMediumTermGoal = 99999; }
      let indexOfNearestNameForLastGoal = indexOfNameForLastGoal.find(i => i > element);
      if (indexOfNearestNameForLastGoal === undefined) { indexOfNearestNameForLastGoal = 99999; }
      const indexOfNearestEnd = Math.min(indexOfNearestShortTermGoal, indexOfNearestMediumTermGoal, indexOfNearestNameForLastGoal);
      if (indexOfNearestEnd - element < 20) {
        if (indexOfNearestEnd !== undefined) {
          let filterData = this.TempData.splice(element + 2, indexOfNearestEnd - element - 2);
          filterData = filterData.filter(i => i !== 'E');
          let HowIWillAchieve = '';
          let HowIWillSupport = '';
          filterData.forEach((elementt, index) => {
            if (index % 2 === 0) {
              HowIWillAchieve += ' ' + elementt;
            }
            else {
              HowIWillSupport += ' ' + elementt;
            }
          });
          this.HowIWillAchieve.push(HowIWillAchieve);
          this.HowIWillSupport.push(HowIWillSupport);
        }

        this.CombinedGoalsShortTerms = this.ShortTermsGoals.length > this.MediumTermsGoals.length ?
          this.MediumTermsGoals : this.ShortTermsGoals;
        this.CombinedGoalsLongTerms = this.ShortTermsGoals.length < this.MediumTermsGoals.length ?
          this.MediumTermsGoals : this.ShortTermsGoals;
      }
    });

    // About ME
    this.TempData = [...this.ExtractDataArray];
    const indexAboutMeEnd = Math.min(indexOfFamilyandfriends, indexOfMyFamilyandfriends,
      indexOfServiceAndCommunity, indexOfMyServiceAndCommunity);
    if (indexAboutMeEnd !== 99999 && indexOfAboutMe < indexAboutMeEnd) {
      const AboutmeText = this.TempData.splice(indexOfAboutMe + 1, indexAboutMeEnd - indexOfAboutMe - 1).join(' ');
      this.aboutMe = AboutmeText.replace('Family and', '');
    }

    // Family and Friends Text Extraction
    this.TempData = [...this.ExtractDataArray];
    const FooterIndex = FooterIndexes.find(i => i > indexOfFamilyandfriends);
    const indexOfFamilyandfriendsEnd = Math.min(indexOfServiceAndCommunity, indexOfMyGoals, FooterIndex);
    if (indexOfFamilyandfriendsEnd !== 99999 && indexOfFamilyandfriends < indexOfFamilyandfriendsEnd) {
      const FriendsAndFamilyText = this.TempData.splice(indexOfFamilyandfriends + 1,
        indexOfFamilyandfriendsEnd - indexOfFamilyandfriends - 1).join(' ');
      this.friendsAndFamily = FriendsAndFamilyText.split('E ');
    }

    // My Family and Friends Text Extraction
    this.TempData = [...this.ExtractDataArray];
    const indexOfmyFamilyandfriendsEnd = Math.min(indexOfMyServiceAndCommunity, indexOfMyGoals);
    if (indexOfFamilyandfriendsEnd !== 99999 && indexOfMyFamilyandfriends < indexOfmyFamilyandfriendsEnd) {
      const FriendsAndFamilyText = this.TempData.splice(indexOfMyFamilyandfriends + 1, indexOfmyFamilyandfriendsEnd
        - indexOfMyFamilyandfriends - 1).join(' ');
      this.friendsAndFamily = FriendsAndFamilyText.replace('PERSONAL INFORMATION CONFIDENTIAL', '');
    }

    // Services and community involvement
    this.TempData = [...this.ExtractDataArray];
    const FooterIndexx = FooterIndexes.find(i => i > indexOfServiceAndCommunity);
    if (indexOfServiceAndCommunity !== 99999 && indexOfServiceAndCommunity < FooterIndexx) {
      let ServicesAndCommunityInvolvementText = this.TempData.splice(indexOfServiceAndCommunity + 1,
        FooterIndexx - indexOfServiceAndCommunity - 1).join(' ');
      ServicesAndCommunityInvolvementText = ServicesAndCommunityInvolvementText.replace(' L ', 'E ').replace('L ', 'E ');
      this.servicesAndCommunityInvolvement = ServicesAndCommunityInvolvementText.split('E ');
    }

    //  Birthdate Text Extraction
    this.TempData = [...this.ExtractDataArray];
    const Birthdate = this.ExtractDataArray.find(i => i.toLowerCase().indexOf('date of birth') !== - 1);
    const indexOfBirthdate = this.ExtractDataArray.indexOf(Birthdate);
    if (indexOfBirthdate !== -1) {
      const birthDate = this.TempData.splice(indexOfBirthdate + 1, 1);
      this.Birthdate = birthDate;
    }
    else {
      const indexOfAllBirth = this.indexOfAll(this.ExtractDataArray, 'birth');
      indexOfAllBirth.forEach(element => {
        if ((element > 1 && this.ExtractDataArray[element - 1].toLowerCase() === 'of'
          && this.ExtractDataArray[element - 2].toLowerCase() === 'date')
          || (element > 0 && this.ExtractDataArray[element - 1].toLowerCase() === 'birth')
          || element === 0) {
          const birthDate = this.TempData.splice(element + 1, 3).join(' ');
          this.Birthdate = birthDate;
        }
      });
    }

    // Total Budget
    const TotalBudget = this.ExtractDataArray.find(i => i.indexOf('Total funded supports') !== -1);
    let indexOfTotalBudget = this.ExtractDataArray.indexOf(TotalBudget);
    indexOfTotalBudget = indexOfTotalBudget === -1 ? 99999 : indexOfTotalBudget;
    if (TotalBudget !== undefined) {
      this.TotalBudget = TotalBudget.replace('Total funded supports', '');
    }

    // Core Supports
    const CoreSupports = this.ExtractDataArray.find(i => i.indexOf('Core Supports') !== -1);
    let indexOfCoreSupports = this.ExtractDataArray.indexOf(CoreSupports);
    indexOfCoreSupports = indexOfCoreSupports === -1 ? 99999 : indexOfCoreSupports;

    const ndisContactEndText = this.ExtractDataArray.find(i => i.toLowerCase().indexOf('plan start date:') !== -1);
    const indexOfNdisContactEndText = this.ExtractDataArray.indexOf(ndisContactEndText);
    // My NDIS Contact
    this.TempData = [...this.ExtractDataArray];
    if (indexOfmyNDISContact !== 99999 && indexOfmyNDISContact < indexOfNdisContactEndText) {
      const MyNDISContact = this.TempData.splice(indexOfmyNDISContact + 1, indexOfNdisContactEndText - indexOfmyNDISContact - 1).join(' ');
      this.MyNDISContact = MyNDISContact;
    }

    // ReviewDate Extract
    this.TempData = [...this.ExtractDataArray];
    const indexOfReviewValue = Math.max(indexOfCoreSupports, indexOfTotalBudget);
    if (indexOfReviewValue !== 99999 && indexOfTotalBudget < indexOfReviewValue) {
      const ReviewDate = this.TempData.splice(indexOfTotalBudget + 1, indexOfReviewValue - indexOfTotalBudget - 1).join(' ');
      const splitPlan = ReviewDate.split('-');
      const replaceReviewDate = splitPlan[1];
      this.PlanReviewDate = replaceReviewDate.replace('lanuary', 'January');
      this.PlanReviewDate = replaceReviewDate.replace('jiine', 'June');
    }

    // Total Core Support
    this.TempData = [...this.ExtractDataArray];
    const TotalCoreSupport = this.ExtractDataArray.find(i => i.indexOf('Total Core Supports') !== -1);
    let indexOfTotalCoreSupport = this.ExtractDataArray.indexOf(TotalCoreSupport);
    indexOfTotalCoreSupport = indexOfTotalCoreSupport === -1 ? 99999 : indexOfTotalCoreSupport;
    if (indexOfTotalCoreSupport !== 99999) {
      this.TotalCoreSupport = this.TempData.splice(indexOfTotalCoreSupport + 1, 1);
    }

    // Total Capacity Suppor
    this.TempData = [...this.ExtractDataArray];
    const TotalCapacitySupport = this.ExtractDataArray.find(i => i.indexOf('Total Capacity Building Supports') !== -1);
    let indexOfTotalCapacitySupport = this.ExtractDataArray.indexOf(TotalCapacitySupport);
    indexOfTotalCapacitySupport = indexOfTotalCapacitySupport === -1 ? 99999 : indexOfTotalCapacitySupport;
    if (indexOfTotalCapacitySupport !== 99999) {
      this.TotalCapacitySupport = this.TempData.splice(indexOfTotalCapacitySupport + 1, 1);
    }

    // Total Capital Support
    this.TempData = [...this.ExtractDataArray];
    const TotalCapitalSupport = this.ExtractDataArray.find(i => i.indexOf('Total Capital Supports') !== -1);
    let indexOfTotalCapitalSupport = this.ExtractDataArray.indexOf(TotalCapitalSupport);
    indexOfTotalCapitalSupport = indexOfTotalCapitalSupport === -1 ? 99999 : indexOfTotalCapitalSupport;
    if (indexOfTotalCapitalSupport !== 99999) {
      this.TotalCapitalSupport = this.TempData.splice(indexOfTotalCapitalSupport + 1, 1);
    }

    // Goal Type

    // Support Category Extraction between My and Funding Will be
    // New logic to find text of category and match next index is bugdet or not
    const AllCategory = this.ps.getAllSupportCategory();

    // const AllCategoryExtractArray = this.ExtractDataArray.filter(i => i.indexOf(' funding') !== -1 && i.indexOf('My ') !== -1);
    AllCategory.forEach(Category => {
      const indexOfCategoryExtractText = this.indexOfContainAll(this.ExtractDataArray, Category.SupportCategory);
      (i => i.toLowerCase().indexOf(Category.SupportCategory.toLowerCase()) !== -1 || i.indexOf(Category.SupportCategory) !== -1);
      indexOfCategoryExtractText.forEach(Text => {
        const SupportCategory = this.getBudgetofCategory(Text, 99999, Category, Category.SupportCategory);
        let indexOfCategoryTotal = 0;
        if (SupportCategory !== undefined) {
          if (SupportCategory.SupportType === 'Core Supports') {
            indexOfCategoryTotal = indexOfTotalCoreSupport;
          }
          if (SupportCategory.SupportType === 'Capital Supports') {
            indexOfCategoryTotal = indexOfTotalCapacitySupport;
          }
          if (SupportCategory.SupportType === 'Capacity Building Supports') {
            indexOfCategoryTotal = indexOfTotalCapacitySupport;
          }
          this.pushSupportCategory(SupportCategory);
        }
      });
    });
    setTimeout(() => {
      this.fileProgressStatus = 5;
      this.iconShow = 4;
      this.submitExtractedData();
    }, 1000);
  }

  getBudgetofCategory(currentIndex, maxIndex, category: Supportcategory, originalText): Supportcategory {
    // If budget is in next index
    const indexOfNextPaymentText = currentIndex + 1;
    const NextPaymentText = this.ExtractDataArray[indexOfNextPaymentText];
    if (NextPaymentText.indexOf('$') !== -1) {
      let Budget = NextPaymentText.match(/[0-9].*/g)[0].split(' ')[0];
      if (Budget !== '' || Budget !== undefined) {
        Budget = parseFloat(Budget.replace(',', ''));
        const secondaryText = this.ExtractDataArray[currentIndex + 2];
        if (secondaryText.indexOf('$') !== -1 && secondaryText.indexOf('-managed') !== -1) {
          const secondaryBudget = secondaryText.match(/[0-9].*/g)[0].split(' ')[0];
          if (secondaryBudget !== '' || secondaryBudget !== undefined) {
            Budget += parseFloat(secondaryBudget.replace(',', '').replace('$', ''));
          }
        }

        var PlanTypeText = this.ExtractDataArray.find(i => i.toLocaleLowerCase().indexOf(category.SupportCategory.toLocaleLowerCase()) != -1 && i.indexOf("will be") != -1);
        if (PlanTypeText == undefined) {
          PlanTypeText = this.ExtractDataArray.find(i => i.toLocaleLowerCase().indexOf(category.SupportCategory.toLocaleLowerCase()) != -1 && i.indexOf("My") != -1);
        }

        if (PlanTypeText === undefined) {
          PlanTypeText = this.ExtractDataArray.find(i => i.indexOf(Budget) !== -1 && i.indexOf('will be') !== -1);
        }

        if (PlanTypeText !== undefined && category.PlanType === '') {
          const PlanTypeIndex = this.ExtractDataArray.indexOf(PlanTypeText);
          if (PlanTypeText.indexOf('Plan') !== -1
            || PlanTypeText.indexOf('Plan-managed') !== -1
            || this.ExtractDataArray[PlanTypeIndex + 1].indexOf('Plan-managed') !== -1
            || this.ExtractDataArray[PlanTypeIndex + 2].indexOf('Plan-managed') !== -1
          ) {
            category.PlanType = 'Plan-Managed';
          }
          if (PlanTypeText.indexOf('NDIA') !== -1
            || PlanTypeText.indexOf('NDIA-managed') !== -1
            || this.ExtractDataArray[PlanTypeIndex + 1].indexOf('NDIA-managed') !== -1
            || this.ExtractDataArray[PlanTypeIndex + 2].indexOf('NDIA-managed') !== -1
          ) {
            category.PlanType = 'NDIA-Managed';
          }

          if (PlanTypeText.indexOf('Self') !== -1
            || PlanTypeText.indexOf('Self-managed') !== -1
            || this.ExtractDataArray[PlanTypeIndex + 1].indexOf('Self-managed') !== -1
            || this.ExtractDataArray[PlanTypeIndex + 2].indexOf('Self-managed') !== -1
          ) {
            category.PlanType = 'Self-Managed';
          }
        }

        return {
          SupportCategory: category.SupportCategory, Amount: Budget,
          SupportType: category.SupportType, PlanType: category.PlanType, ServiceProviders: [], HoverDescription: category.HoverDescription
        };
      }
    }

    if (NextPaymentText.toLowerCase() === 'quote required') {
      return {
        SupportCategory: category.SupportCategory, Amount: 'Quote Required',
        SupportType: category.SupportType, PlanType: 'Plan-Managed', ServiceProviders: [], HoverDescription: category.HoverDescription
      };
    }
  }

  pushSupportCategory(SupportCategory: Supportcategory): any {
    if (SupportCategory.SupportType === 'Core Supports') {
      if (this.CoreSupportArray.find(i => i.SupportCategory === SupportCategory.SupportCategory) === undefined) {
        this.CoreSupportArray.push(SupportCategory);
        localStorage.setItem('cared-coreSupportArray', JSON.stringify(this.CoreSupportArray));
        // this.ps.getSearviceProviders(SupportCategory.SupportCategory, this.ZipCode).subscribe(res => {
        //   SupportCategory.ServiceProviders = res["data"];
        // });
      }
    }

    if (SupportCategory.SupportType === 'Capital Supports') {
      if (this.CapitalSupportArray.find(i => i.SupportCategory === SupportCategory.SupportCategory) === undefined) {
        this.CapitalSupportArray.push(SupportCategory);
        localStorage.setItem('cared-capitalSupportArray', JSON.stringify(this.CapitalSupportArray));
        // this.ps.getSearviceProviders(SupportCategory.SupportCategory, this.ZipCode).subscribe(res => {
        //   SupportCategory.ServiceProviders = res["data"];
        // })
      }
    }

    if (SupportCategory.SupportType === 'Capacity Building Supports') {
      if (this.CapacitySupportArray.find(i => i.SupportCategory === SupportCategory.SupportCategory) === undefined) {
        this.CapacitySupportArray.push(SupportCategory);
        localStorage.setItem('cared-capacitySupportArray', JSON.stringify(this.CapacitySupportArray));
        if (localStorage.getItem('cared-capacitySupportArray') != null) {
          this.CapacitySupportArray = JSON.parse(localStorage.getItem('cared-capacitySupportArray'));
        }
        // this.ps.getSearviceProviders(SupportCategory.SupportCategory, this.ZipCode).subscribe(res => {
        //   SupportCategory.ServiceProviders = res["data"];
        // });
      }
    }

    if (this.CoreSupportArray.length === 0 && this.CapacitySupportArray.length === 0 && this.CapitalSupportArray.length === 0) {
      this.display = true;
    } else {
      this.display = false;
    }

  }

  clearData(): any {
    this.NDISNumber = undefined;
    this.PlanStartDate = undefined;
    this.PlanReviewDate = undefined;
    // this.imageSrc = '';
    // this.fileName = '';
    this.jobId = '';
    this.i = 0;
    this.responseData = [];
    this.responseStatus = '';
    this.aboutMe = undefined;
    this.friendsAndFamily = '';
    this.NDISplanstartdate = '';
    this.name = '';
    this.Birthdate = '';
    this.TotalBudget = undefined;
    this.ExtractDataArray = [];
    this.TotalCoreSupport = undefined;
    this.TotalCapacitySupport = undefined;
    this.TotalCapitalSupport = undefined;
    this.CoreSupportArray = [];
    this.CapitalSupportArray = [];
    this.CapacitySupportArray = [];
    this.TempData = [];
    this.SupportCategories = [];
    this.MyContactAddress = '';
    this.servicesAndCommunityInvolvement = '';
    this.ShortTermsGoals = [];
    this.MediumTermsGoals = [];
    this.HowIWillAchieve = [];
    this.HowIWillSupport = [];
    this.CombinedGoalsShortTerms = [];
    this.CombinedGoalsLongTerms = [];
    this.displayContain = false;
    this.ErrorMsg = '';
    localStorage.removeItem('cared-parse');
    localStorage.removeItem('cared-coreSupportArray');
    localStorage.removeItem('cared-capitalSupportArray');
    localStorage.removeItem('cared-capacitySupportArray');
    localStorage.removeItem('cared-personal-details');
    localStorage.removeItem('cared-planId');
  }

  indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);
  indexOfContainAll = (arr, val) => arr.reduce((acc, el, i) =>
    (el.toLowerCase().indexOf(val.toLowerCase()) !== -1 ? [...acc, i] : acc), [])

  // changeShowPersonalDetail(value): any {
  //   localStorage.setItem('cared-personal-details', value);
  //   if (value === true) {
  //     this.ShowPersonalDetail = true;
  //   } else {
  //     this.ShowPersonalDetail = false;
  //   }
  // }

  async submitExtractedData() {
    if (typeof this.friendsAndFamily === 'string') {
      this.friendsAndFamily = new Object([this.friendsAndFamily]);
    }
    if (!this.TotalBudget) {
      this.TotalBudget = 0;
    }
    var model = {
      aboutMe: this.aboutMe,
      birthDate: this.Birthdate ? new Date(this.Birthdate[0]) : '',
      address: this.MyContactAddress,
      displayId: 0,
      endDate: new Date(this.PlanReviewDate),
      familyAndFriends: this.friendsAndFamily ? this.friendsAndFamily.map(i => i).join(',') : '',
      participantName: this.name,
      reviewDate: new Date(this.PlanReviewDate),
      serviceCommunity: this.servicesAndCommunityInvolvement ? this.servicesAndCommunityInvolvement.map(i => i).join(',') : '',
      startDate: new Date(this.PlanStartDate),
      totalBudget: Math.trunc(this.TotalBudget.toString().replace(/,/g, '').split('$')[1]),
      userId: '',
      ndisNumber: this.NDISNumber ? this.NDISNumber.split('NDIS Number: ')[1] : '',
      planDocUrl: '',
      docSize: this.File.size
    };
    let url = '';
    let apiFileName = '';
    await this.ps.createFileUploadRequest('plan', 'pdf', this.fileName).then(res => {
      url = res.data.fileUploadResponse.presignedUrl;
      apiFileName = res.data.fileUploadResponse.filePath;
    });
    if (apiFileName !== undefined) {
      await this.ps.uploadFileToS3Bucket(File, url).then(res => {
        model.planDocUrl = apiFileName;
      });
    }
    this.subscriptions[this.subscriptions.length] = this.ps.savePlans(model).subscribe((res: Response) => {
      if (res.statusCode === 200) {
        this.iconShow = 5;
        this.fileProgressStatus = 0;
        clearInterval(this.Interval);
        this.allCategory();
        this.combinedAllCategory.forEach(element => {
          const subCategory = this.supportSubCategory
            .find(i => i.title.toLowerCase().indexOf(element.SupportCategory.toLowerCase()) !== -1);
          if (subCategory !== undefined) {
            element.SubCategoryId = subCategory.supportSubCategoryId;
          }
          if (element.PlanType !== '') {
            const planTypeId = this.planType.find(i => i.title.toLowerCase().indexOf(element.PlanType.toLowerCase()) !== -1);
            if (planTypeId !== undefined) {
              element.planTypeId = planTypeId.planTypeId;
            }
          }
        });
        const budgetList: any = [];
        const goalTypeName = [];
        this.goalTypeData.forEach(element => {
          const goal = this.goalType.find(i => i.title.indexOf(element) !== -1);
          goalTypeName.push(goal);
        });
        this.combinedAllCategory.forEach(ele => {
          const budgetModel =
          {
            supportSubCategoryId: ele.SubCategoryId,
            planId: res.data.planId,
            totalBudget: ele.Amount !== 'Quote Required' ? ele.Amount : 0,
            initialBudget: ele.Amount !== 'Quote Required' ? ele.Amount : 0,
            onHoldBudget: 0,
            spentBudget: 0,
            planTypeId: ele.planTypeId ? ele.planTypeId : 1,
            isDeleted: false
          };
          budgetList.push(budgetModel);
        });
        let goalList: any = [];
        this.CombinedGoalsShortTerms.forEach(element => {
          const index = this.CombinedGoalsShortTerms.indexOf(element);
          const modell: CreateGoalData =
          {
            achievementMethod: this.HowIWillAchieve[index],
            description: element,
            fundingSource: this.HowIWillSupport[index],
            goalTypeId: goalTypeName.length > 0 ? goalTypeName.find(i => i.title.indexOf('Short-term goal') !== -1).goalTypeId : 0,
            goalStatusId: this.goalsStatus.length > 0 ? this.goalsStatus.find(i => i.title.indexOf('In Progress') !== -1).goalStatusId : 0,
            planId: res.data.planId,
            // "goalRelatesToId": 0
          };
          goalList.push(modell);
        });
        this.CombinedGoalsLongTerms.forEach(element => {
          const index = this.CombinedGoalsLongTerms.indexOf(element);
          const modell =
          {
            achievementMethod: this.HowIWillAchieve[index],
            description: element,
            fundingSource: this.HowIWillSupport[index],
            goalTypeId: this.goalType.length > 0 ? this.goalType
              .find(i => i.title.indexOf('Medium or long-term goal') !== -1).goalTypeId : 0,
            goalStatusId: this.goalsStatus.length > 0 ? this.goalsStatus.find(i => i.title.indexOf('In Progress') !== -1).goalStatusId : 0,
            planId: res.data.planId,
            // "goalRelatesToId": 0
          };
          goalList.push(modell);
        });
        goalList = this.uniqueData(goalList, 'description');
        // goalList = goalList.slice(0,10);
        const budget = this.ps.createBudgetsByPlanId(res.data.planId, budgetList);
        const goals = this.ps.createGoals(res.data.planId, goalList);
        this.subscriptions[this.subscriptions.length] = forkJoin([budget, goals]).subscribe((results: Response[]) => {
          if (results[0].statusCode === 200 && results[1].statusCode === 200) {

            this.router.navigate(['planparser/step-one-plandetail/', res.data.planId]);
          }
        }, error => {
          this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        });
      }
    }, error => {
      this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
    });
  }
  allCategory(): any {
    this.combinedAllCategory = [...this.CoreSupportArray, ...this.CapacitySupportArray, ...this.CapitalSupportArray];
    return this.combinedAllCategory;
  }
  changeShowPersonalDetail(value): any {
    localStorage.setItem('cared-personal-details', value);
    if (value === true) {
      this.ShowPersonalDetail = true;
    } else {
      this.ShowPersonalDetail = false;
    }
  }
  uniqueData(array, key): any {
    const uniqueArray = [];
    const map = new Map();
    array.forEach((user, index) => {
      if (index === 0) {
        map.set(array[index].description, array[index].description);
        uniqueArray.push(array[index]);
      }
      if (!map.get(user[key])) {
        map.set(user[key], user[key]);
        uniqueArray.push(user);
      }
    });
    return uniqueArray;
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
