import { Component } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage {
  constructor(
    public tabsService: TabsService
  ) {}

  public ionViewDidEnter() {
    console.log('ionViewDidLoad HomePage');
  }

}
