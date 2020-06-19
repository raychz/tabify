
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  viewTabs = true;
  private hideTabBarPages: string[] = [
    'locations', 'pay', 'select', 'confirm', 'review'
  ];

  constructor(private router: Router, private platform: Platform) {
    this.navEventsPipe();
  }

    // A simple subscription that tells us what page we're currently navigating to.
    private navEventsPipe() {
      this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
        console.log(e);
        this.showHideTabs(e);
      });
    }

    private showHideTabs(event: any) {
      console.log('determing if we should show tabs for: ', event.url);
      // Split the URL up into an array and get last page
      const urlArray = event.urlAfterRedirects.split('/');
      const pageUrl = urlArray[urlArray.length - 1] ;
      // remove any query params at the end
      const page = pageUrl.split('?')[0];
      const shouldHide = this.hideTabBarPages.indexOf(page) > -1;
      console.log(page);
      console.log(shouldHide);
      console.log(this.hideTabBarPages);
      // Not ideal to set the timeout, but I haven't figured out a better method to wait until the page is in transition...
      try {
        shouldHide ? this.hideTabs() : this.showTabs();
      } catch (err) {
        console.log(err);
      }
    }
  public hideTabs() {
    this.viewTabs = false;
  }

  public showTabs() {
    this.viewTabs = true;
  }
}