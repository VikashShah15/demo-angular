import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  private showData = false;
  public agree = false;

  constructor(
    private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    localStorage.removeItem('cared-parse');
    localStorage.removeItem('cared-coreSupportArray');
    localStorage.removeItem('cared-capitalSupportArray');
    localStorage.removeItem('cared-capacitySupportArray');
  }
  check = (value) => {
    if (value === true) {
      this.agree = true;
    } else {
      this.agree = false;
    }
  }
  agreeCondition = () => {
    if (this.agree === false) {
      this.showData = false;
    } else {
      this.router.navigate(['/planparser/']);
      this.showData = true;
    }
  }
}
