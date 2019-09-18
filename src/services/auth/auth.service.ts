import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Platform, AlertController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { HttpClient } from '@angular/common/http';
import { Observable , Subject , of , from } from 'rxjs';
import { config } from "../../config";
import { tap } from 'rxjs/operators';

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
  private userDetails: any = null; // user details as stored in our database, not firebase
  private authState$: Observable<firebase.User | null>;
  private referralCode: string = '';
  public userDetailsConfirmedInDB$ = new Subject<boolean>();

  constructor(
    public afAuth: AngularFireAuth,
    private fb: Facebook,
    private platform: Platform,
    private http: HttpClient,
    public alertCtrl: AlertController
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
    return !!(this.user && this.userDetails);
  }

  public sendPasswordResetEmail(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public async signInWithEmail(credentials: ISignInCredentials) {
    const { user } = await this.afAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    return await this.saveUser();
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
    return await this.saveUser();
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

  /**
   * Returns user details as represented in Tabify db
   */
  public getUserDetails() {
    return this.userDetails;
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

      this.userDetails = res;
      // check if res's uid is same as firebase user. If yes, set userDetailsConfirmed to true.
      // This makes sure that user detials are stored in Tabify's DB, so
      // we can do further API calls to the server, like get stories/tickets
      if (this.user && res && res.user && res.user.uid === this.user.uid) {
        this.userDetailsConfirmedInDB$.next(true);
      } else {
        throw new Error("The newly created user does not match the logged in user's uid.")
      }
      return res;
    }
  }

  /**
   * Check if user/userDetails exist in our DB
   */
  async checkUserExistsInDB(): Promise<boolean> {
    try {
      const res: any = await this.http.get(`${config.serverUrl}/user/userDetails`).toPromise();

      if (this.user && res && res.user && res.user.uid === this.user.uid) {
        this.userDetails = res;
        this.userDetailsConfirmedInDB$.next(true);
        return true;
      } else {
        this.userDetails = null;
        this.userDetailsConfirmedInDB$.next(false);
        return false;
      }
    } catch (error) {
      console.error('checkUserExistsInDB encountered an error', error);
      this.userDetails = null;
      this.userDetailsConfirmedInDB$.next(false);
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
      return false;
    }
  }
}
