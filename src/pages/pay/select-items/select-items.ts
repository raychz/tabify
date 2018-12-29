import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import currency from 'currency.js';
import { AuthService } from '../../../services/auth/auth.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { SocketService } from "../../../services/socket/socket.service";

export interface ReceiptItem {
  id: number;
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
    public auth: AuthService,
    public socketService: SocketService,
    public loader: LoaderService,
    public alertCtrl: AlertService
  ) {
    this.getItems();

    this.socketService.connect();
    this.socketService.socket.on('connect', () => {
      this.socketService.joinRoom(this.tab.tabNumber);
    });

    this.socketService.socket.on('USER_JOINED', (user) => {
      console.log('USER_JOINED', user)
    });

    this.socketService.socket.on('USER_LEFT', (user) => {
      console.log('USER_LEFT', user)
    });

  }

  ionViewDidLoad() {}

  ionViewWillUnload() {
    this.socketService.disconnect()
  }

  getItems() {
    this.receiptItems = [
      {
        id: 1,
        name: 'Coca-Cola',
        price: 2.99,
        payers: [],
      },
      {
        id: 2,
        name: 'Dr. Pepper',
        price: 2.99,
        payers: [{ uid: '2', firstName: 'Bob', price: 12.39 }],
      },
      {
        id: 3,
        name: 'Sprite',
        price: 2.99,
        payers: [],
      },
      {
        id: 4,
        name: 'Ribeye Steak',
        price: 23.41,
        payers: [],
      },
      {
        id: 5,
        name: 'Cheeseburger',
        price: 12.39,
        payers: [{ uid: '2', firstName: 'Bob', price: 12.39 }],
      },
      {
        id: 6,
        name: 'Salad',
        price: 11.27,
        payers: [{ uid: '3', firstName: 'Mary', price: 14.77 }],
      },
      {
        id: 7,
        name: 'Nachos',
        price: 14.77,
        payers: [
          { uid: '1', firstName: 'Cam', price: 7.38 },
          { uid: '2', firstName: 'Bob', price: 7.39 },
        ],
      },
      {
        id: 8,
        name: 'Calamari',
        price: 15.29,
        payers: [{ uid: '3', firstName: 'Mary', price: 7.38 }],
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
    this.socketService.socket.emit('message-room', {
      room: this.tab.tabNumber,
      item,
    });
  }

  isItemOnMyTab(item: ReceiptItem) {
    return !!item.payers.find(e => e.uid === this.auth.getUid());
  }

  countItemsOnMyTab() {
    let count = 0;
    this.receiptItems.forEach(item => (count += ~~this.isItemOnMyTab(item)));
    return count;
  }

  removeItemFromMyTab(item: ReceiptItem) {
    const index = item.payers.indexOf(
      item.payers.find(e => {
        return e.uid === this.auth.getUid();
      })
    );
    item.payers.splice(index, 1);
    this.updatePayersDescription();
    this.socketService.socket.emit('message-room', {
      room: this.tab.tabNumber,
      item,
    });
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
    this.loader
      .present({
        content:
          'Waiting on Alice, Bob, and John to finish making selections...',
      })
      .then(() => {
        setTimeout(() => {
          this.loader.setContent(
            'Waiting on Bob to finish making selections...'
          );
        }, 1500);
      });
    setTimeout(() => {
      this.loader.dismiss();
      this.navCtrl.push('TaxTipPage', {
        ...this.tab,
        receiptItems: this.receiptItems,
      });
    }, 3500);
  }

  confirmSelections() {
    const itemCount = this.countItemsOnMyTab();
    if (itemCount) {
      const confirm = this.alertCtrl.create({
        title: 'Confirm Selections',
        message: `You've added ${itemCount} items to your tab. Is this correct?`,
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
          {
            text: 'Yes',
            handler: () => {
              confirm.dismiss().then(() => {
                this.viewTaxAndTip();
              });
              return false;
            },
          },
        ],
      });
      confirm.present();
    } else {
      const warning = this.alertCtrl.create({
        title: 'Warning',
        message: `Please add 1 or more items to your tab before continuing.`,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              console.log('Ok clicked');
            },
          },
        ],
      });
      warning.present();
    }
  }

  allItemsAreHidden() {
    return this.receiptItems.every(item => item.isHidden);
  }
}
