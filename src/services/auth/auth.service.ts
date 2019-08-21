import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Platform } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { from, BehaviorSubject } from 'rxjs';
import config from "../../config";
import { tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

interface ISignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralCode: string;
}

interface ISignInCredentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private user: firebase.User | null = null;
  private authState$!: Observable<firebase.User | null>;
  private referralCode: string = '';
  public userDetailsConfirmedInDB$ = new BehaviorSubject<boolean>(false);

  constructor(
    public afAuth: AngularFireAuth,
    private fb: Facebook,
    private platform: Platform,
    private http: HttpClient
  ) { }

  /**
   * Should only ever be consumed by and subscribed to by app.component.ts
   */
  public checkAuthState() {
    this.authState$ = this.afAuth.authState.pipe(
      tap(
        user => this.user = user,
        error => this.user = null,
      ));
    return this.authState$;
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  public sendPasswordResetEmail(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public async signInWithEmail(credentials: ISignInCredentials) {
    const { user } = await this.afAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    return this.saveUser();
  }

  public async signInWithFacebook() {
    let userObj: any;
    if (this.platform.is('cordova')) {
      const res: FacebookLoginResponse = await this.fb.login([
        'email',
        'public_profile',
      ]);
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
      throw 'No User found';
    }
    return this.saveUser();
  }

  public async signUp(credentials: ISignUpCredentials) {
    const { user } = await this.afAuth.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    const photoURL = user!.photoURL;
    const displayName = `${credentials.firstName} ${credentials.lastName}`;
    this.referralCode = credentials.referralCode;
    await user!.updateProfile({ displayName, photoURL });
    return await this.saveUser();
  }

  public getToken() {
    if (!this.user) {
      throw 'User not authenticated';
    }
    return from(this.user.getIdToken());
  }

  public getPhotoUrl() {
    return (
      this.user &&
      this.user.photoURL &&
      this.user.photoURL + '?width=75&height=75'
    );
  }

  public getEmail() {
    return this.user && this.user.email;
  }

  public getDisplayName() {
    return (this.user && this.user.displayName) || '';
  }

  public getUid() {
    return this.user && this.user.uid;
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  /**
   * Saves a user id, and details to our db.
   * @param uid
   */
  private async saveUser() {
    const userExistsInDB = await this.checkUserExistsInDB();

    if (this.user && userExistsInDB) {
      return userExistsInDB;
    } else {
      const res: any = await this.http
        .post(`${config.serverUrl}/user`, { referralCode: this.referralCode })
        .toPromise();

      // check if res's uid is same as firebase user. If yes, set userDetailsConfirmed to true.
      // This makes sure that user detials are stored in Tabify's DB, so
      // we can do further API calls to the server, like get stories/tickets
      if (this.user && this.user.uid === res.user.uid) {
        this.userDetailsConfirmedInDB$.next(true);
      }
      return res;
    }
  }

  /**
   * Check if user/userDetails exist in our DB
   */
  async checkUserExistsInDB(): Promise<Boolean> {
    try {
      const res: any = await this.http.get(`${config.serverUrl}/user/userDetails`).toPromise();

      console.log('WEWEWE', res);
      console.log('WEWEWE', this.user)
      if (this.user !== undefined && res !== null)
        if (this.user && this.user.uid === res.user.uid) {
          this.userDetailsConfirmedInDB$.next(true);
          return true;
        } else {
          return false;
        }
      return false;
    } catch (error) {
      console.error('checkUserExistsInDB encountered an error', error);
      return false;
    }
  }
} 
