import { Injectable } from '@angular/core';
import { LoadingController, Loading, LoadingOptions } from 'ionic-angular';

@Injectable()
export class LoaderService {
  static defaultContent = 'Loading...';
  static defaultSpinner = 'dots';

  constructor(public loadingCtrl: LoadingController) {}

  create(opts: LoadingOptions = {}) {
    const {
      content = LoaderService.defaultContent,
      spinner = LoaderService.defaultSpinner,
      ...rest
    } = opts;
    return this.loadingCtrl.create({
      content,
      spinner,
      ...rest,
    });
  }
}
