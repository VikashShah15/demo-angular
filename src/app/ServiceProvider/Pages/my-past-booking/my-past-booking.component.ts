import { Component, OnInit } from '@angular/core';
import { MessageServices } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-my-past-booking',
  templateUrl: './my-past-booking.component.html',
  styleUrls: ['./my-past-booking.component.scss']
})
export class MyPastBookingComponent implements OnInit {
  constructor(private messageService: MessageServices) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.messageService.sendMessage({ cmd: '/past-booking' });
  }

}
