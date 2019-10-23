import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ModalController, } from 'ionic-angular';
import { AlertService } from '../../../services/utilities/alert.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, FirestoreTicketItem, UserStatus } from '../../../services/ticket/ticket.service';
import { getItemsOnMyTab } from '../../../utilities/ticket.utilities';
import { PaymentMethodService } from '../../../services/payment/payment-method.service';
import { PaymentDetailsPageMode } from '../../payment-methods/payment-details/payment-details';
import { EnterTipPage } from './enter-tip/enter-tip';
import { PayConfirmationPage } from './pay-confirmation/pay-confirmation';
import { PaymentService } from '../../../services/payment/payment.service';
import { sleep } from '../../../utilities/general.utilities';

@IonicPage()
@Component({
  selector: 'page-tax-tip',
  templateUrl: 'tax-tip.html',
})
export class TaxTipPage {
  @ViewChild(Navbar) navBar: Navbar;
  myTabItems: FirestoreTicketItem[] = [];
  displayAllItems = false;
  displayLimit = 2;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertService,
    public loader: LoaderService,
    public auth: AuthService,
    public ticketService: TicketService,
    public paymentMethodService: PaymentMethodService,
    public paymentService: PaymentService,
    public modalCtrl: ModalController,
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  async ionViewDidLoad() {
    const loading = this.loader.create();
    await loading.present();
    try {
      await this.ticketService.finalizeTicketTotals(this.ticketService.ticket.id);
    } catch (e) {
      console.error('something went wrong, retrying', e);
      try {
        await sleep(1500);
        await this.ticketService.finalizeTicketTotals(this.ticketService.ticket.id);
      } catch {
        console.error('something went wrong again, not retrying', e);
      }
    }
    this.myTabItems = getItemsOnMyTab(this.ticketService.firestoreTicketItems, this.auth.getUid())
      .map(item => {
        const nestedUser = item.users.find((e: any) => e.uid === this.auth.getUid());
        const userShare = (nestedUser && nestedUser.price) || 0;
        return {
          ...item,
          userShare
        };
      });
    try {
      await this.paymentMethodService.initializePaymentMethods();
    } catch (e) {
      console.error('Caught in initializePaymentMethods', e);
    }

    // TODO: Auto select the user's default payment method here
    if (this.paymentMethodService.paymentMethods.length) {
      this.ticketService.userPaymentMethod = this.paymentMethodService.paymentMethods[0];
    }
    await loading.dismiss();
  }

  async adjustTip() {
    const tipModal = this.modalCtrl.create('EnterTipPage', null,
      { showBackdrop: true, enableBackdropDismiss: false, cssClass: 'tip-modal' });
    await tipModal.present();
  }

  async pay() {
    if (!this.ticketService.userPaymentMethod) {
      throw new Error("No payment method selected!")
    }
    const loading = this.loader.create();
    await loading.present();
    try {
      const response = await this.paymentService.sendTicketPayment(
        this.ticketService.ticket.id,
        this.ticketService.userPaymentMethod.id,
        this.ticketService.curUser.totals.total,
        this.ticketService.curUser.totals.tip,
      ) as any;
      if (response.ticket.ticket_status === 'closed') {
        const alert = this.alertCtrl.create({
          title: 'Success',
          message: `Thanks for visiting ${this.ticketService.ticket.location!.name}! This ticket is now closed and fully paid for.`,
          buttons: ['Ok']
        });
        alert.present();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Success',
          message: `Thanks for visiting ${this.ticketService.ticket.location!.name}! This ticket still has an open balance of $${response.due / 100}. Sahil, this is where the pay status page goes.`,
          buttons: ['Ok']
        });
        alert.present();
      }

      await this.navCtrl.setRoot('HomePage');
    } catch (e) {
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Whoops, something went wrong on our end! Please try again.',
        buttons: ['Ok']
      });
      alert.present();
      console.error(e);
    }
    await loading.dismiss();
  }

  editPaymentMethod() {
    this.navCtrl.push('SelectPaymentPage');
  }
}
