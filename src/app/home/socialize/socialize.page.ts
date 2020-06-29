import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-socialize',
  templateUrl: 'socialize.page.html',
  styleUrls: ['socialize.page.scss']
})
export class SocializePage {
  showNewFeed = true;
  filteredUsers = this.auth.otherUsers;

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
  ) {}

  public async ionViewDidEnter() {
    await this.auth.getAllOtherUsers();
    this.filteredUsers = this.auth.otherUsers;
    console.log('other users are', this.filteredUsers);
  }

  async searchUsers(ev: any) {
    const search = ev.target.value;
    if (search && search.trim() !== '') {
      const modifiedSearch = search.toLowerCase().replace(/[^a-zA-Z\d\s]/gi, '');
      this.filteredUsers = this.auth.otherUsers.filter((user) => {
        const userName = user.displayName.toLowerCase().replace(/[^a-zA-Z\d\s]/gi, '');
        return (userName.indexOf(modifiedSearch) > -1);
      });
      this.showNewFeed = false;
    } else {
      this.showNewFeed = true;
    }
  }

  public userProfile() {
    this.navCtrl.navigateForward('home/socialize/someUsername');
  }
}
