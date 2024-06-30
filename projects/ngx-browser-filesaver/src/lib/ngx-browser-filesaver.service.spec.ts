/* import { TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgxBrowserFilesaverService } from './ngx-browser-filesaver.service';

// Extend the window interface to include showSaveFilePicker
declare global {
  interface Window {
    showSaveFilePicker?: (options?: { suggestedName?: string }) => Promise<FileSystemFileHandle>;
  }

  interface FileSystemFileHandle {
    createWritable: (options?: FileSystemCreateWritableOptions) => Promise<FileSystemWritableFileStream>;
  }

  interface FileSystemWritableFileStream {
    write: (data: FileSystemWriteChunkType) => Promise<void>;
    close: () => Promise<void>;
  }

  interface FileSystemCreateWritableOptions {
    keepExistingData?: boolean;
  }
}

describe('NgxBrowserFilesaverService', () => {
  let service: NgxBrowserFilesaverService;
  let mockDocument: Document;
  let mockRenderer: Renderer2;

  beforeEach(() => {
    mockDocument = document;
    mockRenderer = jasmine.createSpyObj('Renderer2', ['createElement', 'appendChild', 'removeChild']);

    TestBed.configureTestingModule({
      providers: [
        NgxBrowserFilesaverService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: Renderer2, useValue: mockRenderer }
      ]
    });

    service = TestBed.inject(NgxBrowserFilesaverService);
  });

  it('should return true if FileSystem API is supported', () => {
    spyOnProperty(window, 'showSaveFilePicker', 'get').and.returnValue(() => Promise.resolve({
      createWritable: () => Promise.resolve({
        write: () => Promise.resolve(),
        close: () => Promise.resolve()
      })
    }));

    expect(service.isFileSystemApiSupported()).toBeTrue();
  });

  it('should return false if FileSystem API is not supported', () => {
    spyOnProperty(window, 'showSaveFilePicker', 'get').and.returnValue(undefined);

    expect(service.isFileSystemApiSupported()).toBeFalse();
  });

  it('should return false if window is undefined', () => {
    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      configurable: true
    });

    expect(service.isFileSystemApiSupported()).toBeFalse();

    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true
    });
  });

  it('should return false if window is null', () => {
    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, 'window', {
      value: null,
      configurable: true
    });

    expect(service.isFileSystemApiSupported()).toBeFalse();

    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true
    });
  });

  it('should return false if window does not have showSaveFilePicker property', () => {
    spyOnProperty(window, 'showSaveFilePicker', 'get').and.returnValue(undefined);

    expect(service.isFileSystemApiSupported()).toBeFalse();
  });
});
 */
