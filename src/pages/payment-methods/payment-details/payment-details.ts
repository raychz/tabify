import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
} from 'ionic-angular';
import { LoaderService } from '../../../services/utilities/loader.service';

declare var Spreedly: any;

@IonicPage()
@Component({
  selector: 'page-payment-details',
  templateUrl: 'payment-details.html',
})
export class PaymentDetailsPage {
  newCard = { month: '', year: '' };
  spreedlyReady = false;
  mode;
  title;
  saveButtonText;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loader: LoaderService
  ) {
    this.mode = navParams.get('mode');
    this.title = navParams.get('title') || 'Payment Details';
    console.log("PAY MODE", this.mode);
    this.saveButtonText = this.mode === 'PAY_TAB' ? 'Save and Pay' : 'Save';
  }

  ionViewDidLoad() {
    this.loader.present();
    this.initializeSpreedly();
  }

  ionViewDidLeave() {
    Spreedly.removeHandlers();
  }

  initializeSpreedly() {
    Spreedly.init('Iu3UapkcfklJXqLJV61vbJsp1dl', {
      numberEl: 'spreedly-number',
      cvvEl: 'spreedly-cvv',
    });

    Spreedly.on('ready', () => {
      this.spreedlyReady = true;
      Spreedly.setParam('allow_blank_name', true);
      Spreedly.setFieldType('number', 'tel');
      Spreedly.setFieldType('cvv', 'tel');
      Spreedly.setStyle(
        'number',
        'width: 67%; border-radius: 3px; border: 1px solid #ccc; padding: .65em .5em; font-size: 91%;'
      );
      Spreedly.setStyle(
        'cvv',
        'width: 30%; border-radius: 3px; border: 1px solid #ccc; padding: .65em .5em; font-size: 91%;'
      );
      console.log('SPREEDLY READY');
      this.loader.dismiss();
    });

    Spreedly.on('errors', errors => {
      for (let i = 0; i < errors.length; i++) {
        console.log(errors[i]);
      }
      this.loader.dismiss();
    });

    Spreedly.on('paymentMethod', (token, details) => {
      console.log('TOKEN HERE', token, details);
    });

    Spreedly.on('validation', ({ cardType, validNumber, validCvv }) => {
      console.log(cardType, validNumber, validCvv);
      if (!validNumber || !validCvv) {
      }
    });
  }

  submitPaymentForm() {
    // Spreedly.validate()
    // if (this.newCard.month && this.newCard.year) {
    //   Spreedly.tokenizeCreditCard(this.newCard);
    // } else {
    //   console.log('error');
    // }
  }

  canSave() {
    //
    // Spreedly.validate();
    return true;
    // return this.spreedlyReady && this.newCard.month && this.newCard.year;
  }

  showCvvHelp() {
    const toast = this.toastCtrl.create({
      message: `For Visa/Mastercard/Discover, the three-digit number is printed on the signature panel on the back of the card. For American Express, the four-digit number is printed on the front of the card.`,
      duration: 6000,
      position: 'top',
      showCloseButton: true,
    });
    toast.present();
  }
}
