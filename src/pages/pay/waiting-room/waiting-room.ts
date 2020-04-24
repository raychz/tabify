import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ModalController } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
import { sleep, abbreviateName, plurality } from '../../../utilities/general.utilities';
import { Platform } from 'ionic-angular';
import { AlertService } from '../../../services/utilities/alert.service';
import { AblyTicketService } from '../../../services/ticket/ably-ticket.service';
import { TicketUserStatus, TicketUserStatusOrder } from '../../../enums';
import { LoaderService } from '../../../services/utilities/loader.service';

@IonicPage()
@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html',
})
export class WaitingRoomPage {
  @ViewChild(Navbar) navBar: Navbar;
  moveToTaxTip = false;
  currentUserUid = this.auth.getUid();
  // Expose const to template
  TicketUserStatusOrder = TicketUserStatusOrder;
  // Expose enum to template
  TicketUserStatus = TicketUserStatus;
  plurality = plurality;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public platform: Platform,
    public alertCtrl: AlertService,
    public ablyTicketService: AblyTicketService,
    public loader: LoaderService,
    public modalCtrl: ModalController,
  ) { }

  public ionViewCanEnter(): boolean {
    try {
      const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
      return this.auth.authenticated && (currentUser.status === TicketUserStatus.WAITING || currentUser.status === TicketUserStatus.CONFIRMED);
    } catch (e) {
      return false;
    }
  }

  public ionViewCanLeave(): boolean {
    try {
      const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
      return currentUser.status !== TicketUserStatus.WAITING && currentUser.status !== TicketUserStatus.CONFIRMED;
    } catch (e) {
      return false;
    }
  }

  async showFraudPreventionCode() {
    const fraudPreventionModal = this.modalCtrl.create('FraudPreventionPage', null,
    { showBackdrop: true, enableBackdropDismiss: false, cssClass: 'tabify-modal' });
    await fraudPreventionModal.present();
  }

  /** Returns true if at least one item on the ticket is shared by multiple users */
  areTicketItemsShared() {
    return this.ablyTicketService.ticket.items.some(item => item.users.length > 1);
  }

  /** Returns true if at least one item on the ticket is unclaimed */
  areTicketItemsUnclaimed() {
    return this.ablyTicketService.ticket.items.some(item => item.users.length === 0);
  }

  /** Counts number of unclaimed items */
  unclaimedTicketItemsCount(): number {
    return this.ablyTicketService.ticket.items.filter(item => item.users.length === 0).length;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingRoomPage');
  }

  checkConfirmedStatus(): boolean {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.currentUserUid);
    if (currentUser.status === TicketUserStatus.PAYING) {
      if (!this.moveToTaxTip) {
        this.moveToTaxTip = true;
        this.viewTaxTip();
      }
      return true;
    }
    return false;
  }

  async viewTaxTip() {
    await sleep(1500);
    this.navCtrl.push('TaxTipPage');
  }

  async changeUserConfirmStatus() {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.currentUserUid);
    if (currentUser.status === TicketUserStatus.WAITING) {
      const unclaimedItemsCount = this.unclaimedTicketItemsCount();
      const numberOfUsers = this.ablyTicketService.ticket.users.length;
      if (unclaimedItemsCount > 0) {
        const alert = this.alertCtrl.create({
          title: `${unclaimedItemsCount} Unclaimed Item${plurality(unclaimedItemsCount)}`,
          message: `Cannot confirm until all items have been claimed by at least one person.`,
          buttons: ['OK']
        });
        alert.present();
        return;
      } else if (numberOfUsers === 1) {
        const alert = this.alertCtrl.create({
          title: 'Is the party complete?',
          message: `You're the only one paying for this ticket. Would you like to continue?`,
          buttons: [
            {
              text: 'No',
              role: 'cancel'
            },
            {
              text: 'Yes',
              handler: () => { this.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, TicketUserStatus.CONFIRMED); }
            }
          ]
        });
        alert.present();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Is the party complete?',
          message: `There are currently ${this.ablyTicketService.ticket.users.length} users on this tab. Is that everyone?`,
          buttons: [
            {
              text: 'No',
              role: 'cancel'
            },
            {
              text: 'Yes',
              handler: () => { this.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, TicketUserStatus.CONFIRMED); }
            }
          ]
        });
        alert.present();
      }
    } else if (currentUser.status === TicketUserStatus.CONFIRMED) {
      await this.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, TicketUserStatus.WAITING);
    } else {
      throw `The current user status is invalid: ${this.ablyTicketService.ticket.usersMap.get(this.currentUserUid).status}`;
    }
  }

  async setTicketUserStatus(ticketId: number, ticketUserId: number, status: TicketUserStatus) {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.currentUserUid);
    const loading = this.loader.create();
    await loading.present();
    try {
      await this.ablyTicketService.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, status);
      await loading.dismiss();
    } catch (e) {
      console.log(e);
      if (e && e.error && e.error.message) {
        const alert = this.alertCtrl.create({
          title: 'Warning',
          message: e.error.message,
          buttons: ['OK']
        });
        alert.present();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Unknown Error',
          message: 'Sorry! Try refreshing the app and joining the tab again.',
          buttons: ['OK']
        });
        alert.present();
      }
      await loading.dismiss();
      throw e;
    }
  }

  isBackButtonDisabled() {
    const allConfirmed = this.ablyTicketService.ticket.users.every(u => TicketUserStatusOrder[u.status] >= TicketUserStatusOrder[TicketUserStatus.CONFIRMED]);
    return allConfirmed && !this.areTicketItemsUnclaimed();
  }

  async backButtonAction() {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.currentUserUid);
    if (!this.isBackButtonDisabled()) {
      const loading = this.loader.create();
      await loading.present();
      try {
        await this.ablyTicketService.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, TicketUserStatus.SELECTING);
        await this.navCtrl.pop();
        // Push the select items page since it will be missing from the nav stack at this point
        if (this.navParams.get('pushSelectItemsOnBack')) {
          await this.navCtrl.push('SelectItemsPage');
        }
      } catch (e) {
        const alert = this.alertCtrl.create({
          title: 'Sorry!',
          message: `You cannot go back to the Select Items page anymore.`,
          buttons: ['OK']
        });
        alert.present();
      }
      await loading.dismiss();
    }
  }

  inviteOthers() {
    const modal = this.modalCtrl.create('InviteOthersPage');
    modal.present();
  }
}
