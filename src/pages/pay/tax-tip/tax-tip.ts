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
import { CouponService } from '../../../services/coupon/coupon.service';
import { ICoupon, CouponOffOf, CouponType } from '../../../interfaces/coupon.interface';
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
  myTabItems: TicketItem[] = [];
  displayAllItems = false;
  displayLimit = 2;
  /** Is the user selecting their payment method. */
  selectingPaymentMethodOrCoupon = false;
  // Expose enum to template
  CouponOffOf = CouponOffOf;
  // Expose enum to template
  CouponType = CouponType;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertService,
    public loader: LoaderService,
    public couponService: CouponService,
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
    } catch {
      return false;
    }
  }

  public ionViewCanLeave(): boolean {
    try {
      // Check if the ticket state has been cleared here
      if (!this.ablyTicketService.ticket) return true;

      const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
      // Allow user to leave only if they are trying to select their payment method or coupon
      return currentUser.status !== TicketUserStatus.PAYING || this.selectingPaymentMethodOrCoupon;
    } catch {
      return false;
    }
  }

  public ionViewWillEnter() {
    // Reset the selectingPaymentMethod boolean to false since the method has already been selected
    this.selectingPaymentMethodOrCoupon = false;
  }

  async ionViewDidLoad() {
    console.log('taxtip did load start:', this.ablyTicketService.ticket.users)
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
    this.myTabItems = this.ablyTicketService.ticket.items.filter(item => item.usersMap.has(this.auth.getUid()));
    // TODO: Enter the user's default tip percentage here
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
    currentUser.tipPercentage = 20;
    currentUser.tips =
      Math.round(((currentUser.tipPercentage / 100) * currentUser.items));
    try {
      await this.paymentMethodService.initializePaymentMethods();
    } catch (e) {
      console.error('Caught in initializePaymentMethods', e);
    }

    // TODO: Auto select the user's default payment method here
    if (this.paymentMethodService.paymentMethods.length) {
      currentUser.paymentMethod = this.paymentMethodService.paymentMethods[0];
    }
    const alert = await this.couponService.getTicketCouponsAndReceiveCouponAlert(this.ablyTicketService.ticket.id);
    // alert is posssibly undefined
    if (alert) {
      alert.present();
    }
    await loading.dismiss();
    console.log('taxtip did load end:', this.ablyTicketService.ticket.users)
  }

  async adjustTip() {
    const tipModal = this.modalCtrl.create('EnterTipPage', null,
      { showBackdrop: true, enableBackdropDismiss: false, cssClass: 'tip-modal' });
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
      console.log('ticket before payment', this.ablyTicketService.ticket.users)
      const response = await this.paymentService.sendTicketPayment(
        this.ablyTicketService.ticket.id,
        currentUser.paymentMethod.id,
        currentUser.total,
        currentUser.tips,
        this.couponService.selectedCoupon.id,
      ) as any;

      await this.ablyTicketService.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, TicketUserStatus.PAID);
      await this.navCtrl.push('StatusPage')
    } catch (e) {
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Sorry, something went wrong on our side! Please try again.',
        buttons: ['Ok']
      });
      alert.present();
      console.error(e);
    }
    await loading.dismiss();
  }

  editPaymentMethod() {
    this.selectingPaymentMethodOrCoupon = true;
    this.navCtrl.push('SelectPaymentPage');
  }

  editCoupon() {
    console.log(this.ablyTicketService.ticket.usersMap.get(this.auth.getUid()));
    if (!this.ablyTicketService.ticket.usersMap.get(this.auth.getUid()).selected_coupon) {
      this.selectingPaymentMethodOrCoupon = true;
      this.navCtrl.push('CouponsPage', {fullCouponsPage: false});
    }
  }
}
