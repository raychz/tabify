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
      this.tab.receiptItems &&
      this.tab.receiptItems
        .filter((item: any) => item.payers.find((e: any) => e.uid === this.auth.getUid()))
        .map((item: any) => ({
          name: item.name,
          payers: item.payers,
          rating: 0,
          feedback: '',
          ...item.payers.find((e: any) => e.uid === this.auth.getUid()),
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
    let sum = currency(0);
    this.myTabItems &&
      this.myTabItems.forEach((item: ReceiptItem) => {
        const payer = item.payers.find(e => e.uid === this.auth.getUid());
        if (payer) {
          sum = sum.add(payer.price);
        }
      });
    return sum.format(false);
  }

  getTax() {
    const tax = currency(this.getSubtotal()).multiply(0.0625);
    return tax.format(false);
  }

  getTip() {
    const tip = currency(this.getSubtotal()).multiply(this.tip / 100);
    return tip.format(false);
  }

  getGrandTotal() {
    const grandTotal = currency(this.getSubtotal())
      .add(this.getTax())
      .add(this.getTip());
    return grandTotal.format(false);
  }

  pay() {
    this.navCtrl.push('PaymentMethodsPage', {
      ...this.myTabItems,
      mode: 'PAY_TAB'
    });
  }
}
