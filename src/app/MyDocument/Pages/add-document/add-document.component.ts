import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { Response } from 'src/app/Shared/Model/Response';
import { CreateDocument, DocumentModel, DocumentType } from 'src/app/Shared/Model/document';
import { ConfirmationService, MessageService } from 'primeng/api';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { MyDocumentService } from '../../Service/services/my-document.service';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit, OnDestroy {
  public addDocumentForm: FormGroup;
  public validationConstants = validations;
  public isSubmitted = false;
  public documentType: DocumentType[];
  public Loader = false;
  private url = '';
  public disableUpload = false;
  private file: any = [];
  public documentTitle = '';
  private documentId = '';
  public loading = false;
  public errorForStartDate: any = { isError: false, errorMessage: '' };
  public errorForEndDate: any = { isError: false, errorMessage: '' };
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private us: MyDocumentService,
    private route: ActivatedRoute,
    private cs: ConfirmationService,
    private router: Router,
    private msg: MessageService,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService
  ) {
    this.addDocumentForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      documentTypeId: new FormControl('', [Validators.required]),
      filePath: new FormControl(null),
      fileSize: new FormControl('')
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.us.getDocumentType().then((res: Response) => {
      this.documentType = res.data.documentTypes;
    });
    this.subscriptions[this.subscriptions.length] = this.us.getUserPlan().subscribe((res: Response) => {
      const activeplan = res.data.plans.find(i => i.plan.isActive === true);
      if (activeplan.plan !== undefined) {
        const planId = activeplan.plan.planId;
      }
    });
    this.editDocumentData();
  }
  editDocumentData(): any {
    this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(i => {
      if (i.documentId !== undefined) {
        this.documentTitle = 'Edit Document';
        this.documentId = i.documentId;
        this.subscriptions[this.subscriptions.length] = this.us.getDocumentData().subscribe((res: Response) => {
          const documentData: DocumentModel[] = res.data.documents;
          const documentDetails = documentData.find(j => j.documentId === this.documentId);

          this.addDocumentForm.get('title').setValue(documentDetails.title);
          this.addDocumentForm.get('description').setValue(documentDetails.description);
          this.addDocumentForm.get('startDate').setValue(documentDetails.startDate ?
            new Date(moment.utc(documentDetails.startDate).format()) : '');
          this.addDocumentForm.get('endDate').setValue(documentDetails.endDate ?
            new Date(moment.utc(documentDetails.endDate).format()) : '');
          this.addDocumentForm.get('documentTypeId').setValue(this.fetchDocumentType(documentDetails.documentTypeId));
          this.addDocumentForm.get('filePath').setValue(documentDetails.filePath);
          this.addDocumentForm.get('fileSize').setValue(documentDetails.fileSize);
        });
        this.disableUpload = true;
      }
      else {
        this.documentTitle = 'Add Document';
        this.disableUpload = false;
      }
    });
  }
  fetchDocumentType(documentTypeId): any {
    const docType = this.documentType.find(i => i.documentTypeId === documentTypeId);
    return docType ? docType.documentTypeId : 0;
  }
  documentCreateAndUpdateMethod(): any {
    const model: CreateDocument = this.addDocumentForm.value;
    model.documentTypeId = Number(model.documentTypeId);
    if (this.documentId === '') {
      this.loading = true;
      this.subscriptions[this.subscriptions.length] = this.us.createDocument(model).subscribe((res: Response) => {
        this.loading = false;
        if (res.statusCode === 200) {
          this.ga.eventEmitter(this.gAnalytics.addDocumentData, 'Document', 'cart', 'click', 10);
          this.fds.createData(model, this.fscn.addDocumentData)
            .then(res => {
              /*do something here....
              maybe clear the form or give a success message*/
            });
          this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.addDocumentForm.reset();
          this.router.navigate(['my-document']);
        }
        else {
          this.loading = false;
          this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      },
        error => {
          this.loading = false;
          this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        });
    } else {
      this.loading = true;
      this.subscriptions[this.subscriptions.length] =
        this.us.updateDocument(this.documentId, this.addDocumentForm.value).subscribe((res: Response) => {
          this.loading = false;
          if (res.statusCode === 200) {
            this.ga.eventEmitter(this.gAnalytics.updateDocumentData, 'Document', 'cart', 'click', 10);
            this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.addDocumentForm.reset();
            this.router.navigate(['my-document']);
          }
          else {
            this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
          }
        },
          error => {
            this.loading = false;
            this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          });
    }
  }
  documentSubmit = () => {
    this.isSubmitted = true;
    if (this.addDocumentForm.valid && this.errorForStartDate.isError === false && this.errorForEndDate.isError === false) {
      if (this.file !== null && this.url !== '') {
        this.us.uploadFileToS3Bucket(this.file, this.url).then(res => {
        }, error => {

        });
      }
      if (this.addDocumentForm.get('filePath').value === null) {
        this.cs.confirm({
          message: 'No document file is uploaded. Do you want to proceed?',
          accept: () => {
            this.documentCreateAndUpdateMethod();
          }
        });
      }
      else {
        this.documentCreateAndUpdateMethod();
      }
    }
  }
  handleInputChange(e, form): any {
    this.file = e.files[0];
    if (this.file != null) {
      const splitFileType = this.file.name.substr(this.file.name.lastIndexOf('.') + 1, this.file.name.length);
      let splitFileName = this.file.name.substr(0, this.file.name.lastIndexOf('.'));
      splitFileName = splitFileName.replace(' ', '_');
      this.Loader = true;
      this.subscriptions[this.subscriptions.length] = this.us.createFileUploadRequest('document', splitFileType, splitFileName)
        .subscribe(res => {
          this.url = res.data.fileUploadResponse.presignedUrl;
          const apiFileName = res.data.fileUploadResponse.filePath;
          this.addDocumentForm.get('filePath').setValue(apiFileName);
          this.addDocumentForm.get('fileSize').setValue(this.file.size);
          if (this.addDocumentForm.controls.filePath !== null) {
            this.Loader = false;
          }

        }, error => {

        });
      form.clear();
    }
  }
  compareEndDates(): any {
    if (new Date(this.addDocumentForm.controls.endDate.value) < new Date(this.addDocumentForm.controls.startDate.value)) {
      this.errorForEndDate = { isError: true, errorMessage: this.validationConstants.EndDateNotGreater };
      this.errorForStartDate = { isError: false, errorMessage: '' };
    } else {
      this.errorForEndDate = { isError: false, errorMessage: '' };
      this.errorForStartDate = { isError: false, errorMessage: '' };
    }
  }
  compareStartDates(): any {
    if (new Date(this.addDocumentForm.controls.startDate.value) > new Date(this.addDocumentForm.controls.endDate.value)) {
      this.errorForStartDate = { isError: true, errorMessage: this.validationConstants.StartDateNotGreater };
      this.errorForEndDate = { isError: false, errorMessage: '' };
    } else {
      this.errorForStartDate = { isError: false, errorMessage: '' };
      this.errorForEndDate = { isError: false, errorMessage: '' };
    }
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}

