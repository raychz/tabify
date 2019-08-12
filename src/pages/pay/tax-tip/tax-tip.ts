import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { ReceiptItem } from '../select-items/select-items';
import currency from 'currency.js';
import { AlertService } from '../../../services/utilities/alert.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, FirestoreTicketItem } from '../../../services/ticket/ticket.service';
import { getItemsOnMyTab } from '../../../utilities/ticket.utilities';

@IonicPage()
@Component({
  selector: 'page-tax-tip',
  templateUrl: 'tax-tip.html',
})
export class TaxTipPage {
  @ViewChild(Navbar) navBar!: Navbar;

  tip = 18;
  tab = this.navParams.data;
  myTabItems!: FirestoreTicketItem[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertService,
    public loader: LoaderService,
    public auth: AuthService,
    public ticketService: TicketService,
  ) { }

  ionViewDidLoad() {
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
  }

  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      const confirm = this.alertCtrl.create({
        title: 'Warning',
        message: `All users on this tab will be sent back to the 'Waiting Room' page. Are you sure you want to continue?`,
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
    this.navCtrl.push('PaymentMethodsPage', {
      ...this.myTabItems,
      mode: 'PAY_TAB',
    });
  }
}
