import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Response } from 'src/app/Shared/Model/Response';
import { DocumentModel, DocumentType } from 'src/app/Shared/Model/document';
import { ConfirmationService } from 'primeng/api';
import { MyDocumentService } from '../../Service/services/my-document.service';
import { Table } from 'primeng/table';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';



@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit, OnDestroy {

  private documentType: DocumentType[];
  public documentDetails: any = [];
  @ViewChild('dt') table: Table;
  private subscriptions: Subscription[] = [];

  constructor(
    private cs: ConfirmationService,
    private us: MyDocumentService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(i => {
      if (i.documentId !== undefined) {
        const documentId = i.documentId;
        this.subscriptions[this.subscriptions.length] = this.us.getDocumentData().subscribe((res: Response) => {
          const documentData: DocumentModel[] = res.data.documents;
          this.documentDetails = documentData.find(j => j.documentId === documentId);
        });
      }
    });
    this.us.getDocumentType().then((res: Response) => {
      this.documentType = res.data.documentTypes;
    });
  }
  fetchDocumentType(documentTypeId): any {
    if (this.documentType){
      const docType = this.documentType.find(i => i.documentTypeId === documentTypeId);
      return docType ? docType.name : docType;
    }
  }
  downloadFile(filePath): any {
    this.subscriptions[this.subscriptions.length] = this.us.getFileDownloadPreSignedUrl(filePath).subscribe(res => {
      const preSignedUrl = res.data.preSignedUrl;
      window.open(preSignedUrl, '_blank');
    });
  }
   /**
    * @description Component lifecycle method, gets called when component destroys
    */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
