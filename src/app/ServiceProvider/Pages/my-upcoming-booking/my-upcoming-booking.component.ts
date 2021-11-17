import { Component, OnInit } from '@angular/core';
import { MessageServices } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-my-upcoming-booking',
  templateUrl: './my-upcoming-booking.component.html',
  styleUrls: ['./my-upcoming-booking.component.scss']
})
export class MyUpcomingBookingComponent implements OnInit {
  constructor(private messageService: MessageServices) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.messageService.sendMessage({ cmd: '/upcoming-booking' });
  }

}
