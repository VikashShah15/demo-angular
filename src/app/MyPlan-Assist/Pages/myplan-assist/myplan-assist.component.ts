import { Component, OnInit } from '@angular/core';
import { MessageServices } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-myplan-assist',
  templateUrl: './myplan-assist.component.html',
  styleUrls: ['./myplan-assist.component.scss']
})
export class MyplanAssistComponent implements OnInit {
  constructor(private messageService: MessageServices) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.messageService.sendMessage({ cmd: '/planassist' });
  }
}
