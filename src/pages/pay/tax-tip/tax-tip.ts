import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ModalController, } from 'ionic-angular';
import { AlertService } from '../../../services/utilities/alert.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, FirestoreTicketItem } from '../../../services/ticket/ticket.service';
import { getItemsOnMyTab } from '../../../utilities/ticket.utilities';
import { PaymentService } from '../../../services/payment/payment.service';
import { PaymentDetailsPageMode } from '../../payment-methods/payment-details/payment-details';
import { EnterTipPage } from './enter-tip/enter-tip';
import { PayConfirmationPage } from './pay-confirmation/pay-confirmation';

@IonicPage()
@Component({
  selector: 'page-tax-tip',
  templateUrl: 'tax-tip.html',
})
export class TaxTipPage {
  @ViewChild(Navbar) navBar: Navbar;
  tip = 18;
  myTabItems: FirestoreTicketItem[] = [];
  selectOptions = {
    title: 'Payment',
    subTitle: 'Select a payment method',
    enableBackdropDismiss: false
  };
  displayAllItems = false;
  displayLimit = 2;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertService,
    public loader: LoaderService,
    public auth: AuthService,
    public ticketService: TicketService,
    public paymentService: PaymentService,
    public modalCtrl: ModalController,
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  async ionViewDidLoad() {
    await this.loader.present();
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
      await this.paymentService.initializePaymentMethods();
    } catch (e) {
      console.error('Caught in initializePaymentMethods', e);
    }

    // TODO: Auto select the user's default payment method here
    if (this.paymentService.paymentMethods.length) {
      this.ticketService.userPaymentMethod = this.paymentService.paymentMethods[0];
    }
    await this.loader.dismiss();
  }

  async adjustTip() {
    const tipModal = this.modalCtrl.create('EnterTipPage', null,
      { showBackdrop: true, enableBackdropDismiss: false, cssClass: 'tip-modal' });
    await tipModal.present();
  }

  getSubtotal() {
    let sum = 0;
    this.myTabItems &&
      this.myTabItems.forEach((item: FirestoreTicketItem) => {
        const payer = item.users && item.users.find((e: any) => e.uid === this.auth.getUid());
        if (payer) {
          sum += payer.price;
        }
      });
    return sum;
  }

  getTax() {
    const tax = this.getSubtotal() * 0.0625;
    return tax;
  }

  getTip() {
    const tip = this.getSubtotal() * (this.tip / 100);
    return tip;
  }

  getGrandTotal() {
    const grandTotal = this.getSubtotal() + this.getTax() + this.getTip();
    return grandTotal;
  }

  async pay() {
    if (this.ticketService.userPaymentMethod) {
      console.log(this.navCtrl);
      // const payConfirmationModal = this.modalCtrl.create('PayConfirmationPage')
      // await payConfirmationModal.present();
      await this.navCtrl.setRoot('HomePage');
    } else {
      throw new Error("No payment method selected!")
    }
  }

  editPaymentMethod() {
    this.navCtrl.push('SelectPaymentPage');
  }
}
