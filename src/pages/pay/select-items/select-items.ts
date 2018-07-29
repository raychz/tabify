import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import currency from 'currency.js';

export interface ReceiptItem {
  name: string;
  price: number;
  payers: {
    uid: string;
    firstName: string;
    price: number;
  }[];
  payersDescription?: string;
}

@IonicPage()
@Component({
  selector: 'page-select-items',
  templateUrl: 'select-items.html',
})
export class SelectItemsPage {
  receiptItems: ReceiptItem[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.getItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectItemsPage');
  }

  getItems() {
    this.receiptItems = [
      {
        name: 'Ribeye Steak',
        price: 23.47,
        payers: [],
      },
      {
        name: 'Cheeseburger',
        price: 12.39,
        payers: [
          { uid: '2', firstName: 'Bob', price: 12.39 }
        ],
      },
      {
        name: 'Salad',
        price: 14.77,
        payers: [
          { uid: '3', firstName: 'John', price: 14.77 }
        ],
      },
      {
        name: 'Nachos',
        price: 14.77,
        payers: [
          { uid: '1', firstName: 'Ray', price: 7.38 },
          { uid: '2', firstName: 'Bob', price: 7.39 },
        ],
      },
    ];
    this.updatePayersDescription();
  }

  addItemToMyTab(item: ReceiptItem) {
    item.payers.push({
      uid: '9',
      firstName: 'Cam',
      price: 0,
    });
    const distribution = currency(item.price).distribute(item.payers.length);
    distribution.forEach((d, index) => {
      item.payers[index].price = d.value;
    });
    this.updatePayersDescription();
  }

  isItemOnMyTab(item: ReceiptItem) {
    return !!item.payers.find(e => e.uid === '9');
  }

  removeItemFromMyTab(item: ReceiptItem) {
    const index = item.payers.indexOf(item.payers.find(e => {
      return e.uid === '9';
    }));
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
      const payer = item.payers.find(e => e.uid === '9');
      if (payer) {
        sum = sum.add(payer.price);
      }
    });
    return sum.value;
  }

  viewTotals() {
    this.navCtrl.push('TotalsPage');
  }

  filterItems(ev) {
    this.getItems();
    const { value } = ev.target;
    if (value && value.trim() !== '') {
      this.receiptItems = this.receiptItems.filter(
        item =>
          item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
    }
  }
}
