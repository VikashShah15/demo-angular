import { Component, OnInit } from '@angular/core';
import { Supportcategory } from '../../supportcategory';
import { PlanparserService } from '../../Service/planparser.service';


@Component({
  selector: 'app-serviceprovider',
  templateUrl: './serviceprovider.component.html',
  styleUrls: ['./serviceprovider.component.css']
})
export class ServiceproviderComponent implements OnInit {
  private NDISNumber: any;
  private AboutMe: any;
  private FriendsAndFamily: any;
  private ServicesAndCommunityInvolvement: any;
  private PlanStartDate: any;
  private Name: any;
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
  private ShortTermsGoals: any = [];
  private MediumTermsGoals: any = [];
  private HowIWillAchieve: any = [];
  private HowIWillSupport: any = [];
  private CombinedGoals: any = [];
  private MyNDISContact = '';
  private FooterIndexes = [];
  private MyContactAddress: any;
  private display = false;
  private ZipCode = '';
  private supportCategory: any = [];
  private supportSubCategory: any = [];
  private serviceProvider: any = [];
  public supportSubCategoryWithServiceProvider: any = [];
  constructor(
    private ps: PlanparserService) {
  }
  ngOnInit(): void {
    this.loadData();
  }
  async loadData() {
    if (localStorage.getItem('cared-parse') != null) {
      const ExtractDataArray = JSON.parse(localStorage.getItem('cared-parse'));
      this.parseDataToView(ExtractDataArray);
    }
    await this.ps.getCategories().then(res => {
      this.supportCategory = res.data.supportCategories;

    });
    await this.ps.getSupportCategories().then(res => {
      this.supportSubCategory = res.data.supportSubCategories;
      this.serviceProvider = this.ps.getSupportSubCategoryArray();
      const serviceProvide = this.serviceProvider
        .filter(i => this.supportSubCategory.some(o => i.SupportSubCategoryId === o.supportSubCategoryId
          && i.SupportCategoryId === o.supportCategoryId));
      serviceProvide.forEach(element => {
        element.ServiceProvider.forEach(ele => {
          this.ps.getServiceProviderData('', ele, 'none', 'none').subscribe(ress => {
            ress.data.forEach(e => {
              e.supportCategory = this.supportCategory.find(i => i.supportCategoryId === element.SupportCategoryId).title;
              e.supportSubCategory = this.supportSubCategory.find(i => i.supportSubCategoryId === element.SupportSubCategoryId).title;
            });
            this.supportSubCategoryWithServiceProvider = ress.data;
          });
        });
      });
    });
  }
  parseDataToView = (res) => {
    this.ExtractDataArray = res;
    const AboutMe = this.ExtractDataArray.find(i => i.toLowerCase() === 'about me');
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
      this.ZipCode = this.MyContactAddress.match(/[1-9][0-9][0-9][0-9]/)[0];
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
          this.Name = n[1];
        }
      });
    }

    // My Goals
    // shortTermsGoals
    const indexOfShortTermsGoals = this.indexOfAll(this.ExtractDataArray, 'Short-term goal');
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
        this.CombinedGoals = this.ShortTermsGoals.length > this.MediumTermsGoals.length ? this.MediumTermsGoals : this.ShortTermsGoals;
      }
    });

    // About ME
    this.TempData = [...this.ExtractDataArray];
    const indexAboutMeEnd = Math.min(indexOfFamilyandfriends, indexOfMyFamilyandfriends,
      indexOfServiceAndCommunity, indexOfMyServiceAndCommunity);
    if (indexAboutMeEnd !== 99999 && indexOfAboutMe < indexAboutMeEnd) {
      const AboutmeText = this.TempData.splice(indexOfAboutMe + 1, indexAboutMeEnd - indexOfAboutMe - 1).join(' ');
      this.AboutMe = AboutmeText.replace('Family and', '');
    }

    // Family and Friends Text Extraction
    this.TempData = [...this.ExtractDataArray];
    const FooterIndexx = FooterIndexes.find(i => i > indexOfFamilyandfriends);
    const indexOfFamilyandfriendsEnd = Math.min(indexOfServiceAndCommunity, indexOfMyGoals, FooterIndexx);
    if (indexOfFamilyandfriendsEnd !== 99999 && indexOfFamilyandfriends < indexOfFamilyandfriendsEnd) {
      const FriendsAndFamilyText = this.TempData.splice(indexOfFamilyandfriends + 1,
        indexOfFamilyandfriendsEnd - indexOfFamilyandfriends - 1).join(' ');
      this.FriendsAndFamily = FriendsAndFamilyText.split('E ');
    }

    // My Family and Friends Text Extraction
    this.TempData = [...this.ExtractDataArray];
    const indexOfmyFamilyandfriendsEnd = Math.min(indexOfMyServiceAndCommunity, indexOfMyGoals);
    if (indexOfFamilyandfriendsEnd !== 99999 && indexOfMyFamilyandfriends < indexOfmyFamilyandfriendsEnd) {
      const FriendsAndFamilyText = this.TempData.splice(indexOfMyFamilyandfriends + 1, indexOfmyFamilyandfriendsEnd
        - indexOfMyFamilyandfriends - 1).join(' ');
      this.FriendsAndFamily = FriendsAndFamilyText.replace('PERSONAL INFORMATION CONFIDENTIAL', '');
    }

    // Services and community involvement
    this.TempData = [...this.ExtractDataArray];
    const FooterIndexxx = FooterIndexes.find(i => i > indexOfServiceAndCommunity);
    if (indexOfServiceAndCommunity !== 99999 && indexOfServiceAndCommunity < FooterIndexxx) {
      let ServicesAndCommunityInvolvementText = this.TempData.splice(indexOfServiceAndCommunity + 1,
        FooterIndexxx - indexOfServiceAndCommunity - 1).join(' ');
      ServicesAndCommunityInvolvementText = ServicesAndCommunityInvolvementText.replace(' L ', 'E ').replace('L ', 'E ');
      this.ServicesAndCommunityInvolvement = ServicesAndCommunityInvolvementText.split('E ');
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

    // Support Category Extraction between My and Funding Will be
    // New logic to find text of category and match next index is bugdet or not
    const AllCategory = this.ps.getAllSupportCategory();

    // const AllCategoryExtractArray = this.ExtractDataArray.filter(i => i.indexOf(' funding') !== -1 && i.indexOf('My ') !== -1);
    AllCategory.forEach(Category => {
      const indexOfCategoryExtractText = this.indexOfContainAll(this.ExtractDataArray, Category.SupportCategory);
      (i => i.toLowerCase().indexOf(Category.SupportCategory.toLowerCase()) !== -1 || i.indexOf(Category.SupportCategory) !== -1);
      indexOfCategoryExtractText.forEach(Text => {
        // var indexOfText = this.ExtractDataArray.indexOf(Text);
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
  }

  getBudgetofCategory(currentIndex, maxIndex, category, originalText): Supportcategory {
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
        return {
          SupportCategory: category.SupportCategory, Amount: Budget,
          SupportType: category.SupportType, PlanType: 'Plan-Managed', ServiceProviders: [], HoverDescription: category.HoverDescription
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
        this.ps.getSearviceProviders(SupportCategory.SupportCategory, this.ZipCode).subscribe(res => {
          SupportCategory.ServiceProviders = res['data'];
        });
      }
    }

    if (SupportCategory.SupportType === 'Capital Supports') {
      if (this.CapitalSupportArray.find(i => i.SupportCategory === SupportCategory.SupportCategory) === undefined) {
        this.CapitalSupportArray.push(SupportCategory);
        localStorage.setItem('cared-capitalSupportArray', JSON.stringify(this.CapitalSupportArray));
        this.ps.getSearviceProviders(SupportCategory.SupportCategory, this.ZipCode).subscribe(res => {
          SupportCategory.ServiceProviders = res['data'];
        });
      }
    }

    if (SupportCategory.SupportType === 'Capacity Building Supports') {
      if (this.CapacitySupportArray.find(i => i.SupportCategory === SupportCategory.SupportCategory) === undefined) {
        this.CapacitySupportArray.push(SupportCategory);
        localStorage.setItem('cared-capacitySupportArray', JSON.stringify(this.CapacitySupportArray));
        if (localStorage.getItem('cared-capacitySupportArray') != null) {
          this.CapacitySupportArray = JSON.parse(localStorage.getItem('cared-capacitySupportArray'));
        }
        this.ps.getSearviceProviders(SupportCategory.SupportCategory, this.ZipCode).subscribe(res => {
          SupportCategory.ServiceProviders = res['data'];
        });
      }
    }


    if (this.CoreSupportArray.length === 0 && this.CapacitySupportArray.length === 0 && this.CapitalSupportArray.length === 0) {
      this.display = true;
    } else {
      this.display = false;
    }
  }
  indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);
  indexOfContainAll = (arr, val) => arr.reduce((acc, el, i) =>
    (el.toLowerCase().indexOf(val.toLowerCase()) !== -1 ? [...acc, i] : acc), []);
  // fetchCategories(i) {
  //   if (i == 1) {
  //     return this.CoreSupportArray;
  //   }
  //   else if (i == 2) {
  //     return this.CapacitySupportArray;
  //   }
  //   else if (i == 3) {
  //     return this.CapitalSupportArray;
  //   }
  // }
  // fetchServiceProvide(j) {
  //   const cat = this.supportSubCategory.find(i => i.title == j);
  //    const subCat = this.ps.SupportSubCategory.find(k=> k.SupportSubCategoryId == cat.supportSubCategoryId);
  //    for(let i = 0; i < subCat.ServiceProvider.length; i++){
  //    }
  // }
}
