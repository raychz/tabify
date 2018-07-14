import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-select-items',
  templateUrl: 'select-items.html',
})
export class SelectItemsPage {
  receiptItems: {
    name: string;
    price: number;
    payers: { uid: string; firstName: string; percentage: number }[];
    payersDescription?: string;
  }[];
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
        payers: [{ uid: '1', firstName: 'Ray', percentage: 100 }],
      },
      {
        name: 'Cheeseburger',
        price: 12.39,
        payers: [{ uid: '2', firstName: 'Bob', percentage: 100 }],
      },
      {
        name: 'Salad',
        price: 14.77,
        payers: [{ uid: '3', firstName: 'John', percentage: 100 }],
      },
      {
        name: 'Nachos',
        price: 14.77,
        payers: [
          { uid: '1', firstName: 'Ray', percentage: 33.33 },
          { uid: '2', firstName: 'Bob', percentage: 33.33 },
          { uid: '3', firstName: 'John', percentage: 33.33 },
        ],
      },
    ];
    this.receiptItems.forEach(item => {
      const { payers } = item;
      const { length: numberOfPayers } = payers;
      console.log(numberOfPayers);
      switch (numberOfPayers) {
        case 0:
          item.payersDescription = 'Nobody has claimed this.';
          break;
        case 1:
          item.payersDescription = `${payers[0].firstName} got this.`;
          break;
        default: {
          const payersNamesMap = payers.map(p => p.firstName);
          item.payersDescription = `${payersNamesMap.slice(0, numberOfPayers - 1).join(', ')} and ${payers[numberOfPayers - 1].firstName} shared this.`
        }
      }
    });
  }

  getPrice(uid) {
    // Set price on split event, ie, when a user selects a split percentage, set the price value on the payer's object
    // this.receiptItems.forEach(item => {
      
    // });
    // return (Math.round(0.01 * percentage * price * Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
    return 0;
  }
}
