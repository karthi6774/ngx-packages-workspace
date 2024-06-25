import { Inject, Injectable, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { FileSaveOptions } from './ngx-browser-filesaver.model';

@Injectable({
  providedIn: 'root'
})
export class NgxBrowserFilesaverService {

  constructor(@Inject(DOCUMENT) private document: Document,private renderer: Renderer2) { }

  public async saveAs(blob: Blob,fileName: string, options ?: FileSaveOptions){
    const window  = this.document.defaultView
    const supportsFileSystemApi = window && 'showSaveFilePicker' in window;
    const useFileSystemApi = options?.useFileSystemApi ?? false;
    const elementRef = options?.elementRef ?? ''

    if(supportsFileSystemApi && useFileSystemApi){
      try {
        // Show the file save dialog.
        const handle = await window.showSaveFilePicker({suggestedName : fileName});
        // Write the blob to the file.
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        // Fail silently if the user has simply canceled the dialog.
/*         if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
          return;
        } */
       console.error(err);
       return;
      }
    }else{
      const blobURL  = window && window.URL.createObjectURL(blob);
      if(!blobURL){
        return;
      }
      if(elementRef){
        const anchorElement  =  this.renderer.createElement('a') as HTMLAnchorElement;
        anchorElement.href = blobURL;
        anchorElement.download = fileName;
        anchorElement.style.display = 'none';
        this.renderer.appendChild(elementRef,anchorElement);
        anchorElement.click();
        setTimeout(()=>{
          window.URL.revokeObjectURL(blobURL);
          this.renderer.removeChild(anchorElement.parentNode,anchorElement);
        },1000);
      }else{
        const anchorElement  =  this.document.createElement('a') as HTMLAnchorElement;
        anchorElement.href = blobURL;
        anchorElement.download = fileName;
        anchorElement.style.display = 'none';
        this.document.body.appendChild(anchorElement);
        anchorElement.click();
        setTimeout(()=>{
          window.URL.revokeObjectURL(blobURL);
          this.renderer.removeChild(anchorElement.parentNode,anchorElement);
        },1000);
      }
    }
  }

}
