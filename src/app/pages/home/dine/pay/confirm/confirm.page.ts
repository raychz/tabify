import { Component, OnInit } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage {

  constructor(
    public navCtrl: NavController,
    public locationService: LocationService,
  ) { }

  public ionViewDidEnter() {
  }

  public async nextPage() {
    await this.navCtrl.navigateForward(`/home/dine/${this.locationService.selectedLocation.slug}/pay/review`);
  }

}
