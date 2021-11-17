import { Component, OnInit } from '@angular/core';
import { MessageServices } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {
  constructor(private messageService: MessageServices) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.messageService.sendMessage({ cmd: '/serviceprovider' });
  }
}
