import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, IonSlides } from '@ionic/angular';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
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
    // await this.auth.signInWithEmail({email: '', password: ''});
  }

  async slideChanged() {
    const slidesLength = await this.slides.length();
    this.activeSlideIndex = await this.slides.getActiveIndex();
    this.slides.lockSwipeToNext(this.activeSlideIndex === slidesLength - 1);
    this.slides.lockSwipeToPrev(this.activeSlideIndex === 0);
  }

  signUp() {
    this.navCtrl.navigateForward('/welcome/sign-up');
  }

  login() {
    this.navCtrl.navigateForward('/welcome/login');
  }
}
