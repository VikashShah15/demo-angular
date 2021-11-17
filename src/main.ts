import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (environment.TRACKING_ID) {
  const node = document.createElement('script');
  node.async = true;
  const script = document.createTextNode('window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); }; gtag(\'js\', new Date()); gtag(\'config\', \'' + environment.TRACKING_ID + '\');');
  node.appendChild(script);
  document.getElementsByTagName('head')[0].appendChild(node);

  const node2 = document.createElement('script');
  node2.async = true;
  node2.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.TRACKING_ID;
  document.getElementsByTagName('head')[0].appendChild(node2);
  // document.write('<script>gtag(\'config\', \'' + environment.trackingId + '\');</script>');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
