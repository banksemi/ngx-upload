import { Component, OnDestroy, OnInit } from '@angular/core';

import { Person } from './person.model';
import { DropTargetOptions, FileItem, HttpClientUploadService, XhrUploadService } from '@wkoza/ngx-upload';


@Component({
    selector: 'app-root',
    templateUrl: './simple.component.html',
    styleUrls: ['./simple.component.css']
})
export class SimpleMaterialComponent implements OnInit {

    model: Person;

    options: DropTargetOptions = {
        color: 'dropZoneColorMaterial',
        colorDrag: 'dropZoneColorDragMaterial',
        colorDrop: 'dropZoneColorDropMaterial'
    };

    constructor(public uploader: HttpClientUploadService) {
    }

    ngOnInit() {

        this.uploader.queue = [];
        this.model = new Person();
        this.uploader.removeAllFromQueue();

        this.uploader.onCancel$.subscribe(
            (data: FileItem) => {
                console.log('file deleted: ' + data.file);

            });

        this.uploader.onProgress$.subscribe(
            (data: any) => {
                console.log('upload file in progree: ' + data.progress);

            });

        this.uploader.onSuccess$.subscribe(
            (data: any) => {
                console.log(`upload file successful:  ${data.item} ${data.body} ${data.status} ${data.headers}`);

            }
        );

    }

    activeRemoveAllBtn(): boolean {
        return this.uploader.queue.some(item => (item.isReady || item.isCancel || item.isError));
    }

    activeUploadAllBtn(): boolean {
        return this.uploader.queue.some(item => (item.isReady));
    }

    activeCancelAllBtn(): boolean {
        return this.uploader.queue.some((item: FileItem) => item.uploadInProgress);
    }


}
