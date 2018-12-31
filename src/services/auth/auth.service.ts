import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
interface ISignUpCredentials {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
}

interface ISignInCredentials {
  email: string,
  password: string,
}

@Injectable()
export class AuthService {
  private user: firebase.User | null = null;

  constructor(
    public afAuth: AngularFireAuth,
    private fb: Facebook,
    private platform: Platform,
    private http: HttpClient
  ) {
    afAuth.authState.subscribe(user => (this.user = user));
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  public sendPasswordResetEmail(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public signInWithEmail(credentials: ISignInCredentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  public async signInWithFacebook() {
    let userObj: { user: firebase.User };
    if (this.platform.is('cordova')) {
      const res: FacebookLoginResponse = await this.fb.login(['email', 'public_profile']);
      const { accessToken } = res.authResponse;
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
        accessToken
      );
      userObj = await firebase.auth().signInWithCredential(facebookCredential);
    } else {
      userObj = await this.afAuth.auth.signInWithPopup(
        new firebase.auth.FacebookAuthProvider()
      );
    }

    const user = userObj.user;
    if (!user) {
      throw 'No User found'
    }
    const { uid } = user;
    return this.saveUser(uid);
  }

  public async signUp(credentials: ISignUpCredentials) {
    const { user } = await this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    const displayName =  `${credentials.firstName} ${credentials.lastName}`;
    await this.saveUser(user.uid)
    return user.updateProfile({ displayName })
  }

  public getToken (): Observable<string> {
    if (!this.user) {
      throw 'User not authenticated'
    }
    return Observable.fromPromise(this.user.getIdToken());
  }

  public getPhotoUrl() {
    return this.user && this.user.photoURL && (this.user.photoURL + '?width=75&height=75');
  }

  public getEmail() {
    return this.user && this.user.email;
  }

  public getDisplayName() {
    return this.user && this.user.displayName;
  }

  public getUid() {
    return this.user && this.user.uid;
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  /**
   * Saves a user id to our db.
   * @param uid 
   */
  private async saveUser(uid: string) {
    const res = await this.http.post('http://localhost:3000/user', { uid }).toPromise();
    return res;
  }
}
