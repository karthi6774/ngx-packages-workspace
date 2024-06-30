A Angular wrapper around File System API -> showSaveFilePicker method to download files.If File System API is not available then fall back to HTML5 saveAs(legacy).

This Package it not yet another wrapper around file-saver or ngx-file-saver
The main goal for creating this package is :

- To use the standard Browser Web Api's to download the files if it is available, otherwise fall back to legacy approach

- Follow Latest appraoch ,reduced bundle size and implement it in angular way.

---

So this package is written from scratch

## for version - 0.1.0 : there are only basic functionality are implemented

1.users must provide blob and filename to saveAs method in service to download the files in File System API - Web Api

ex:

constructor(private bfs: NgxBrowserFilesaver){}

async save(){
/**this will use File System API only if it is available in browser otherwise default to legacy **/
await bfs.saveAs(//your blob, //fileName);// it will return the promise<string>
}

---

to download the file in legacy way

---

await bfs.saveAs(//your blob,//fielName,{useFileSystemApi : false }); // this will only use legacy way

---

available file downloading options

elementRef : this is optional field ,it will use this reference to attach anchor tag in legacy , by default it will append the anchor to document body
useFileSystemApi : boolean - field deafult value is true ,make it false to use legacy appraoch

---

stackblitz demos:
1.demo1 - https://stackblitz.com/edit/angular-standalone-app-full-5vc6zc?file=src%2Fapp%2Fapp.component.ts
2.demo2 - https://stackblitz.com/edit/stackblitz-starters-rorvck?file=src%2Fmain.ts

Note

The package built using angular v.18 and it use standalone features from angular ,so there is no Module
Just provide the service to component

for version - 0.2
1.download the files from url
2.create a directive to download the files from markup
3.to support all versions of angular 2.0 and above
4.validate browser support and polyfills for older browser
