import { Component, OnInit } from '@angular/core';
import { MessageServices } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-monthly-expenses',
  templateUrl: './monthly-expenses.component.html',
  styleUrls: ['./monthly-expenses.component.scss']
})
export class MonthlyExpensesComponent implements OnInit {
  constructor(
    private messageService: MessageServices
    ) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.messageService.sendMessage({ cmd: '/monthly-expenses' });
  }

}
