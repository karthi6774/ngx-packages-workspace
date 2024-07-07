import { TestBed } from '@angular/core/testing';
import { NgxBrowserFilesaverService } from './ngx-browser-filesaver.service';
import { Renderer2, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RESPONSE } from './ngx-browser-filesaver.constants';

// Extend the Window interface to include the showSaveFilePicker method.
declare global {
  interface Window {
    showSaveFilePicker?: (options: { suggestedName: string }) => Promise<any>;
  }
}

describe('NgxBrowserFilesaverService', () => {
  let service: NgxBrowserFilesaverService;
  let documentMock: any;
  let rendererMock: any;

  beforeEach(() => {
    documentMock = {
      defaultView: {
        URL: {
          createObjectURL: jasmine.createSpy('createObjectURL').and.returnValue('blobURL'),
          revokeObjectURL: jasmine.createSpy('revokeObjectURL')
        },
        // Initially, we include showSaveFilePicker to test for support
        showSaveFilePicker: jasmine.createSpy('showSaveFilePicker').and.returnValue({
          createWritable: jasmine.createSpy('createWritable').and.returnValue({
            write: jasmine.createSpy('write').and.resolveTo(undefined),
            close: jasmine.createSpy('close').and.resolveTo(undefined)
          })
        })
      },
      createElement: jasmine.createSpy('createElement').and.callFake((tag: string) => {
        if (tag === 'a') {
          return document.createElement('a');
        }
        return document.createElement(tag); // Ensure all code paths return a value
      }),
      body: {
        appendChild: jasmine.createSpy('appendChild'),
        removeChild: jasmine.createSpy('removeChild')
      }
    };

    rendererMock = {
      createElement: jasmine.createSpy('createElement').and.callFake((tag: string) => {
        if (tag === 'a') {
          return document.createElement('a');
        }
        return document.createElement(tag); // Ensure all code paths return a value
      }),
      appendChild: jasmine.createSpy('appendChild'),
      removeChild: jasmine.createSpy('removeChild')
    };

    TestBed.configureTestingModule({
      providers: [
        NgxBrowserFilesaverService,
        { provide: DOCUMENT, useValue: documentMock },
        { provide: Renderer2, useValue: rendererMock }
      ]
    });

    service = TestBed.inject(NgxBrowserFilesaverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveAs', () => {
    it('should use FileSystem API if supported and option is enabled', async () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';
      const options = { useFileSystemApi: true };

      spyOn(service, 'isFileSystemApiSupported').and.returnValue(true);
      spyOn(service as any, 'saveFileByFileSystemApi').and.returnValue(Promise.resolve(RESPONSE.SUCCESS));

      const result = await service.saveAs(blob, fileName, options);

      expect(service.isFileSystemApiSupported).toHaveBeenCalled();
      expect(service['saveFileByFileSystemApi']).toHaveBeenCalledWith(blob, fileName);
      expect(result).toBe(RESPONSE.SUCCESS);
    });

    it('should use legacy method if FileSystem API is not supported', async () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';
      const elementRef = new ElementRef(document.createElement('div'));
      const options = { useFileSystemApi: false, elementRef };

      spyOn(service, 'isFileSystemApiSupported').and.returnValue(false);
      spyOn(service as any, 'saveFileByLegacy').and.returnValue(RESPONSE.SUCCESS);

      const result = await service.saveAs(blob, fileName, options);

      expect(service.isFileSystemApiSupported).toHaveBeenCalled();
      expect(service['saveFileByLegacy']).toHaveBeenCalledWith(elementRef, blob, fileName);
      expect(result).toBe(RESPONSE.SUCCESS);
    });
  });

  describe('saveFileByFileSystemApi', () => {
    it('should save file using FileSystem API', async () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';

      const result = await service['saveFileByFileSystemApi'](blob, fileName);

      expect(documentMock.defaultView.showSaveFilePicker).toHaveBeenCalledWith({ suggestedName: fileName });
      expect(result).toBe(RESPONSE.SUCCESS);
    });

    it('should handle errors silently and return FAILURE', async () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';
      documentMock.defaultView.showSaveFilePicker.and.throwError('Test Error');

      const result = await service['saveFileByFileSystemApi'](blob, fileName);

      expect(result).toBe(RESPONSE.FAILURE);
    });
  });

  describe('saveFileByLegacy', () => {
    it('should save file using legacy method', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';
      const elementRef = new ElementRef(document.createElement('div'));

      const result = service['saveFileByLegacy'](elementRef, blob, fileName);

      expect(documentMock.defaultView.URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(result).toBe(RESPONSE.SUCCESS);
    });

    it('should handle missing blobURL and return FAILURE', () => {
      documentMock.defaultView.URL.createObjectURL.and.returnValue(null);
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';
      const elementRef = new ElementRef(document.createElement('div'));

      const result = service['saveFileByLegacy'](elementRef, blob, fileName);

      expect(result).toBe(RESPONSE.FAILURE);
    });
  });

  describe('isFileSystemApiSupported', () => {
    it('should return true if FileSystem API is supported', () => {
      const result = service.isFileSystemApiSupported();
      expect(result).toBe(true);
    });

/*     it('should return false if FileSystem API is not supported', () => {
      documentMock.defaultView.showSaveFilePicker = undefined;
      const result = service.isFileSystemApiSupported();
      expect(result).toBe(false);
    }); */
  });
});
