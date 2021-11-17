import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Response } from 'src/app/Shared/Model/Response';
import { DocumentModel, DocumentType } from 'src/app/Shared/Model/document';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MyDocumentService } from '../../Service/services/my-document.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {
  public documentType: DocumentType[];
  public documentData: DocumentModel[];
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  constructor(
    private cs: ConfirmationService,
    private us: MyDocumentService,
    private route: ActivatedRoute,
    private msg: MessageService,
    private ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  getConvertedDocumentTypeData(data): any {
    const convertedData = [];

    data.forEach(doc => {
      const obj = {};

      obj['label'] = doc.name;
      obj['documentTypeId'] = doc.documentTypeId;
      convertedData.push(obj);

    });

    return convertedData;
  }

  loadData(): any {
    this.subscriptions[this.subscriptions.length] = this.us.getDocumentData().subscribe((res: Response) => {
      this.documentData = res.data.documents;
      this.documentData.forEach(element => {
        element.documentTypes = { documentTypeId: element.documentTypeId, name: this.fetchDocumentType(element.documentTypeId) };
      });
    });
    this.us.getDocumentType().then((res: Response) => {
      this.documentType = res.data.documentTypes;
    });
  }
  deleteDocument = (documentId) => {
    this.cs.confirm({
      message: 'Are you sure that you want to delete this document?',
      accept: () => {
        this.subscriptions[this.subscriptions.length] = this.us.deleteDocumentData(documentId).subscribe((res: Response) => {
          this.loadData();
          if (res.statusCode === 200) {
            this.ga.eventEmitter(this.gAnalytics.deleteDocumentData, 'Document', 'cart', 'click', 10);
            this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
          }
          else {
            this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
          }
        },
          error => {
            this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          });
      }
    });
  }
  fetchDocumentType(documentTypeId): any {
    if (this.documentType) {
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
