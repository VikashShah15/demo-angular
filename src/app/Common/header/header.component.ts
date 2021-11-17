import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public userName: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    if (localStorage.getItem('cared-auth') !== null) {
      this.userName = JSON.parse(localStorage.getItem('cared-auth')).firstName
        + ' ' + JSON.parse(localStorage.getItem('cared-auth')).lastName;
    }
  }
}
