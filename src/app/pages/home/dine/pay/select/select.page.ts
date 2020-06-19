import { Component, OnInit } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.page.html',
  styleUrls: ['./select.page.scss'],
})
export class SelectPage {

  constructor(
    public navCtrl: NavController,
    public locationService: LocationService,
  ) { }

  public ionViewDidEnter() {
  }

  public async nextPage() {
    // await this.navCtrl.navigateForward(`/home/dine/${this.locationService.selectedLocation.slug}/pay/confirm`);
    await this.navCtrl.pop();
  }

}
