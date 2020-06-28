import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fraud-code',
  templateUrl: './fraud-code.component.html',
  styleUrls: ['./fraud-code.component.scss'],
})
export class FraudCodeComponent {
  @Input()
  headerTitle: string;

  constructor() { }

}
