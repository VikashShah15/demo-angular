import { TestBed } from '@angular/core/testing';

import { MyDocumentService } from './my-document.service';

describe('UploadService', () => {
  let service: MyDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
