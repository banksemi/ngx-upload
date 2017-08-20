import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    Renderer2,
    Inject
} from '@angular/core';
import {UploadService} from '../services/upload.service';
import {NgForm} from '@angular/forms';
import {DropTargetOptions, NGX_DROP_TARGET_OPTIONS} from '../utils/configuration.model';
import {NgxUploadLogger} from '../utils/logger.model';


/**
 * Transforms a node into a drag and drop zone.
 */
@Directive({
    selector: '[ngxDragAndDrop]',
    exportAs: 'ngxDragAndDrop'
})
export class NgxDragAndDropDirective implements OnInit {

    @Input()
    set ngxDragAndDrop(options: DropTargetOptions) {
        if (options) {
            this.logger.debug(JSON.stringify(options));
            this.options = options;
        }
    }

    @Input() formBinded: NgForm;

    @Output() onDrop = new EventEmitter();

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, this.options.color);
    }

    constructor(private el: ElementRef,
                private renderer: Renderer2,
                private uploader: UploadService,
                private logger: NgxUploadLogger,
                @Inject(NGX_DROP_TARGET_OPTIONS) private options: DropTargetOptions) { }


    @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
        this.logger.info('dragleave event');
        this.renderer.removeClass(this.el.nativeElement, this.options.colorDrag);
        this.renderer.removeClass(this.el.nativeElement, this.options.colorDrop);
        this.renderer.addClass(this.el.nativeElement, this.options.color);
        this.stopAndPrevent(event);
    }

    @HostListener('drop', ['$event']) dropEvent(event: Event) {
        this.logger.info('drop event');
        this.renderer.removeClass(this.el.nativeElement, this.options.color);
        this.renderer.removeClass(this.el.nativeElement, this.options.colorDrag);
        this.renderer.addClass(this.el.nativeElement, this.options.colorDrop);
        const transfer = this.getTransfer(event);
        if (!transfer) {
            return;
        }
        const droppedFiles = transfer.files;
        transfer.dropEffect = 'copy';
        this.onDrop.next(droppedFiles);
        this.stopAndPrevent(event);
        this.uploader.addToQueue(transfer.files, this.formBinded.form);
    }


    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
        this.logger.info('dragover event');
        this.renderer.removeClass(this.el.nativeElement, this.options.color);
        this.renderer.removeClass(this.el.nativeElement, this.options.colorDrop);
        this.renderer.addClass(this.el.nativeElement, this.options.colorDrag);
        const transfer = this.getTransfer(event);
        if (!this.haveFiles(transfer.types)) {
            return;
        }
        this.stopAndPrevent(event);
    }

    private stopAndPrevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    private getTransfer(event): DataTransfer {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    }

    private haveFiles(types: any) {
        if (!types) {
            return false;
        }
        if (types.indexOf) {
            return types.indexOf('Files') !== -1;
        } else if (types.contains) {
            return types.contains('Files');
        } else {
            return false;
        }
    }

}
