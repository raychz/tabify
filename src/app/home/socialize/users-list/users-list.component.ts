import { Component, OnInit, Input } from '@angular/core';
import { UserDetail } from 'src/interfaces/user-detail.interface';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  @Input() users: UserDetail[];

  constructor() { }

  ngOnInit() {}

}
