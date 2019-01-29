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
    uid?: string | null;
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
  receiptItems: ReceiptItem[] = [];
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
  }

  ionViewDidLoad() {
    this.socketService.socket.on('connect', () => {
      this.socketService.joinRoom(this.tab.tabNumber);
    });

    this.socketService.getMessage('USER_JOINED').subscribe(
      (user: any) => {
        console.log('USER_JOINED', user)
      }
    );

    this.socketService.getMessage('USER_LEFT').subscribe(
      (user: any) => {
        console.log('USER_LEFT', user)
      }
    );

    this.socketService.socket.once('disconnect', () => {
      console.log('disconnecting')
      this.navCtrl.pop();
    })
  }

  ionViewWillUnload() {
    this.socketService.disconnect()
  }

  getItems() {
    this.receiptItems = [];
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
    item.payers = item.payers.filter(i => i.uid === this.auth.getUid())
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

  filterItems(ev: any) {
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
    return this.receiptItems.every(item => !!item.isHidden );
  }
}
