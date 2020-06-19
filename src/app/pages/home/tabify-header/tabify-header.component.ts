import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabify-header',
  templateUrl: './tabify-header.component.html',
  styleUrls: ['./tabify-header.component.scss'],
})
export class TabifyHeaderComponent implements OnInit {

  constructor(
    public menuController: MenuController,
  ) { }

  ngOnInit() {}

  async openMenu() {
    await this.menuController.open();
  }

}
