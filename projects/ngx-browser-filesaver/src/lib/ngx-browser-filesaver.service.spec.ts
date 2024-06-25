import { TestBed } from '@angular/core/testing';

import { NgxBrowserFilesaverService } from './ngx-browser-filesaver.service';

describe('NgxBrowserFilesaverService', () => {
  let service: NgxBrowserFilesaverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxBrowserFilesaverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
