import { Component, ChangeDetectorRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
} from 'ionic-angular';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AlertService } from '../../../services/utilities/alert.service';

declare var Spreedly: any;

@IonicPage()
@Component({
  selector: 'page-payment-details',
  templateUrl: 'payment-details.html',
})
export class PaymentDetailsPage {
  newCard = { month: '', year: '', full_name: '' };
  spreedlyReady = false;
  mode;
  title;
  saveButtonText;
  spreedlyTimeout;
  paymentMethodError = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loader: LoaderService,
    public alertCtrl: AlertService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.mode = navParams.get('mode');
    this.title = navParams.get('title') || 'Payment Details';
    console.log('PAY MODE', this.mode);
    this.saveButtonText = this.mode === 'PAY_TAB' ? 'Save and Pay' : 'Save';
  }

  ionViewDidLoad() {
    this.loader.present({ dismissOnPageChange: false }).then(() => {
      this.initializeSpreedly();
      this.spreedlyTimeout = setTimeout(() => {
        this.navCtrl.popTo('PaymentMethodsPage').then(() => {
          const alert = this.alertCtrl.create({
            title: 'Network Error',
            message: `Please check your connection and try again.`,
          });
          alert.present();
        });
      }, 15000);
    });
  }

  ionViewDidLeave() {
    this.loader.dismiss();
    Spreedly.removeHandlers();
    clearTimeout(this.spreedlyTimeout);
  }

  initializeSpreedly() {
    Spreedly.init('Iu3UapkcfklJXqLJV61vbJsp1dl', {
      numberEl: 'spreedly-number',
      cvvEl: 'spreedly-cvv',
    });

    Spreedly.on('ready', () => {
      clearTimeout(this.spreedlyTimeout);
      this.loader.dismiss().then(() => {
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
        this.changeDetectorRef.detectChanges();
      });
    });

    Spreedly.on('errors', errors => {
      this.loader.dismiss().then(() => {
        this.paymentMethodError = '';
        errors.forEach(error => {
          console.log(error);
          this.paymentMethodError += error.message + '. ';
        });
        this.changeDetectorRef.detectChanges();
      });
    });

    Spreedly.on('paymentMethod', (token, details) => {
      this.loader.dismiss().then(() => {
        console.log('TOKEN HERE', token, details);
      });
    });

    Spreedly.on('validation', ({ cardType, validNumber, validCvv }) => {
      this.loader.dismiss().then(() => {
        console.log(cardType, validNumber, validCvv);
        if (
          cardType &&
          validNumber &&
          validCvv &&
          this.newCard.month &&
          this.newCard.year
        ) {
          this.paymentMethodError = '';
          this.tokenizePaymentMethod();
        } else {
          this.paymentMethodError =
            'Please enter a valid credit card and CVV number.';
        }
        this.changeDetectorRef.detectChanges();
      });
    });
  }

  validatePaymentMethod() {
    this.loader.present().then(() => {
      Spreedly.validate();
    });
  }

  tokenizePaymentMethod() {
    this.loader.present().then(() => {
      Spreedly.tokenizeCreditCard(this.newCard);
    });
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
