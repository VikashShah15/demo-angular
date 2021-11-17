import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
// declare let ga: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sample';
  constructor(private router: Router) {
    // if (environment.trackingId) {
      
    //   console.log(environment.trackingId);
    //   const gTagManagerScript = document.createElement('script');
    //   gTagManagerScript.async = true;
    //   gTagManagerScript.setAttribute('src',`https://www.googletagmanager.com/gtag/js?id=${environment.trackingId}`)
    //   document.head.appendChild(gTagManagerScript);
  
      
    //   const gaScript = document.createElement('script');
    //   gaScript.innerHTML = `.
    //     window.dataLayer = window.dataLayer || [];
    //     function gtag() { dataLayer.push(arguments); }
    //     gtag('js', new Date());
    //     gtag('config', '${environment.trackingId}');
    //   `;
    //   document.head.appendChild(gaScript);
    // }
    // this.router.events.subscribe(event => {

    //   if (event instanceof NavigationEnd) {
    //     ga('set', 'page', event.urlAfterRedirects);
    //     ga('send', 'pageview');
    //   }
    // });
   }
  // @HostListener('window:unload', ['$event'])
  // unloadHandler(event): any {
  //   localStorage.clear();

  // }
  
}
