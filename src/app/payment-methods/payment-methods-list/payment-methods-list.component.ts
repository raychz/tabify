import { Component, OnInit } from '@angular/core';
import { PaymentMethodService } from 'src/services/payment/payment-method.service';
import { NavController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-payment-methods-list',
  templateUrl: './payment-methods-list.component.html',
  styleUrls: ['./payment-methods-list.component.scss'],
})
export class PaymentMethodsListComponent implements OnInit {

  constructor(
    public paymentMethodService: PaymentMethodService,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public loader: LoadingController,
  ) { }

    async ngOnInit() {
      await this.paymentMethodService.initializePaymentMethods();
    }

  addNewCard() {
    this.navCtrl.navigateForward('home/payment-methods/create');
  }

  public async showMethodActions(method: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete this card',
          role: 'destructive',
          handler: () => {
            this.deletePaymentMethod(method);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    actionSheet.present();
  }

  async deletePaymentMethod(method: any) {
    const loading = await this.loader.create();
    await loading.present();
    try {
      // Remove on server
      await this.paymentMethodService.deletePaymentMethod(method);

      // Remove locally
      this.paymentMethodService.removePaymentMethod(method);
      await loading.dismiss();
    } catch (e) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: `This payment method could not be removed.`,
      });
      alert.present();
      await loading.dismiss();
      throw e;
    }
  }


}
