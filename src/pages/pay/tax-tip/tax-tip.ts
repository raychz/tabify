import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { ReceiptItem } from '../select-items/select-items';
import currency from 'currency.js';
import { AlertService } from '../../../services/utilities/alert.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, FirestoreTicketItem } from '../../../services/ticket/ticket.service';
import { getItemsOnMyTab } from '../../../utilities/ticket.utilities';
import { PaymentService } from '../../../services/payment/payment.service';
import { PaymentDetailsPageMode } from '../../payment-methods/payment-details/payment-details';

@IonicPage()
@Component({
  selector: 'page-tax-tip',
  templateUrl: 'tax-tip.html',
})
export class TaxTipPage {
  @ViewChild(Navbar) navBar!: Navbar;
  selectedPaymentMethod: any = null;
  tip = 18;
  tab = this.navParams.data;
  myTabItems!: FirestoreTicketItem[];
  selectOptions = {
    title: 'Payment',
    subTitle: 'Select a payment method',
    enableBackdropDismiss: false
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertService,
    public loader: LoaderService,
    public auth: AuthService,
    public ticketService: TicketService,
    public paymentService: PaymentService,
  ) { }

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
    this.setBackButtonAction();
    try {
      await this.paymentService.initializePaymentMethods();
    } catch(e) {
      console.error('Caught in initializePaymentMethods', e);
    }

    // TODO: Auto select the user's default payment method here
    if (this.paymentService.paymentMethods.length) {
      this.selectedPaymentMethod = this.paymentService.paymentMethods[0];
    }
    await this.loader.dismiss();
  }

  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      const confirm = this.alertCtrl.create({
        title: 'Warning',
        message: `All users on this tab will be sent back to the 'Select Items' page. Are you sure you want to continue?`,
        buttons: [
          {
            text: 'No, stay on this page',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
          {
            text: 'Yes, take me back',
            handler: () => {
              confirm.dismiss().then(() => {
                this.navCtrl.pop();
              });
              return false;
            },
          },
        ],
      });
      confirm.present();
    };
  }

  adjustTip(shouldIncreaseTip: boolean) {
    if (this.tip > 0) {
      this.tip = shouldIncreaseTip ? this.tip + 1 : this.tip - 1;
    } else if (shouldIncreaseTip) {
      this.tip += 1;
    }
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

  pay() {
    // If "Add New Card" was selected
    if (!this.selectedPaymentMethod) {
      this.navCtrl.push('PaymentDetailsPage', {
        ...this.myTabItems,
        mode: PaymentDetailsPageMode.SAVE_AND_PAY,
      });
    }
  }
}
