import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-unauthenticated',
  templateUrl: 'unauthenticated.html',
})
export class UnauthenticatedPage {
  @ViewChild(Slides) slides: Slides;
  activeSlideIndex = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnauthenticatedPage');
  }

  slideChanged() {
    this.activeSlideIndex = this.slides.getActiveIndex();
    this.slides.lockSwipeToNext(this.activeSlideIndex === this.slides.length() - 1);
    this.slides.lockSwipeToPrev(this.activeSlideIndex === 0);
  }

  signUp() {
    this.navCtrl.push('SignUpPage');
  }

  login() {
    this.navCtrl.push('LoginPage');
  }
}
