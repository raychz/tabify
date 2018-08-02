import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import currency from 'currency.js';
import { AuthService } from '../../../services/auth/auth.service';

export interface ReceiptItem {
  name: string;
  price: number;
  payers: {
    uid: string;
    firstName: string;
    price: number;
  }[];
  payersDescription?: string;
  isHidden?: boolean;
}

@IonicPage()
@Component({
  selector: 'page-select-items',
  templateUrl: 'select-items.html',
})
export class SelectItemsPage {
  receiptItems: ReceiptItem[];
  tab = this.navParams.data;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService
  ) {
    this.getItems();
  }

  ionViewDidLoad() {
    console.log('tab: ', this.tab);
  }

  getItems() {
    this.receiptItems = [
      {
        name: 'Coca-Cola',
        price: 2.99,
        payers: [],
      },
      {
        name: 'Dr. Pepper',
        price: 2.99,
        payers: [{ uid: '2', firstName: 'Bob', price: 12.39 }],
      },
      {
        name: 'Sprite',
        price: 2.99,
        payers: [],
      },
      {
        name: 'Ribeye Steak',
        price: 23.41,
        payers: [],
      },
      {
        name: 'Cheeseburger',
        price: 12.39,
        payers: [{ uid: '2', firstName: 'Bob', price: 12.39 }],
      },
      {
        name: 'Salad',
        price: 11.27,
        payers: [{ uid: '3', firstName: 'Mary', price: 14.77 }],
      },
      {
        name: 'Nachos',
        price: 14.77,
        payers: [
          { uid: '1', firstName: 'Cam', price: 7.38 },
          { uid: '2', firstName: 'Bob', price: 7.39 },
        ],
      },
      {
        name: 'Calamari',
        price: 15.29,
        payers: [
          { uid: '3', firstName: 'Mary', price: 7.38 },
        ],
      },
    ];
    this.updatePayersDescription();
  }

  addItemToMyTab(item: ReceiptItem) {
    item.payers.push({
      uid: this.auth.getUid(),
      firstName: this.tab.displayName,
      price: 0,
    });
    const distribution = currency(item.price).distribute(item.payers.length);
    distribution.forEach((d, index) => {
      item.payers[index].price = d.value;
    });
    this.updatePayersDescription();
  }

  isItemOnMyTab(item: ReceiptItem) {
    return !!item.payers.find(e => e.uid === this.auth.getUid());
  }

  removeItemFromMyTab(item: ReceiptItem) {
    const index = item.payers.indexOf(
      item.payers.find(e => {
        return e.uid === this.auth.getUid();
      })
    );
    item.payers.splice(index, 1);
    this.updatePayersDescription();
  }

  updatePayersDescription() {
    this.receiptItems.forEach(item => {
      const { payers } = item;
      const { length: numberOfPayers } = payers;
      switch (numberOfPayers) {
        case 0:
          item.payersDescription = 'Nobody has claimed this.';
          break;
        case 1:
          item.payersDescription = `${payers[0].firstName} got this.`;
          break;
        default: {
          const payersNamesMap = payers.map(p => p.firstName);
          item.payersDescription = `${payersNamesMap
            .slice(0, numberOfPayers - 1)
            .join(', ')} and ${
            payers[numberOfPayers - 1].firstName
          } shared this.`;
        }
      }
    });
  }

  updateSubTotal() {
    let sum = currency(0);
    this.receiptItems.forEach(item => {
      const payer = item.payers.find(e => e.uid === this.auth.getUid());
      if (payer) {
        sum = sum.add(payer.price);
      }
    });
    return sum.format(false);
  }

  filterItems(ev) {
    const { value } = ev.target;
    if (value && value.trim() !== '') {
      this.receiptItems.forEach(item => {
        item.isHidden = !(
          item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      });
    } else {
      this.receiptItems.forEach(item => (item.isHidden = false));
    }
  }

  viewTaxAndTip() {
    this.navCtrl.push('TaxTipPage', {
      ...this.tab,
      receiptItems: this.receiptItems,
    });
  }

  allItemsAreHidden() {
    return this.receiptItems.every(item => item.isHidden);
  }
}
