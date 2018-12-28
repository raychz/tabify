import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@Injectable()
export class AuthService {
  private user: firebase.User;

  constructor(
    public afAuth: AngularFireAuth,
    private fb: Facebook,
    private platform: Platform
  ) {
    afAuth.authState.subscribe(user => (this.user = user));
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  sendPasswordResetEmail(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  signInWithEmail(credentials) {
    console.log('Sign in with email');
    return this.afAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  signInWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.fb
        .login(['email', 'public_profile'])
        .then((res: FacebookLoginResponse) => {
          const { accessToken } = res.authResponse;
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
            accessToken
          );
          return firebase.auth().signInWithCredential(facebookCredential);
        });
    } else {
      return this.afAuth.auth.signInWithPopup(
        new firebase.auth.FacebookAuthProvider()
      );
    }
  }

  async signUp(credentials) {
    const { user } = await this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    const displayName =  `${credentials.firstName} ${credentials.lastName}`;
    return user.updateProfile({ displayName })
  }

  getPhotoUrl() {
    return this.user && this.user.photoURL && (this.user.photoURL + '?width=75&height=75');
  }

  getEmail() {
    return this.user && this.user.email;
  }

  getDisplayName() {
    return this.user && this.user.displayName;
  }

  getUid() {
    return this.user.uid;
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }
}
