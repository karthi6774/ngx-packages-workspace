import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { FileSaveOptions } from './ngx-browser-filesaver.model';
import { DEFAULT_USE_FILE_SYSTEM_API, RESPONSE } from './ngx-browser-filesaver.constants';

@Injectable({
  providedIn: 'root'
})
export class NgxBrowserFilesaverService {
  private window = this.document.defaultView;
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) { }

  public async saveAs(blob: Blob, fileName: string, options?: FileSaveOptions): Promise<string> {
    const useFileSystemApi = options?.useFileSystemApi ?? DEFAULT_USE_FILE_SYSTEM_API;
    const elementRef = options?.elementRef ?? ''

    if (this.window && this.isFileSystemApiSupported() && useFileSystemApi) {
      return await this.saveFileByFileSystemApi(blob, fileName);
    } else {
      return this.saveFileByLegacy(elementRef, blob, fileName);
    }
  }

  private async saveFileByFileSystemApi(blob: Blob, fileName: string) {
    try {
      // Show the file save dialog.
      if (this.window?.showSaveFilePicker) {
        // Show the file save dialog.
        const handle = await this.window.showSaveFilePicker({ suggestedName: fileName });
        // Write the blob to the file.
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return RESPONSE.SUCCESS;
      } else {
        throw new Error('File System Access API is not supported');
      }
    } catch (error: unknown) {
      // Fail silently if there is a error.
      const err = error as unknown as Error;
      console.error(err.name, err.message);
      return RESPONSE.FAILURE;
    }
  }

  private saveFileByLegacy(elementRef: ElementRef | string, blob: Blob, fileName: string) {
    const blobURL = this.window && this.window.URL.createObjectURL(blob);
    if (!blobURL) {
      return RESPONSE.FAILURE;
    }
    const anchorElement = elementRef ? this.renderer.createElement('a') as HTMLAnchorElement : this.document.createElement('a') as HTMLAnchorElement;
    anchorElement.href = blobURL;
    anchorElement.download = fileName;
    anchorElement.style.display = 'none';
    elementRef ? this.renderer.appendChild(elementRef, anchorElement) : this.document.body.appendChild(anchorElement);
    anchorElement.click();
    setTimeout(() => {
      this.window?.URL.revokeObjectURL(blobURL);
      this.renderer.removeChild(anchorElement.parentNode, anchorElement);
    }, 1000);
    return RESPONSE.SUCCESS
  }

  public isFileSystemApiSupported = () => this.window && 'showSaveFilePicker' in this.window;

}
