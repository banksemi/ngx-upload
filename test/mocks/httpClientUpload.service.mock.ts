import { Inject, Injectable } from '@angular/core';
import { Observable, EMPTY} from 'rxjs';

import { AbstractUploadService } from '../../src/services/abstractUpload.service';
import { NgxUploadLogger } from '../../src/utils/logger.model';
import {
     NGX_UPLOAD_STRATEGY, UploadEndPoint
} from '../../src/utils/configuration.model';
import { FileItem } from '../../src/services/fileItem.model';

@Injectable()
export class HttpClientUploadServiceMock extends AbstractUploadService {

    constructor(protected logger: NgxUploadLogger) {
        super(logger);
    }


    uploadFileItem(fileItem: FileItem, options?: any): Observable<any> {
        return EMPTY;
    }

    cancelFileItem(fileItem: FileItem) {

    }

}

