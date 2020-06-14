import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fraud-header',
  templateUrl: './fraud-header.component.html',
  styleUrls: ['./fraud-header.component.scss'],
})
export class FraudHeaderComponent implements OnInit {
  @Input()
  headerTitle: string;
  @Input()
  noBackButton: boolean;

  falseVal = false;

  constructor() { }

  public ngOnInit() {
    console.log(this.noBackButton);
    this.noBackButton = this.noBackButton !== undefined;
    console.log(this.noBackButton);
  }

}
