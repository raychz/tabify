import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  viewTabs = true;

  constructor() {  }

  public hideTabs() {
    this.viewTabs = false;
  }

  public showTabs() {
    this.viewTabs = true;
  }
}
