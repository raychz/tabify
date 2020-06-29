import { Component, OnInit } from '@angular/core';
import { PaymentMethodService } from 'src/services/payment/payment-method.service';
import { NavController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { LoaderService } from 'src/services/utilities/loader.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage {

  constructor(
  ) { }

}
