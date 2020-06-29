import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';
import { AblyTicketService } from 'src/services/ticket/ably-ticket.service';
import { AuthService } from 'src/services/auth/auth.service';
import { TicketItem } from 'src/interfaces/ticket-item.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.page.html',
  styleUrls: ['./select.page.scss'],
})
export class SelectPage {
  userUid = this.auth.getUid();

  constructor(
    public navCtrl: NavController,
    public ablyTicketService: AblyTicketService,
    public auth: AuthService,
    public alertCtrl: AlertController,
    public locationService: LocationService,
  ) { }

  public async nextPage() {
    await this.navCtrl.navigateForward(`/home/dine/${this.locationService.selectedLocation.slug}/pay/${this.ablyTicketService.ticket.tab_id}/confirm`);
  }

  async addOrRemoveItem(item: TicketItem) {
    if (item.loading) {
      return;
    }

    item.loading = true;
    try {
      // Loading is set to false in `synchronizeFrontendTicketItems`
      const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
      if (item.usersMap.has(this.userUid)) {
        await this.ablyTicketService.removeUserFromTicketItem(this.ablyTicketService.ticket.id, currentUser.id, item.id);
      } else {
        await this.ablyTicketService.addUserToTicketItem(this.ablyTicketService.ticket.id, currentUser.id, item.id);
      }
    } catch (e) {
      console.error(e);
      item.loading = false;
      let message;
      if (e.status === 500) {
        message = 'Sorry, our servers are struggling to keep up! Please try again or refresh the app. Contact support@tabifyapp.com if this persists.';
      } else if (e.error && e.error.message) {
        message = e.error.message;
      } else {
        // TODO: Consider reloading the ticket here
        message = `An unknown error occurred. Please try again. ${e}`
      }
      const error = await this.alertCtrl.create({
        header: 'Error',
        message,
        buttons: [
          {
            text: 'OK',
          },
        ],
      });
      error.present();
      throw e;
    }
  }

}
