import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '@ionic/angular';
import { AuthService } from '../../../../services/auth/auth.service';
import { AblyTicketService } from '../../../../services/ticket/ably-ticket.service';

@IonicPage()
@Component({
  selector: 'page-invite-others',
  templateUrl: 'invite-others.html',
})
export class InviteOthersPage {
  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public ablyTicketService: AblyTicketService
  ) {
  }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
  }

}
