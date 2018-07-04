import { Injectable } from '@angular/core';
import { LoadingController, Loading, LoadingOptions } from 'ionic-angular';

@Injectable()
export class LoaderService {
  static defaultContent = 'Loading...';
  static defaultSpinner = 'dots';

  loader: Loading;

  constructor(public loadingCtrl: LoadingController) {}

  present(opts: LoadingOptions) {
    const {
      content = LoaderService.defaultContent,
      spinner = LoaderService.defaultSpinner,
      ...rest
    } = opts;
    this.loader = this.loadingCtrl.create({
      content,
      spinner,
      ...rest
    });
    return this.loader.present();
  }

  dismiss() {
    return this.loader && this.loader.dismiss();
  }
}