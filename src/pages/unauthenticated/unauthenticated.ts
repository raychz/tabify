import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-unauthenticated',
  templateUrl: 'unauthenticated.html',
})
export class UnauthenticatedPage {
  @ViewChild(Slides) slides!: Slides;
  activeSlideIndex = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService) {
  }

  ionViewCanEnter() {
    // Only allow unauthenticated users to enter this page
    return !this.auth.authenticated;
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
