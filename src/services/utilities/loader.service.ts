import { Injectable } from '@angular/core';
import {
  LoadingController,
  Loading,
  LoadingOptions,
} from 'ionic-angular';

@Injectable()
export class LoaderService {
  static defaultContent = 'Loading...';
  static defaultSpinner = 'dots';

  loader: Loading;

  constructor(
    public loadingCtrl: LoadingController
  ) {}

  present({
    content = LoaderService.defaultContent,
    spinner = LoaderService.defaultSpinner,
  }: LoadingOptions) {
    this.loader = this.loadingCtrl.create({
      content,
      spinner,
    });
    return this.loader.present();
  }

  dismiss() {
    return this.loader && this.loader.dismiss();
  }
}
