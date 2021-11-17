import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfMakesService } from '../../Service/pdf-makes.service';
import { AuthService } from '../../Service/auth.service';
import { MessageServices } from 'src/app/shared/services/message.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public userProfileForm: FormGroup;
  public isSubmitted = false;
  constructor(
    private router: Router,
    private as: AuthService,
  ) {
    this.loadForm();
  }
  loadForm(): any {
    this.userProfileForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]{}'^?\\.,!|//#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]),
      name: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      zipcode: new FormControl('', [Validators.required]),
      attechment: new FormControl('')
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    if (localStorage.getItem('cared-openpdf') != null) {
      const pdfData = JSON.parse(localStorage.getItem('cared-openpdf'))[0];
    }
  }
  userProfileSubmit(): any {
    this.isSubmitted = true;
    if (this.userProfileForm.valid) {
    }
  }
}
