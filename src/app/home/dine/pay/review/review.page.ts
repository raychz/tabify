import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';
import { AblyTicketService } from 'src/services/ticket/ably-ticket.service';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage {
  myTabItems = this.ablyTicketService.ticket.items.filter(item => item.usersMap.has(this.auth.getUid()));
  autoPayEnabled = true;

  constructor(
    public navCtrl: NavController,
    public locationService: LocationService,
    public ablyTicketService: AblyTicketService,
    public toastController: ToastController,
    public auth: AuthService,
  ) { }

  public ionViewDidEnter() {
  }

  public async helpToast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message,
      duration,
      animated: true,
    });
    toast.present();
  }

  public async nextPage() {
    this.navCtrl.navigateRoot(`home/dine/${this.locationService.selectedLocation.slug}`);
  }

}
