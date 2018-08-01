import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReceiptItem } from '../select-items/select-items';
import currency from 'currency.js';
import { AlertService } from '../../../services/utilities/alert.service';
import { LoaderService } from '../../../services/utilities/loader.service';

@IonicPage()
@Component({
  selector: 'page-tax-tip',
  templateUrl: 'tax-tip.html',
})
export class TaxTipPage {
  tip = 20;
  tab = this.navParams.data;
  myTabItems = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertService,
    public loader: LoaderService
  ) {
    this.myTabItems =
      this.tab.receiptItems &&
      this.tab.receiptItems
        .filter(item => item.payers.find(e => e.uid === '9'))
        .map(item => ({
          name: item.name,
          payers: item.payers,
          ...item.payers.find(e => e.uid === '9'),
        }));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaxTipPage');
    console.log(this.tab);
    console.log(this.myTabItems);
  }

  adjustTip(shouldIncreaseTip) {
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
        const payer = item.payers.find(e => e.uid === '9');
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
    const confirm = this.alertCtrl.create({
      title: 'All set?',
      message: `You will be submitting a payment of $${this.getGrandTotal()} to ${this
        .tab.location && this.tab.location.name}.`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Pay',
          handler: () => {
            confirm.dismiss().then(() => {
              this.loader
                .present({
                  duration: 3000,
                })
                .then(() => {
                  const parentNav: NavController = this.navCtrl.parent;
                  parentNav
                    .setRoot(
                      'HomePage',
                      {},
                      {
                        animate: true,
                        animation: 'md-transition',
                        direction: 'back',
                      }
                    )
                    .then(() => {
                      const alert = this.alertCtrl.create({
                        title: 'All done',
                        subTitle: `Thanks for visiting ${this.tab.location &&
                          this.tab.location.name}!`,
                        buttons: ['Ok'],
                      });
                      alert.present();
                    });
                });
            });
            return false;
          },
        },
      ],
    });
    confirm.present();
  }
}
