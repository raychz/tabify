import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { ReceiptItem } from '../select-items/select-items';
import currency from 'currency.js';
import { AlertService } from '../../../services/utilities/alert.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-tax-tip',
  templateUrl: 'tax-tip.html',
})
export class TaxTipPage {
  @ViewChild(Navbar) navBar!: Navbar;

  tip = 18;
  tab = this.navParams.data;
  myTabItems = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertService,
    public loader: LoaderService,
    public auth: AuthService
  ) {
    this.myTabItems =
      this.navParams.data.tab.receiptItems &&
      this.navParams.data.tab.receiptItems
        .filter((item: any) =>
          item.users.find((e: any) => e.uid === this.auth.getUid())
        )
        .map((item: any) => ({
          name: item.name,
          payers: item.users,
          rating: 0,
          feedback: '',
          price: item.users.find((e: any) => e.uid === this.auth.getUid()).price,
        }));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaxTipPage');
    console.log(this.tab);
    console.log(this.myTabItems);
    this.setBackButtonAction();
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
      this.myTabItems.forEach((item: any) => {
        const payer = item.payers && item.payers.find((e: any) => e.uid === this.auth.getUid());
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
