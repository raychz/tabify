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
import { AblyTicketService } from '../../../services/ticket/ably-ticket.service';
import { TicketItem } from '../../../interfaces/ticket-item.interface';
import { TicketStatus, TicketUserStatus } from '../../../enums';
import { TicketUser } from '../../../interfaces/ticket-user.interface';

@IonicPage()
@Component({
  selector: 'page-tax-tip',
  templateUrl: 'tax-tip.html'
})
export class TaxTipPage {
  @ViewChild(Navbar) navBar: Navbar;
  currentUser: TicketUser;
  myTabItems: TicketItem[] = [];
  displayAllItems = false;
  displayLimit = 2;
  /** Is the user selecting their payment method. */
  selectingPaymentMethod = false;

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
    public ablyTicketService: AblyTicketService,
  ) { }

  public ionViewCanEnter(): boolean {
    try {
      const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
      return this.auth.authenticated && currentUser.status === TicketUserStatus.PAYING;
    } catch (e) {
      return false;
    }
  }

  public ionViewCanLeave(): boolean {
    try {
      // Check if the ticket state has been cleared here
      if (!this.ablyTicketService.ticket) return true;

      const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
      // Allow user to leave only if they are trying to select their payment method
      return currentUser.status !== TicketUserStatus.PAYING || this.selectingPaymentMethod;
    } catch (e) {
      return false;
    }
  }

  public ionViewWillEnter() {
    // Reset the selectingPaymentMethod boolean to false since the method has already been selected
    this.selectingPaymentMethod = false;
  }

  async ionViewDidLoad() {
    this.currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
    const loading = this.loader.create();
    await loading.present();
    try {
      await this.ticketService.finalizeTicketTotals(this.ticketService.ticket.id);
    } catch (e) {
      console.error('something went wrong, retrying', e);
      try {
        await sleep(1500);
        await this.ticketService.finalizeTicketTotals(this.ticketService.ticket.id);
      } catch (e) {
        console.error('something went wrong again, not retrying', e);
      }
    }
    this.myTabItems = this.ablyTicketService.ticket.items.filter(item => item.usersMap.has(this.auth.getUid()));
    // TODO: Enter the user's default tip percentage here
    this.currentUser.tipPercentage = 20;
    this.currentUser.tips =
      Math.round(((this.currentUser.tipPercentage / 100) * this.currentUser.items));
    try {
      await this.paymentMethodService.initializePaymentMethods();
    } catch (e) {
      console.error('Caught in initializePaymentMethods', e);
      throw e;
    }

    // TODO: Auto select the user's default payment method here
    if (this.paymentMethodService.paymentMethods.length) {
      this.currentUser.paymentMethod = this.paymentMethodService.paymentMethods[0];
    }
    await loading.dismiss();
  }

  async showFraudPreventionCode() {
    const fraudPreventionModal = this.modalCtrl.create('FraudPreventionPage', null,
    { showBackdrop: true, enableBackdropDismiss: false, cssClass: 'tabify-modal' });
    await fraudPreventionModal.present();
  }

  async adjustTip() {
    const tipModal = this.modalCtrl.create('EnterTipPage', null,
      { showBackdrop: true, enableBackdropDismiss: false, cssClass: 'tabify-modal' });
    await tipModal.present();
  }

  async pay() {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
    if (!currentUser.paymentMethod) {
      throw new Error("No payment method selected!")
    }
    const loading = this.loader.create();
    await loading.present();
    try {
      const response = await this.paymentService.sendTicketPayment(
        this.ablyTicketService.ticket.id,
        this.currentUser.paymentMethod.id,
        this.currentUser.total,
        this.currentUser.tips,
      ) as any;

      await this.ablyTicketService.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, TicketUserStatus.PAID);
      await this.navCtrl.push('StatusPage')
    } catch (e) {
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Sorry, something went wrong on our side! Please try again.',
        buttons: ['OK']
      });
      alert.present();
      console.error(e);
      throw e;
    }
    await loading.dismiss();
  }

  editPaymentMethod() {
    this.selectingPaymentMethod = true;
    this.navCtrl.push('SelectPaymentPage');
  }
}
