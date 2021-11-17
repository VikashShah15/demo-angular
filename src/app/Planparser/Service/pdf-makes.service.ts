import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfMakesService {
  d1 = [];
  d2 = [];
  d3 = [];
  d4 = [];
  d5 = [];
  d6 = [];
  d7 = [];
  constructor() { }
  async getDocumentDefinition(
    name,
    birthdate,
    planstartdate,
    planreviewdate,
    MyContactAddress,
    TotalBudget,
    CoreSupportArray,
    TotalCoreSupport,
    TotalCapacitySupport,
    CapacitySupportArray,
    CapitalSupportArray,
    TotalCapitalSupport,
    AboutMe,
    FriendsAndFamily,
    ServicesAndCommunityInvolvement,
    CombinedGoalsShortTerms,
    CombinedGoalsLongTerms
  ) {
    if (FriendsAndFamily !== undefined && FriendsAndFamily !== '') {
      this.d1.push(FriendsAndFamily);
    }
    if (ServicesAndCommunityInvolvement !== undefined && ServicesAndCommunityInvolvement !== '') {
      this.d2.push(ServicesAndCommunityInvolvement);
    }
    CombinedGoalsShortTerms.forEach((element, i) => {
      this.d3.push(element);
      this.d4.push({ goal: element.description, howiwillachieve: element.achievementMethod, howiwillsupport: element.fundingSource });
    });
    if (CombinedGoalsLongTerms.length > 0){
    CombinedGoalsLongTerms.forEach((element, i) => {
      this.d7.push({ goal: element.description, howiwillachieve: element.achievementMethod, howiwillsupport: element.fundingSource });
    });
  }
    return {
      pageMargins: [40, 80, 40, 50],
      header: {
        columns: [
          {
            image: await this.getBase64ImageFromURL('https://i.ibb.co/gjpP0Tg/logo-dark-300x226.png'),
            width: 70,
            alignment: 'left',
            margin: [40, 10, 0, 8]
          },
          {
            text: name + '\'s Plan',
            alignment: 'center',
            margin: [0, 20, 0, 8],
            fontSize: 14,
            bold: true,
            color: '#da1a5d',
          }
        ]
      },
      footer: {
        columns: [
          {
            text: 'If you use our Plan Parser/Explainer for the purposes of understanding your NDIS plan, you do so at your own risk. We do not warrant that the information produced by the Plan Parser/Explainer is accurate, error-free or up-to-date. You must not rely on, or encourage any person to rely on, any results, reports or figures produced by our Cared Calculator without independently verifying the validity and accuracy thereof. The results produced by the Plan Parser/Explainer may not reflect accurately and the results shown by the Plan Parser/Explainer are on the basis of best efforts only.',
            alignment: 'left',
            margin: [40, 0, 60, 50],
            fontSize: 8,
            height: 'auto',
            width: 'auto'
          }
        ]
      },
      info: {
        title: 'title',
        subject: 'Diagnostic Report',
        keywords: 'keywords'
      },
      content: [
        {
          table: {
            style: 'tableExample',
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            width: ['25%', '25%', '25%', '25%'],

            body: [
              [{ style: 'name', text: 'My Name: ' }, { text: name }],
              [{ style: 'name', text: 'Date of Birth:' }, { text: birthdate !== null ? birthdate : 'NA' }],
              [{ style: 'name', text: 'Plan Start Date: ' }, { text: planstartdate }],
              [{ style: 'name', text: 'Plan Review Date: ' }, { text: planreviewdate }],
            ]
          }
        },
        { text: '', margin: [0, 20, 0, 8] },
        {
          table: {
            style: 'name',

            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            width: ['50%', '50%'],
            body: [
              [{ style: 'name', text: 'My Address: ' }, { text: MyContactAddress }],
              [{ style: 'name', text: 'Total Budget: ' }, { text: TotalBudget }],
            ]
          }
        },
        { text: 'CORE SUPPORT', style: 'name', margin: [0, 20, 0, 8] },
        {
          table: {
            style: 'tableExample',
            widths: ['33.33%', '33.33%', '33.33%'],
            body: this.BuildBodyCoreSupport(CoreSupportArray)
          },

        },
        {
          table: {
            widths: [400, 'auto', 'auto'],
            body: this.BuildBodyTotalCoreTotal(TotalCoreSupport)
          }
        },
        { text: 'CAPACITY BUILDING', style: 'name', margin: [0, 20, 0, 8] },
        {
          table: {
            style: 'tableExample',
            widths: ['33.33%', '33.33%', '33.33%'],
            body: this.BuildBodyCapacityBuilding(CapacitySupportArray)
          },

        },
        {
          table: {
            widths: [400, 'auto', 'auto'],
            body: this.BuildBodyTotalCapacitySupport(TotalCapacitySupport)
          }
        },
        { text: 'CAPITAL SUPPORT', style: 'name', margin: [0, 20, 0, 8] },
        {
          table: {
            style: 'tableExample',
            widths: ['33.33%', '33.33%', '33.33%'],
            body: this.BuildBodyCapitalSupport(CapitalSupportArray)
          },

        },
        {
          table: {
            widths: [400, 'auto', 'auto'],
            body: this.BuildBodyTotalCapitalSupport(TotalCapitalSupport ? TotalCapitalSupport : TotalCapitalSupport)
          }
        },
        { text: 'About Me', style: 'name', margin: [0, 20, 0, 8] },
        { text: AboutMe, alignment: 'Left' },
        { text: FriendsAndFamily ? 'Family and Friends' : '', style: 'name', margin: [0, 20, 0, 8] },
        {
          ul: this.d1
        },
        { text: ServicesAndCommunityInvolvement ? 'Services and community involvement' : '', style: 'name', margin: [0, 20, 0, 8] },
        {
          ul: this.d2
        },
        { text: 'Goals', style: 'name', margin: [0, 20, 0, 8] },
        // {
        //   ul: this.d3
        // },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: this.BuildBodyShortGoal(this.d4)
          },
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: this.BuildBodyLongGoal(this.d7)
          },
        },
        { text: 'Understanding your Support Budget', style: 'name', margin: [0, 20, 0, 8], },
        {
          text: 'There are three types of support budgets that may be funded in your NDIS plan:',
          alignment: 'Left', bold: true, margin: [0, 20, 0, 8]
        },
        {
          ul: ['Core Supports budget', 'Capacity Building Supports budget', 'Capital Supports budget'],
        },
        { text: 'Core Supports Budget', style: 'name', margin: [0, 20, 0, 8] },
        {
          text: 'Core Supports help you with everyday activities, your current disability-related needs and to work towards your goals.',
          alignment: 'Left', margin: [0, 10, 0, 8]
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [{
                text: 'Category', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }, {
                text: 'Description', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }],
              ['Assistance with Daily Life', 'For example, assistance with everyday needs, household cleaning and/or yard maintenance.'],
              ['Consumables', 'Everyday items you may need. For example, continence products or low-cost assistive technology and equipment to improve your independence and/or mobility.'],
              ['Assistance with Social & Community Participation', 'For example, a support worker to assist you to participate in social and community activities.'],
              ['Transport', 'This is support that helps you travel to work or other places that will help you achieve the goals in your plan How you can spend your transport funding and how it is paid to you (whether upfront or in regular payments) will be different for each person. Your LAC will explain how you can use this budget.'],

            ],
          },
        },
        { text: 'Capacity Building Supports budget', style: 'name', margin: [0, 20, 0, 8] },

        { text: 'Capacity Building Supports help build your independence and skills to help you reach your long-term goals. Capacity Building Supports budget cannot be moved from one support category to another. Funding can only be used to purchase approved individual supports that fall within that Capacity Building category.', alignment: 'Left', margin: [0, 10, 0, 8] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [{
                text: 'Support Category', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }, {
                text: 'Description', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }],
              ['Support Coordination', 'This is a fixed amount for a Support Coordinator to help you use your plan.'],
              ['Improved Living Arrangements', 'Support to help you find and maintain an appropriate place to live.'],
              ['Increased Social & Community Participation', 'Development and training to increase your skills so you can participate in community, social and recreational activities.'],
              ['Finding & Keeping a Job', 'This may include employment-related support, training and assessments that help you find and keep a job, such as the School Leaver Employment Supports (SLES).'],
              ['Improved Relationships', 'This support will help you develop positive behaviours and interact with others.'],
              ['Improved Health & Wellbeing', 'Including exercise or diet advice to manage the impact of your disability. The NDIS does not fund gym memberships.'],
              ['Improved Learning', 'Examples include training, advice and help for you to move from school to further education, such as university or TAFE.'],
              ['Improved Life Choices', 'Plan management to help you manage your plan, funding and paying for services.'],
              ['Improved Daily Living', 'Assessment, training or therapy to help increase your skills, independence and community participation. These services can be delivered in groups or individually.'],

            ]
          },
        },
        { text: 'Capital Supports budget', style: 'name', margin: [0, 20, 0, 8] },

        { text: 'Capital Supports include higher-cost pieces of assistive technology, equipment and home or vehicle modifications, and funding for one-off purchases you may need (including Specialist Disability Accommodation). It is important to remember that funds within the Capital Supports budget can only be used for their specific purpose and cannot be used to pay for anything else.', alignment: 'Left', margin: [0, 10, 0, 8] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [{
                text: 'Support Category', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }, {
                text: 'Description', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }],
              ['Assistive Technology', 'This includes equipment items for mobility, personal care, communication and recreational inclusion such as wheelchairs or vehicle modifications.'],
              ['Home Modifications', 'Home modifications such as installation of a hand rail in a bathroom, or Specialist Disability Accommodation for participants who require special housing because of their disability.'],
              ['Assistance with Social & Community Participation', 'For example, a support worker to assist you to participate in social and community activities.'],
              ['Transport', 'This is support that helps you travel to work or other places that will help you achieve the goals in your plan How you can spend your transport funding and how it is paid to you (whether upfront or in regular payments) will be different for each person. Your LAC will explain how you can use this budget.']
            ]
          }
        },
        {
          text: 'Understanding how your plan funds your goals?', alignment: 'Left',
          bold: true, margin: [0, 20, 0, 8], style: 'name', pageBreak: 'before',
        },
        { text: 'To understand your plan read the description under each area and relate it back to a goal. The NDIA provides funding for their participants to achieve their goals. If you have a goal that has no related funding, then you can question the NDIA planner or LAC.', alignment: 'Left', margin: [0, 10, 0, 8] },
        { text: 'Example One:', margin: [0, 20, 0, 8] },
        { text: 'Your goal relates to daily activities and community access plus further education. Your funding for daily activities and community access is funded under Core Supports. Transport funding assists with all these goals.', alignment: 'Left', margin: [0, 10, 0, 8] },
        { text: 'Goal/s my Core Supports funding can help me achieve: - During this plan I would to be independent with more of my daily living activities and access the community, specifically further education.', alignment: 'Left', margin: [0, 10, 0, 8] },
        { text: 'My Capacity Building funding can be spent in the following ways:', alignment: 'Left', margin: [0, 10, 0, 0] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [{
                text: 'Core Supports', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }, {
                text: 'Budget', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }],
              ['Core supports are to assist with undertaking activities of daily living. This typically includes self-care and community participation. The supports are flexible and allow you to allocate your funding to purchase services that will assist ypu to meet your plan goals. DALY ACTIVITIES: Funding to assist you, and/or supervision of your dailypersonal care needs to enable maximum independence. Flexible support to explore and participate in community based activities of interest and to develop,build and maintain friendships.', '$90,000'],
              ['My Core Supports funding will be: ', '$90,000 Plan-managed'],
              ['Transport Support to access work and travel to participate in social and community activities. This amount will be paid fortnightly into your nominated bank account on a pro-rata basis.', '$3,500'],
              [{ text: 'Total Core Supports', }, '$93,500']
            ]
          }
        },
        { text: 'Example Two:', margin: [0, 20, 0, 8] },
        { text: 'Your goal relates to capacity building for community access and independence. Your funding is funded under Capacity Building. An allied health professional or therapist is funded in this part of your plan to help you achieve these goals.', alignment: 'Left', margin: [0, 10, 0, 8] },
        { text: 'You need to find a physio and/or OT provider to help you meet your goals. You may already be using one of these professionals or know one you may want to try. Your plan is plan managed so the provider does not have to be registered with the NDIA The NDIA pays for your plan manager under this part of your plan. The plan manager gets paid a single setup fee then a month fee for each month of your plan.', alignment: 'Left', margin: [0, 10, 0, 8] },
        { text: 'Goal/s my Capacity Building Supports funding can help me achieve: - I would like support so that I can more readily access the community to be more independent - I would like support to allow me to attend university and complete my studies - I would like support to continue my physio and OT treatments to assist with the management of my disability', alignment: 'Left', margin: [0, 10, 0, 8] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [{
                text: 'Capacity Building Supports', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }, {
                text: 'Budget', bold: true,
                color: '#FFFFFF',
                fillColor: '#da1a5d',
                alignment: 'left'
              }],
              ['Improved Life Choices (CB Choice & Control) STATED SUPPORT: Financial intermediary set up costs and monthly processing fees for your financial plan manager to manage your Plan My Stated Supports funding will be: - $227.53 NDIS-managed Plan Management And Financial Capacity Building — Set Up Costs - $1,472.47 NDIA-managed Plan Management — Financial Administration', '$1,700'],
              ['Improved Daily Living (CB Daily Activity) Funding for an allied health professional or therapist to assess and provide support in assisting you to meet your plan goals. Supports to work together within the home and community settings. My Improved Daily Living funding will be: - $17,500 Plan-managed', '$17,500'],
              [{ text: 'Total Capacity Building Supports' }, '$19,200']
            ]
          }
        },
        { text: 'Disclaimer:', style: 'name', margin: [0, 50, 0, 8], pageBreak: 'before', },
        { text: 'The information contained on https://planparser.cared.com.au/ website is for general information purposes only. Cared Australia assumes no responsibility for errors or omissions in the contents on the Service.In no event shall Cared Australia Pty Ltd(henceforth Cared Australia) be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. Cared Australia reserves the right to make additions, deletions, or modification to the contents on the Service at any time without prior notice.This Disclaimer for Cared Australia has been created with the help of Cared Australia does not warrant that the website is free of viruses or other harmful components.', alignment: 'Left', margin: [0, 10, 0, 8] },
        { text: 'Cared Australia Pty Ltd,', alignment: 'Left', margin: [0, 10, 0, 8] },
        { text: '10 Help St,', alignment: 'Left', },
        { text: 'Chatswood NSW 2067,', alignment: 'Left', },
        { text: 'Australia', alignment: 'Left', },
        { text: 'https://cared.com.au/', alignment: 'Left', },

      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline',
          color: '#da1a5d',
        },
        name: {
          fontSize: 12,
          bold: true,
          color: '#da1a5d',
        },
        tableHeader: {
          bold: true,
          color: '#FFFFFF',
          fillColor: '#da1a5d',
          alignment: 'left'
        }
      }
    };
  }
  BuildBodyCoreSupport(CoreSupportArray): any {
    const bodyData = [];
    bodyData.push([
      { text: 'Category', style: 'tableHeader', },
      { text: 'Amount', style: 'tableHeader', },
      { text: 'Type', style: 'tableHeader', }
    ]);
    if (CoreSupportArray.length > 0) {
      CoreSupportArray.forEach(elem => {
        const d = Object.assign([], []);
        d.push(elem['subCategory']);
        d.push('$' + '' + elem['totalBudget']);
        d.push(elem['planType']);
        bodyData.push(d);
      });
      return bodyData;
    }
    else{
      const d = Object.assign([], []);
      d.push('-');
      d.push('-');
      d.push('-');
      bodyData.push(d);
      return bodyData;
    }
  }
  BuildBodyTotalCapitalSupport(TotalCapitalSupport): any {
    const bodyData = [];
    bodyData.push([
      { text: 'Total Capital Support', colSpan: 2, },
      {},
      { text: TotalCapitalSupport, },
    ]);
    return bodyData;
  }
  BuildBodyTotalCoreTotal(TotalCoreSupport) {
    const bodyData = [];
    bodyData.push([
      { text: 'Total Core Support', colSpan: 2, },
      {},
      { text: TotalCoreSupport },
    ]);
    return bodyData;
  }
  BuildBodyTotalCapacitySupport(TotalCapacitySupport): any {
    const bodyData = [];
    bodyData.push([
      { text: 'Total Capacity Support', colSpan: 2, },
      {},
      { text: TotalCapacitySupport, },
    ]);
    return bodyData;
  }
  BuildBodyCapacityBuilding(CapacitySupportArray): any {
    const bodyData = [];
    bodyData.push([
      { text: 'Category', style: 'tableHeader', },
      { text: 'Amount', style: 'tableHeader', },
      { text: 'Type', style: 'tableHeader', }
    ]);
    if (CapacitySupportArray.length > 0) {
      CapacitySupportArray.forEach(elem => {
        const d = Object.assign([], []);
        d.push(elem['subCategory']);
        d.push('$' + '' + elem['totalBudget']);
        d.push(elem['planType']);
        bodyData.push(d);
      });
      return bodyData;
    }
    else{
      const d = Object.assign([], []);
      d.push('-');
      d.push('-');
      d.push('-');
      bodyData.push(d);
      return bodyData;
    }
  }
  BuildBodyCapitalSupport(CapitalSupportArray): any {
    const bodyData = [];
    bodyData.push([
      { text: 'Category', style: 'tableHeader', },
      { text: 'Amount', style: 'tableHeader', },
      { text: 'Type', style: 'tableHeader', }
    ]);
    if (CapitalSupportArray.length > 0 || CapitalSupportArray !== []) {
      CapitalSupportArray.forEach(elem => {

        const d = Object.assign([], []);
        d.push(elem['subCategory']);
        d.push('$' + '' + elem['totalBudget']);
        d.push(elem['planType']);
        bodyData.push(d);
      });
      return bodyData;
    }
    else{
      const d = Object.assign([], []);
      d.push('-');
      d.push('-');
      d.push('-');
      bodyData.push(d);
      return bodyData;
    }
  }
  BuildBodyShortGoal(goal): any {
    const bodyData = [];
    bodyData.push([
      { text: 'Short term Goal', style: 'tableHeader', },
      { text: 'HOW I WILL ACHIEVE THIS GOAL', style: 'tableHeader', },
      { text: 'HOW I WILL BE SUPPORTED', style: 'tableHeader', }
    ]);
    if (goal.length > 0) {
      goal.forEach(elem => {
        const d = Object.assign([], []);
        d.push(elem['goal']);
        d.push(elem['howiwillachieve']);
        d.push(elem['howiwillsupport']);

        bodyData.push(d);
      });
      return bodyData;
    }
    else{
      const d = Object.assign([], []);
      d.push('-');
      d.push('-');
      d.push('-');
      bodyData.push(d);
      return bodyData;
    }
  }
  BuildBodyLongGoal(goal): any {
    const bodyData = [];
    bodyData.push([
      { text: 'Long term Goal', style: 'tableHeader', },
      { text: 'HOW I WILL ACHIEVE THIS GOAL', style: 'tableHeader', },
      { text: 'HOW I WILL BE SUPPORTED', style: 'tableHeader', }
    ]);
    if (goal.length > 0) {
      goal.forEach(elem => {
        const d = Object.assign([], []);
        d.push(elem['goal']);
        d.push(elem['howiwillachieve']);
        d.push(elem['howiwillsupport']);
        bodyData.push(d);
      });
      return bodyData;
    }else{
      const d = Object.assign([], []);
      d.push('-');
      d.push('-');
      d.push('-');
      bodyData.push(d);
      return bodyData;
    }
  }
  getBase64ImageFromURL(url): any {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
}
