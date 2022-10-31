import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'page-block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    taskFinished = false;
    taskTitle = ''

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(e: any): void {

    }

    startTask() {
        window.dispatchEvent(new CustomEvent('emit-event', {
            detail: {
                eventKey: "TasksEvent",
                eventData: {},
                completion: (data) => {
                    this.taskTitle = data.task.Title;
                    this.taskFinished = true;
                }
            }
        }))
    }
}
