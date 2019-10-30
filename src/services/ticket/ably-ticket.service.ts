import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@tabify/env';

@Injectable()
export class AblyTicketService {
  onTicketUpdate(data) {
    console.log("Calling from service", data);

  }
}