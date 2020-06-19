import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fraud-header',
  templateUrl: './fraud-header.component.html',
  styleUrls: ['./fraud-header.component.scss'],
})
export class FraudHeaderComponent {
  @Input()
  headerTitle: string;
  // @Input()
  // backButtonHref: string;


  constructor() { }

}
