// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  TRACKING_ID: 'UA-197134759-1',
  BASE_URL_POST: 'https://82ekm3ohze.execute-api.ap-southeast-2.amazonaws.com/default/',
  BASE_URL_GET: 'https://vs6xwddjgj.execute-api.ap-southeast-2.amazonaws.com/default/',
  SEARVICE_PROVIDER: 'https://api.cared.com.au/searchProvider',
  BASE_URL_PROFILE: 'https://planparserapi.cared.com.au/',
  BASE_URL_AUTHENTICATION: 'http://ec2-3-25-133-138.ap-southeast-2.compute.amazonaws.com:8085/',
  // BASE_URL_AUTHENTICATION: 'https://backend-staging.cared.com.au/',
  BASE_URL_AUTH_SERVER: 'http://ec2-3-25-133-138.ap-southeast-2.compute.amazonaws.com:8090/',
  PARSING_TYPE: 'Text',
  // BASE_URL: 'https://d7yhsqqh92.execute-api.us-west-2.amazonaws.com/Test/',
  isVisibleOnProduction: 1,
  firebaseConfig: {
    apiKey: 'AIzaSyCBRX-cZ3lhUOy-Y35OVvG3SaiyO-fFR9Y',
  authDomain: 'cared-portal-ed892.firebaseapp.com',
  projectId: 'cared-portal-ed892',
  storageBucket: 'cared-portal-ed892.appspot.com',
  messagingSenderId: '733559276327',
  appId: '1:733559276327:web:b39d4ade8f02886c8adf02',
  measurementId: 'G-XM0KMB8TZ1'
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
