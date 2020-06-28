import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, IonSlides } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  activeSlideIndex = 0;
  currentYear = new Date().getFullYear();

  constructor(
    public navCtrl: NavController,
    public auth: AuthService
  ) {
  }

  ngOnInit() {

  }

  ionViewCanEnter() {
    // Only allow unauthenticated users to enter this page
    return !this.auth.authenticated;
  }

  async ionViewDidEnter() {
    console.log('ionViewDidLoad UnauthenticatedPage');
  }

  async slideChanged() {
    const slidesLength = await this.slides.length();
    this.activeSlideIndex = await this.slides.getActiveIndex();
    this.slides.lockSwipeToNext(this.activeSlideIndex === slidesLength - 1);
    this.slides.lockSwipeToPrev(this.activeSlideIndex === 0);
  }

  signUp() {
    this.navCtrl.navigateForward('/auth/sign-up');
  }

  login() {
    this.navCtrl.navigateForward('/auth/login');
  }
}
