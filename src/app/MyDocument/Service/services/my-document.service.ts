import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import axios from 'axios';
import { documentApi } from '../../Constant/documentApi.constant';
import { Response } from 'src/app/Shared/Model/Response';
import { CreateDocument } from 'src/app/Shared/Model/document';
import { BaseService } from 'src/app/shared/services/base.service';
// import * as AWS from 'aws-sdk/global';
// import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class MyDocumentService {
  private DocumentType;
  constructor(private http: HttpClient, private bs: BaseService) { }
  getDocumentData(): Observable<Response> {
    return this.http.get<Response>(`${documentApi.document.getDocumentData}`);
  }

  deleteDocumentData(documentId): Observable<Response> {
    return this.http.delete<Response>(`${documentApi.document.deleteDocumentData}`.replace('{documentId}', documentId));
  }
  createDocument(model: CreateDocument): Observable<Response> {
    return this.http.post<Response>(`${documentApi.document.createDocument}`, model);
  }
  createFileUploadRequest(doctype, filetype, filename): Observable<any> {
    return this.http.get(`${documentApi.document.fileUpload}?doctype=${doctype}&filetype=${filetype}&filename=${filename}`);
  }
  uploadFileToS3Bucket(file, url): Promise<any> {
    const formData = new FormData();
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'binary/octet-stream');
    return axios.put(url, file, { headers: { 'Content-Type': 'binary/octet-stream' } });
  }
  getUserPlan(): Observable<Response> {
    return this.http.get<Response>(`${documentApi.document.getUserPlan}`);
  }
  getFileDownloadPreSignedUrl(path): Observable<any> {
    return this.http.get(`${documentApi.document.getFileDownloadPreSignedUrl}?filepath=${path}`);
  }
  updateDocument(documentId, model: CreateDocument): Observable<Response> {
    return this.http.put<Response>(`${documentApi.document.updateDocumentData}`.replace('{documentId}', documentId), model);
  }
  getDocumentType(): Promise<Response> {
    if (this.DocumentType === undefined) {
      const request = this.http.get<Response>(`${documentApi.document.getDocumentType}`).toPromise();
      request.then(res => this.DocumentType = res);
      return request;
    }
    return of(this.DocumentType).toPromise();
  }
}
