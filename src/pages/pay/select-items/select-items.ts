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
    payers: { name: string; percentage: number }[];
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
        payers: [{ name: 'Ray', percentage: 100 }],
      },
      {
        name: 'Cheeseburger',
        price: 12.39,
        payers: [{ name: 'Bob', percentage: 100 }],
      },
      {
        name: 'Salad',
        price: 14.77,
        payers: [{ name: 'John', percentage: 100 }],
      },
      {
        name: 'Nachos',
        price: 14.77,
        payers: [
          { name: 'Ray', percentage: 34 },
          { name: 'Bob', percentage: 33 },
          { name: 'John', percentage: 33 },
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
          item.payersDescription = `${payers[0].name} got this.`;
          break;
        default: {
          const payersNamesMap = payers.map(p => p.name);
          item.payersDescription = `${payersNamesMap.slice(0, numberOfPayers - 1).join(', ')} and ${payers[numberOfPayers - 1].name} shared this.`
        }
      }
    });
  }
}
