import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public auth: AuthService,
  ) { }

  async ngOnInit() {
    // await this.auth.signInWithEmail({email: '', password: ''});
  }

}
