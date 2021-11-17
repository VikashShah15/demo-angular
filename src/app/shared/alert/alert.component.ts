import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MessageServices } from '../services/message.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  providers: [MessageService]

})
export class AlertComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private alertSerivce: MessageServices,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): any {
    this.loadData();
  }
  loadData(): any {
    this.primengConfig.ripple = true;
    this.alertSerivce.getErrorMessage().subscribe(message => {
      const key = 'error';
      this.clear(key);
      this.messageService.add({ key: key, severity: 'error', summary: 'Error', detail: message.text });
    });
    this.alertSerivce.getSuccessMessage().subscribe(message => {
      const key = 'success';
      this.clear(key);
      this.messageService.add({ key: key, severity: 'success', summary: '', detail: message.text });
    });
  }

  clear = (key) => {
    this.messageService.clear(key);
  }
}
