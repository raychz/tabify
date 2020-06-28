
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  viewTabs = true;

  // routes that have any of following as their last path element will show the tabs
  private showTabBarPages: string[] = [
    'dine', 'explore', 'socialize'
  ];

  // routes that have any of following as their second to last path element (last may be a dynamic path) will show the tabs
  private showTabBarParamPage: string[] = [
    'dine',
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
      const pageUrlParent = urlArray[urlArray.length - 2];

      // remove any query params at the end
      const page = pageUrl.split('?')[0];
      const showPage = this.showTabBarPages.indexOf(page) > -1;
      const showParamPage = this.showTabBarParamPage.indexOf(pageUrlParent) > -1;

      console.log(page);
      console.log(showPage);
      console.log(showParamPage);
      console.log(this.showTabBarPages);
      try {
        showPage || showParamPage ? this.showTabs() : this.hideTabs();
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